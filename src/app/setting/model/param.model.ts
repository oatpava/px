import { User } from './user.model'

// export class User {
// 	version: number
//     id: number
//     name: string
//     passwords: string
//     activeDate: any
//     expireDate: any
//     passwordExpireDate: any 
//     status: UserStatus
//     constructor(values: Object = {}) {
//         this.version = 1
//         this.id = 1
//         this.name = ''
//         this.passwords = ''
//         this.activeDate = null
//         this.expireDate = null
//         this.passwordExpireDate = null
//         this.status = new UserStatus 
//         Object.assign(this, values)
//     }

// }

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
