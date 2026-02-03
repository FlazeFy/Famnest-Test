describe("Auth API - POST Login", () => {
    const userData = Cypress.env("user")
    const adminData = Cypress.env("admin")
    const url = "/api/v1/auths/login"

    describe("Success cases", () => {
        it("should login successfully with user account", () => {
            cy.request("POST", url, {
                email: userData.email,
                password: userData.password
            }).then((res) => {
                cy.expectDefaultResponseProps(res, 200, 'Login successful')
                expect(res.body.data.role).to.eq('user')
                cy.expectKeyExist(res.body.data, ["token", "name", "email", "role"])
            })
        })
        it("should login successfully with admin account", () => {
            cy.request("POST", url, {
                email: adminData.email,
                password: adminData.password
            }).then((res) => {
                cy.expectDefaultResponseProps(res, 200, 'Login successful')
                expect(res.body.data.role).to.eq('admin')
                cy.expectKeyExist(res.body.data, ["token", "name", "email", "role"])
            })
        })
    })
  
    describe("Failed cases", () => {
        it("should fail with wrong password", () => {
            cy.request({
                method: "POST",
                url,
                body: { 
                    email: userData.email, 
                    password: "wrongpassword" 
                },
                failOnStatusCode: false
            }).then((res) => {
                cy.expectDefaultResponseProps(res, 401, 'Invalid email or password')
            })
        })
        it("should fail with failed validation : payload's character length is less than minimum requirement", () => {
            cy.request({
                method: "POST",
                url,
                body: { 
                    email: userData.email, 
                    password: "nopas" 
                },
                failOnStatusCode: false
            }).then((res) => {
                cy.expectDefaultResponseProps(res, 422, 'Validation error')
                cy.expectKeyExist(res.body.data, ["password"])
                cy.expect(res.body.data.password).to.eq("password must be at least 6 characters")
            })
        })
        it("should fail with failed validation : required payload's is empty", () => {
            cy.request({
                method: "POST",
                url,
                body: { 
                    email: userData.email
                },
                failOnStatusCode: false
            }).then((res) => {
                cy.expectDefaultResponseProps(res, 422, 'Validation error')
                cy.expectKeyExist(res.body.data, ["password"])
                cy.expect(res.body.data.password).to.eq("password is required")
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
  