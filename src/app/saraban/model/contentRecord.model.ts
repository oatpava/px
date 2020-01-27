export class ContentRecord {
    id: number
    createdDate: string
    contentId: number
    documentId: number
    description: string
    creator: string

    constructor(values: Object = {}) {
        this.id = 0,
        this.createdDate = '',
        this.contentId = 0,
        this.documentId = 0,
        this.description = ''
        this.creator = ''
        
        Object.assign(this, values)
    }
}