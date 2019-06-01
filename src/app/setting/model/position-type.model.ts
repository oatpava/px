export class PositionType {
    version: number
    id: number
    name: string
    abbr: string
    constructor(values: Object = {}) {
        this.version = 1
        this.id = 1
        this.name = ''
        this.abbr = ''
        Object.assign(this, values)
    }
}