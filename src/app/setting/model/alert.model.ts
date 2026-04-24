export class Alert {
    version: number
    id: number
    startDate: string
    endDate: string
    message: string
    active: boolean

    constructor(values: Object = {}) {
        this.version = 1
        this.id = 0
        this.startDate = ''
        this.endDate = ''
        this.message = ''
        this.active = true

        Object.assign(this, values)
    }
}