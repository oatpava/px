export class InboxFilter {
    userId: number
    structureId: number
    inboxFrom: string
    inboxTitle: string
    inboxStartDate: any
    inboxEndDate: any
    inboxNote: string
    inboxDescription: string
    inboxStr04: string
    inboxStr03: string

    constructor(values: Object = {}) {
        this.userId = 0
        this.structureId = 0
        this.inboxFrom = ''
        this.inboxTitle = ''
        this.inboxStartDate = null
        this.inboxEndDate = null
        this.inboxNote = ''
        this.inboxDescription = ''
        this.inboxStr04 = ''
        this.inboxStr03 = ''
        Object.assign(this, values)
    }
}