describe("Feedback API - POST Feedback", () => {
    const loremData = Cypress.env("lorem")
    const url = "/api/v1/feedbacks"
    let userToken: any
    let adminToken: any

    before(() => {
        cy.useLogin("user").then((token: string) => {
            userToken = token
        })
        cy.useLogin("admin").then((token: string) => {
            adminToken = token
        })
    })

    describe("Success cases", () => {
        it("should send feedback successfully with valid payload", () => {
            cy.request({
                method: "POST", 
                url, 
                headers: {
                    Authorization: `Bearer ${userToken}`
                },
                body: {
                    feedback_rate: 9,
                    feedback_body: loremData.short
                }
            }).then((res) => {
                cy.expectDefaultResponseProps(res, 201, 'Feedback sended')
            })
        })
    })
  
    describe("Failed cases", () => {
        it("should fail if the feedback is sended by admin", () => {
            cy.request({
                method: "POST",
                url,
                headers: {
                    Authorization: `Bearer ${adminToken}`
                },
                body: { 
                    feedback_rate: 9,
                    feedback_body: loremData.short 
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
                    feedback_rate: 9, 
                    feedback_body: loremData.medium
                },
                failOnStatusCode: false
            }).then((res) => {
                cy.expectDefaultResponseProps(res, 422, 'Validation error')
                cy.expectKeyExist(res.body.data, ["feedback_body"])
                expect(res.body.data.feedback_body).to.eq("feedback_body must be at most 255 characters")
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
                    feedback_rate: 9
                },
                failOnStatusCode: false
            }).then((res) => {
                cy.expectDefaultResponseProps(res, 422, 'Validation error')
                cy.expectKeyExist(res.body.data, ["feedback_body"])
                expect(res.body.data.feedback_body).to.eq("feedback_body is required")
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
  