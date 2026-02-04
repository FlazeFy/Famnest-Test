describe("Allergic API - POST Allergic", () => {
    const loremData = Cypress.env("lorem")
    const url = "/api/v1/allergics"
    let userToken 
    let adminToken

    before(() => {
        cy.useLogin("user").then((token: string) => {
            console.log(token)
            userToken = token
        })
        cy.useLogin("admin").then((token: string) => {
            adminToken = token
        })
    })

    describe("Success cases", () => {
        it("should send allergic successfully with valid payload", () => {
            cy.request({
                method: "POST", 
                url, 
                headers: {
                    Authorization: `Bearer ${userToken}`
                },
                body: {
                    allergic_context: loremData.short,
                    allergic_desc: loremData.short
                }
            }).then((res) => {
                cy.expectDefaultResponseProps(res, 201, 'Allergic created')
            })
        })
    })
  
    describe("Failed cases", () => {
        it("should fail if the allergic is already exist", () => {
            cy.request({
                method: "POST",
                url,
                headers: {
                    Authorization: `Bearer ${userToken}`
                },
                body: { 
                    allergic_context: loremData.short,
                    allergic_desc: loremData.short 
                },
                failOnStatusCode: false
            }).then((res) => {
                cy.expectDefaultResponseProps(res, 409, 'Allergic is already exist')
            })
        })
        it("should fail if the allergic is sended by admin", () => {
            cy.request({
                method: "POST",
                url,
                headers: {
                    Authorization: `Bearer ${adminToken}`
                },
                body: { 
                    allergic_context: loremData.short,
                    allergic_desc: loremData.short 
                },
                failOnStatusCode: false
            }).then((res) => {
                cy.expectDefaultResponseProps(res, 403, 'Your role is not authorized')
            })
        })
        it("should fail with failed validation : payload's character length is more than maximum requirement", () => {
            cy.request({
                method: "POST",
                url,
                headers: {
                    Authorization: `Bearer ${userToken}`
                },
                body: { 
                    allergic_context: loremData.short, 
                    allergic_desc: loremData.medium
                },
                failOnStatusCode: false
            }).then((res) => {
                cy.expectDefaultResponseProps(res, 422, 'Validation error')
                cy.expectKeyExist(res.body.data, ["allergic_desc"])
                expect(res.body.data.allergic_desc).to.eq("allergic_desc must be at most 255 characters")
            })
        })
        it("should fail with failed validation : required payload's is empty", () => {
            cy.request({
                method: "POST",
                url,
                headers: {
                    Authorization: `Bearer ${userToken}`
                },
                body: { 
                    allergic_desc: loremData.short
                },
                failOnStatusCode: false
            }).then((res) => {
                cy.expectDefaultResponseProps(res, 422, 'Validation error')
                cy.expectKeyExist(res.body.data, ["allergic_context"])
                expect(res.body.data.allergic_context).to.eq("allergic_context is required")
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
  