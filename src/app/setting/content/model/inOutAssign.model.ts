export class InOutAssign {
    version: number
    assignName: string
    id: number
    createdBy: number
    createdDate: string
    orderNo: number
    removedBy: number
    removedDate: string
    updatedBy: number
    updatedDate: string
    inOutAssignOwnerId: number
    inOutAssignAssignId: number
    inOutAssignOwnerType: number
    inOutAssignIsperiod: number
    inOutAssignStartDate: string
    inOutAssignEndDate: string
    children:any
    constructor(values: Object = {}) {
        this.version = 1
        this.id = 0
        this.createdBy = 0
        this.createdDate = ''
        this.orderNo = 0
        this.removedBy = 0
        this.removedDate = ''
        this.updatedBy = 0
        this.updatedDate = ''
        this.inOutAssignOwnerId = 0
        this.inOutAssignAssignId = 0
        this.inOutAssignOwnerType = 0
        this.inOutAssignIsperiod = 0
        this.inOutAssignStartDate = ''
        this.inOutAssignEndDate = ''
        this.children = ''
        Object.assign(this, values)

    }

}