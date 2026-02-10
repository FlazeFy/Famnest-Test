describe("Meal API - POST Meal", () => {
    const loremData = Cypress.env("lorem")
    const url = "/api/v1/meals"
    let userToken: any
    let userWithFamilyToken: any
    let adminToken: any

    before(() => {
        cy.useLogin("user").then((token: string) => {
            userToken = token
        })
        cy.useLogin("user_with_family").then((token: string) => {
            userWithFamilyToken = token
        })
        cy.useLogin("admin").then((token: string) => {
            adminToken = token
        })
    })

    describe("Success cases", () => {
        it("should send meal successfully with valid payload", () => {
            cy.request({
                method: "POST", 
                url, 
                headers: {
                    Authorization: `Bearer ${userWithFamilyToken}`
                },
                body: {
                    meal_name: loremData.short,
                    meal_desc: loremData.short,
                    meal_day: 'sun',
                    meal_time: 'lunch'
                }
            }).then((res) => {
                cy.expectDefaultResponseProps(res, 201, 'Meal created')
            })
        })
    })
  
    describe("Failed cases", () => {
        it("should fail if the user dont have a family", () => {
            cy.request({
                method: "POST",
                url,
                headers: {
                    Authorization: `Bearer ${userToken}`
                },
                body: { 
                    meal_name: loremData.short,
                    meal_desc: loremData.short,
                    meal_day: 'sun',
                    meal_time: 'lunch'
                },
                failOnStatusCode: false
            }).then((res) => {
                cy.expectDefaultResponseProps(res, 400, 'Family not found')
            })
        })
        it("should fail if the meal is already exist", () => {
            cy.request({
                method: "POST",
                url,
                headers: {
                    Authorization: `Bearer ${userWithFamilyToken}`
                },
                body: { 
                    meal_name: loremData.short,
                    meal_desc: loremData.short,
                    meal_day: 'sun',
                    meal_time: 'lunch'
                },
                failOnStatusCode: false
            }).then((res) => {
                cy.expectDefaultResponseProps(res, 409, 'Meal is already exist')
            })
        })
        it("should fail if the meal is sended by admin", () => {
            cy.request({
                method: "POST",
                url,
                headers: {
                    Authorization: `Bearer ${adminToken}`
                },
                body: { 
                    meal_name: loremData.short,
                    meal_desc: loremData.short,
                    meal_day: 'fri',
                    meal_time: 'lunch'
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
                    Authorization: `Bearer ${userWithFamilyToken}`
                },
                body: { 
                    meal_name: loremData.short,
                    meal_desc: loremData.medium,
                    meal_day: 'fri',
                    meal_time: 'lunch'
                },
                failOnStatusCode: false
            }).then((res) => {
                cy.expectDefaultResponseProps(res, 422, 'Validation error')
                cy.expectKeyExist(res.body.data, ["meal_desc"])
                expect(res.body.data.meal_desc).to.eq("meal_desc must be at most 255 characters")
            })
        })
        it("should fail with failed validation : required payload's is empty", () => {
            cy.request({
                method: "POST",
                url,
                headers: {
                    Authorization: `Bearer ${userWithFamilyToken}`
                },
                body: { 
                    meal_desc: loremData.medium,
                    meal_day: 'fri',
                    meal_time: 'lunch'
                },
                failOnStatusCode: false
            }).then((res) => {
                cy.expectDefaultResponseProps(res, 422, 'Validation error')
                cy.expectKeyExist(res.body.data, ["meal_name"])
                expect(res.body.data.meal_name).to.eq("meal_name is required")
            })
        })
        it("should fail with failed validation : empty request body", () => {
            cy.request({
                method: "POST",
                url,
                headers: {
                    Authorization: `Bearer ${userWithFamilyToken}`
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
  