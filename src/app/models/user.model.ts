export class User {
    constructor (public email: string, public authToken: string) {}

    get token() {
        return this.authToken
    }
}