describe("Dictionary API - POST Dictionary", () => {
    const loremData = Cypress.env("lorem")
    const url = "/api/v1/dictionaries"
    let userToken 
    let adminToken

    before(() => {
        cy.useLogin("user").then((token: string) => {
            userToken = token
        })
        cy.useLogin("admin").then((token: string) => {
            adminToken = token
        })
    })

    describe("Success cases", () => {
        it("should send dictionary successfully with valid payload", () => {
            cy.request({
                method: "POST", 
                url, 
                headers: {
                    Authorization: `Bearer ${adminToken}`
                },
                body: {
                    dictionary_name: loremData.short,
                    dictionary_desc: loremData.short,
                    dictionary_type: 'event_category',
                }
            }).then((res) => {
                cy.expectDefaultResponseProps(res, 201, 'Dictionary created')
            })
        })
    })
  
    describe("Failed cases", () => {
        it("should fail if the dictionary is sended by user", () => {
            cy.request({
                method: "POST",
                url,
                headers: {
                    Authorization: `Bearer ${userToken}`
                },
                body: { 
                    dictionary_name: loremData.short,
                    dictionary_desc: loremData.short,
                    dictionary_type: 'event_category',
                },
                failOnStatusCode: false
            }).then((res) => {
                cy.expectDefaultResponseProps(res, 403, 'Your role is not authorized')
            })
        })
        it("should fail if the dictionary is already exist", () => {
            cy.request({
                method: "POST",
                url,
                headers: {
                    Authorization: `Bearer ${adminToken}`
                },
                body: { 
                    dictionary_name: 'birthday',
                    dictionary_desc: loremData.short,
                    dictionary_type: 'event_category',
                },
                failOnStatusCode: false
            }).then((res) => {
                cy.expectDefaultResponseProps(res, 409, 'Dictionary is already exist')
            })
        })
        it("should fail with failed validation : payload's character length is more than maximum requirement", () => {
            cy.request({
                method: "POST",
                url,
                headers: {
                    Authorization: `Bearer ${adminToken}`
                },
                body: { 
                    dictionary_name: loremData.short,
                    dictionary_desc: loremData.medium,
                    dictionary_type: 'event_category',
                },
                failOnStatusCode: false
            }).then((res) => {
                cy.expectDefaultResponseProps(res, 422, 'Validation error')
                cy.expectKeyExist(res.body.data, ["dictionary_desc"])
                expect(res.body.data.dictionary_desc).to.eq("dictionary_desc must be at most 255 characters")
            })
        })
        it("should fail with failed validation : required payload's is empty", () => {
            cy.request({
                method: "POST",
                url,
                headers: {
                    Authorization: `Bearer ${adminToken}`
                },
                body: { 
                    dictionary_desc: loremData.short,
                    dictionary_type: 'event_category',
                },
                failOnStatusCode: false
            }).then((res) => {
                cy.expectDefaultResponseProps(res, 422, 'Validation error')
                cy.expectKeyExist(res.body.data, ["dictionary_name"])
                expect(res.body.data.dictionary_name).to.eq("dictionary_name is required")
            })
        })
        it("should fail with failed validation : empty request body", () => {
            cy.request({
                method: "POST",
                url,
                headers: {
                    Authorization: `Bearer ${adminToken}`
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
  