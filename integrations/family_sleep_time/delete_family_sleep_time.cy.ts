describe("Family Sleep Time API - DELETE Family Sleep Time", () => {
    const url = "/api/v1/family_sleep_time"
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
        it("should delete family sleep time successfully with user account, have family, and family sleep already set up before", () => {
            cy.request({
                method: "DELETE", 
                url, 
                headers: {
                    Authorization: `Bearer ${userToken}`
                }
            }).then((res) => {
                cy.expectDefaultResponseProps(res, 200, 'Delete sleep time successful')
            })
        })
    })
  
    describe("Failed cases", () => {
        it("should fail if the family sleep time is sent by admin", () => {
            cy.request({
                method: "DELETE",
                url,
                headers: {
                    Authorization: `Bearer ${adminToken}`
                },
                failOnStatusCode: false
            }).then((res) => {
                cy.expectDefaultResponseProps(res, 403, 'Your role is not authorized')
            })
        })
        it("should fail if the family sleep time is deleted by user who dont have family", () => {
            cy.request({
                method: "DELETE",
                url,
                headers: {
                    Authorization: `Bearer ${userNoFamilyToken}`
                },
                failOnStatusCode: false
            }).then((res) => {
                cy.expectDefaultResponseProps(res, 404, 'Family not found')
            })
        })
        it("should fail if the family sleep time is not exist", () => {
            cy.request({
                method: "DELETE",
                url,
                headers: {
                    Authorization: `Bearer ${userToken}`
                },
                failOnStatusCode: false
            }).then((res) => {
                cy.expectDefaultResponseProps(res, 404, 'Sleep time not found')
            })
        })
    })
})
  