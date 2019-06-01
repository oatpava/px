import { UserStatus } from './user-status.model'

export class User {
	version: number
    id: number
    name: string
    passwords: string
    activeDate: any
    expireDate: any
    passwordExpireDate: any 
    status: UserStatus
    constructor(values: Object = {}) {
        this.version = 1
        this.id = 1
        this.name = ''
        this.passwords = ''
        this.activeDate = null
        this.expireDate = null
        this.passwordExpireDate = null
        this.status = new UserStatus 
        Object.assign(this, values)
    }

}
