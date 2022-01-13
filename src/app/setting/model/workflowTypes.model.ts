export class WorkflowTypes {
    version: number
    id: number
    createdBy: string
    createdDate: string
    orderNo: number
    removedBy: number
    removedDate: string
    updatedBy: number
    updatedDate: string
    workflowTypeTitle: string
    workflowTypeActionType: string
    workflowTypeAction: number

    constructor(values: Object = {}) {
        this.version = 1
        this.id = 0
        this.createdBy = ''
        this.createdDate = ''
        this.orderNo = 0
        this.removedBy = 0
        this.removedDate = ''
        this.updatedBy = 0
        this.updatedDate = ''
        this.workflowTypeTitle = ''
        this.workflowTypeActionType = ''
        this.workflowTypeAction = 1
        Object.assign(this, values)
    }

}