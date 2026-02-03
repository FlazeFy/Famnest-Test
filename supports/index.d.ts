/// <reference types="cypress" />
declare namespace Cypress {
    interface Chainable {
        expectKeyExist(target: any, keys: string[]): Chainable<void>
        expectDefaultResponseProps(res: any, code: number, message: string): Chainable<void>
        useLogin(role?: string): Chainable<string>
    }
}
  