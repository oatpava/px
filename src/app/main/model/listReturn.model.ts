export class ListReturn {
    all: number
    count: number
    next: number
    
    constructor(values: Object = {}) {
        this.all = 0
        this.count = 0
        this.next = 0
        Object.assign(this, values)
    }
}