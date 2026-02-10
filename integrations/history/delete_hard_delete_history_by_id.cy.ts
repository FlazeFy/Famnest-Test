describe("History API - DELETE History By Id", () => {
    const url = "/api/v1/histories"
    const id = Cypress.env("id")
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

    describe("Failed cases", () => {
        it("should fail if the history is deleted by admin", () => {
            cy.request({
                method: "DELETE",
                url: `${url}/${id.history}`, 
                headers: {
                    Authorization: `Bearer ${adminToken}`
                },
                failOnStatusCode: false
            }).then((res) => {
                cy.expectDefaultResponseProps(res, 403, 'Your role is not authorized')
            })
        })
        it("should fail if the history not found", () => {
            cy.request({
                method: "DELETE",
                url: `${url}/${id.not_found}`, 
                headers: {
                    Authorization: `Bearer ${userToken}`
                },
                failOnStatusCode: false
            }).then((res) => {
                cy.expectDefaultResponseProps(res, 404, 'History not found')
            })
        })
        it("should fail with failed validation : id is not valid uuid", () => {
            cy.request({
                method: "DELETE",
                url: `${url}/${id.invalid}`, 
                headers: {
                    Authorization: `Bearer ${userToken}`
                },
                failOnStatusCode: false
            }).then((res) => {
                cy.expectDefaultResponseProps(res, 422, 'Validation error')
                cy.expectKeyExist(res.body.data, ["id"])
                expect(res.body.data.id).to.eq("id must be at least 36 characters")
            })
        })
    })

    describe("Success cases", () => {
        it("should delete history successfully with valid id", () => {
            cy.request({
                method: "DELETE", 
                url: `${url}/${id.history}`, 
                headers: {
                    Authorization: `Bearer ${userToken}`
                }
            }).then((res) => {
                cy.expectDefaultResponseProps(res, 200, 'Delete history successful')
            })
        })
    })
})