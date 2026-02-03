/**
 * Custom command to assert that an object has all given properties by keys name
 * @param target The object to check
 * @param keys Array of property names
 */
Cypress.Commands.add("expectKeyExist", (target: any, keys: string[]) => {
    keys.forEach((key) => {
        expect(target).to.have.property(key)
    })
})
  
/**
 * Custom command to assert that an API response has default properties such as status and message
 * @param res API response
 * @param code Number of http status code
 * @param message String of response message
 */
Cypress.Commands.add("expectDefaultResponseProps", (res: any, code: number, message: string) => {
    expect(res.status).to.eq(code)
    expect(res.body.message).to.eq(message)
})

/**
 * Custom command to get auth token from login API
 * @param role define its that user / admin 
 */
Cypress.Commands.add("useLogin", (role = "user") => {
    const credentials = Cypress.env(role)

    return cy.request("POST", "/api/v1/auths/login", {
        email: credentials.email,
        password: credentials.password
    })
    .then((res) => {
        const token = res.body.data.token
        expect(token).to.be.a("string")
        return token
    })
})