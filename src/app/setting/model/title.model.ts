export class Title {
    version: number
    id: number
    name: string
    nameEng: string
    type: string
    constructor(values: Object = {}) {
        this.version = 1
        this.id = 0
        this.name = null
        this.nameEng = null
        this.type = null
        Object.assign(this, values)
    }
}