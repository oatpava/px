export class Position {
    version: number
    id: number
    name: string
    nameEng?: string
    nameExtra?: string

    constructor(values: Object = {}) {
        this.version = 1
        this.id = 0
        this.name = ''
        Object.assign(this, values)
    }
}