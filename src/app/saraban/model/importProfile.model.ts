export class ImportProfile {
    id: number
    createdBy: number
    createdDate: string
    updatedBy: number
    updatedDate: string
    key: string
    name: string

    creatorFullName: string
    updaterFullName: string

    constructor(values: Object = {}) {
        this.id = 0
        this.createdBy = 0
        this.createdDate = null
        this.updatedBy = 0
        this.updatedDate = null
        this.key = ''
        this.name = ''

        this.creatorFullName = ''
        this.updaterFullName = ''

        Object.assign(this, values)
    }
}