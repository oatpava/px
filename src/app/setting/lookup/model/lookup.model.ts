export class Lookup {
    version: number
    id: number
    name: string
    constructor(values: Object = {}) {
        this.version = 0
        this.id = 0
        this.name = ''
        Object.assign(this, values)
    }
}
