import { PrivateGroupUser } from "./privateGroupUser.model";

export class PrivateGroup {
    version: number
    id: number
    ownerId: number
    groupName: string
    listUser: PrivateGroupUser[]
    type: number

    constructor(values: Object = {}) {
        this.version = 1
        this.id = 0,
        this.ownerId = 0,
        this.groupName = '',
        this.listUser = null,
        this.type = 0,
        Object.assign(this, values)
    }
}