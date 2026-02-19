describe("Family Sleep Time API - POST Create Family Sleep Time", () => {
    const url = "/api/v1/family_sleep_time"
    const hour_start: string = "00:30"
    const hour_end: string = "04:00"
    let userToken: any
    let userNoFamilyToken: any
    let adminToken: any

    before(() => {
        cy.useLogin("user").then((token: string) => {
            userToken = token
        })
        cy.useLogin("user_no_family").then((token: string) => {
            userNoFamilyToken = token
        })
        cy.useLogin("admin").then((token: string) => {
            adminToken = token
        })
    })

    describe("Success cases", () => {
        it("should create family sleep time successfully with user account, have family, and valid payload", () => {
            cy.request({
                method: "POST", 
                url, 
                headers: {
                    Authorization: `Bearer ${userToken}`
                },
                body: { hour_start, hour_end }
            }).then((res) => {
                cy.expectDefaultResponseProps(res, 201, `Sleep time created, start from ${hour_start} until ${hour_end}`)
            })
        })
    })
  
    describe("Failed cases", () => {
        it("should fail if the family sleep time is sent by admin", () => {
            cy.request({
                method: "POST",
                url,
                headers: {
                    Authorization: `Bearer ${adminToken}`
                },
                body: { hour_start, hour_end },
                failOnStatusCode: false
            }).then((res) => {
                cy.expectDefaultResponseProps(res, 403, 'Your role is not authorized')
            })
        })
        it("should fail if the family sleep time is sent by user who dont have family", () => {
            cy.request({
                method: "POST",
                url,
                headers: {
                    Authorization: `Bearer ${userNoFamilyToken}`
                },
                body: { hour_start, hour_end },
                failOnStatusCode: false
            }).then((res) => {
                cy.expectDefaultResponseProps(res, 404, 'Family not found')
            })
        })
        it("should fail with failed validation : time is not valid", () => {
            cy.request({
                method: "POST",
                url,
                headers: {
                    Authorization: `Bearer ${userToken}`
                },
                body: { hour_start: "00:64", hour_end },
                failOnStatusCode: false
            }).then((res) => {
                cy.expectDefaultResponseProps(res, 422, 'Time is not valid')
            })
        })
        it("should fail with failed validation : payload's character length is less than minimum requirement", () => {
            cy.request({
                method: "POST",
                url,
                headers: {
                    Authorization: `Bearer ${userToken}`
                },
                body: { hour_start: "00:3", hour_end },
                failOnStatusCode: false
            }).then((res) => {
                cy.expectDefaultResponseProps(res, 422, 'Validation error')
                cy.expectKeyExist(res.body.data, ["hour_start"])
                expect(res.body.data.hour_start).to.eq("hour_start must be at least 5 characters")
            })
        })
        it("should fail with failed validation : required payload's is empty", () => {
            cy.request({
                method: "POST",
                url,
                headers: {
                    Authorization: `Bearer ${userToken}`
                },
                body: { hour_start },
                failOnStatusCode: false
            }).then((res) => {
                cy.expectDefaultResponseProps(res, 422, 'Validation error')
                cy.expectKeyExist(res.body.data, ["hour_end"])
                expect(res.body.data.hour_end).to.eq("hour_end is required")
            })
        })
        it("should fail with failed validation : empty request body", () => {
            cy.request({
                method: "POST",
                url,
                headers: {
                    Authorization: `Bearer ${userToken}`
                },
                failOnStatusCode: false
            }).then((res) => {
                cy.expectDefaultResponseProps(res, 422, 'Validation error')
                cy.expectKeyExist(res.body.data, ["body"])
                expect(res.body.data.body).to.eq("Request body is required")
            })
        })
    })
})
  