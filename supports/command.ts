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