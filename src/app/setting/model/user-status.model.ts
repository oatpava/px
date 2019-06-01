export class UserStatus {
    version: number
    id: number
    name: string
    constructor(values: Object = {}) {
        this.version = 1
        this.id = 1
        this.name = null
        Object.assign(this, values)
    }
}