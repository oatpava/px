export class UserProfileType {
    version: number
    id: number
    name: string
    constructor(values: Object = {}) {
        this.version = 1
        this.id = 0
        this.name = ""
        Object.assign(this, values)            
    }
}