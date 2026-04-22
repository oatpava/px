export class Alert {
    id: number
    startDate: string
    endDate: string
    message: string
    active: boolean

    constructor(values: Object = {}) {
        this.id = 0
        this.startDate = ''
        this.endDate = ''
        this.message = ''
        this.active = true

        Object.assign(this, values)
    }
}