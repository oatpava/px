export class RecycleBinFilter {
    version: number
    moduleName: string
    description: string
    startDate: any
    endDate: any

    constructor(values: Object = {}) {
        this.version = 1
        this.moduleName = null
        this.description = ''
        this.startDate = null
        this.endDate = null
        Object.assign(this, values)
    }
}
