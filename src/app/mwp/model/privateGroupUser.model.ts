import { Structure } from "../../setting/model/structure.model"

export class PrivateGroupUser {
    version: number
    id: number
    privateGroupId: number
    userId: number
    userName: string
    userType: number
    email: string
    structure: Structure

    constructor(values: Object = {}) {
        this.version = 1
        this.id = 0,
        this.privateGroupId = 0,
        this.userId = 0
        this.userName = '',
        this.userType = 0,
        this.email = '',
        this.structure = new Structure()
        Object.assign(this, values)
    }
}