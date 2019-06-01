export class OutboxFilter {
    version: number
    outboxTo: string
    outboxFrom: string
    outboxTitle: string
    outboxStartDate: any
    outboxEndDate: any
    outboxNote: string
    outboxDescription: string
    outboxStr04: string

    constructor(values: Object = {}) {
        this.version = 1
        this.outboxTo = ''
        this.outboxFrom = ''
        this.outboxTitle = ''
        this.outboxStartDate = null
        this.outboxEndDate = null
        this.outboxNote = ''
        this.outboxDescription = ''
        this.outboxStr04 = ''
        Object.assign(this, values)
    }
}