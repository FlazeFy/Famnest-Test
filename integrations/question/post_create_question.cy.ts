describe("Question API - POST Question", () => {
    const loremData = Cypress.env("lorem")
    const userData = Cypress.env("user")
    const url = "/api/v1/questions"

    describe("Success cases", () => {
        it("should send question successfully with valid payload", () => {
            cy.request({
                method: "POST", 
                url, 
                body: {
                    question: loremData.short,
                    email: userData.email
                }
            }).then((res) => {
                cy.expectDefaultResponseProps(res, 201, 'Question sended')
            })
        })
    })
  
    describe("Failed cases", () => {
        it("should fail with failed validation : payload's character length is more than maximum requirement", () => {
            cy.request({
                method: "POST",
                url,
                body: { 
                    question: loremData.medium, 
                    email: userData.email
                },
                failOnStatusCode: false
            }).then((res) => {
                cy.expectDefaultResponseProps(res, 422, 'Validation error')
                cy.expectKeyExist(res.body.data, ["question"])
                cy.expect(res.body.data.question).to.eq("question must be at most 255 characters")
            })
        })
        it("should fail with failed validation : question's email is not a valid email", () => {
            cy.request({
                method: "POST",
                url,
                body: { 
                    question: loremData.short, 
                    email: loremData.medium
                },
                failOnStatusCode: false
            }).then((res) => {
                cy.expectDefaultResponseProps(res, 422, 'Validation error')
                cy.expectKeyExist(res.body.data, ["email"])
                cy.expect(res.body.data.email).to.eq("email must be a valid gmail address")
            })
        })
        it("should fail with failed validation : required payload's is empty", () => {
            cy.request({
                method: "POST",
                url,
                body: { 
                    question: loremData.short
                },
                failOnStatusCode: false
            }).then((res) => {
                cy.expectDefaultResponseProps(res, 422, 'Validation error')
                cy.expectKeyExist(res.body.data, ["email"])
                cy.expect(res.body.data.email).to.eq("email is required")
            })
        })
        it("should fail with failed validation : empty request body", () => {
            cy.request({
                method: "POST",
                url,
                failOnStatusCode: false
            }).then((res) => {
                cy.expectDefaultResponseProps(res, 422, 'Validation error')
                cy.expectKeyExist(res.body.data, ["body"])
                cy.expect(res.body.data.body).to.eq("Request body is required")
            })
        })
    })
})
  