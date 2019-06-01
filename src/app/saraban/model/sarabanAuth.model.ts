export class SarabanAuth {
    id: number
    name: string
    subModuleAuthId: number
    auth: boolean

    constructor(values: Object = {}) {
        this.id = 0
        this.name = ''
        this.subModuleAuthId = 0
        this.auth = true
        Object.assign(this, values)
    }
}