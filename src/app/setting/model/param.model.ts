import { User } from './user.model'

export class Param {
    version: number
    id: number
    paramName: string
    paramValue: string
}

export class userParam {
    version: number
    id: number
    user: User
    paramName: string
    paramValue: string

    constructor(values: Object = {}) {
        this.version = 1
        this.id = 1
        this.paramName = ''
        this.paramValue = ''
        this.user = new User
        Object.assign(this, values)
    }
}
