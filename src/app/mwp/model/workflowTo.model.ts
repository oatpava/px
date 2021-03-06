export class WorkflowTo {
    version: number
    id: number
    createdBy: number
    createdDate: string
    orderNo: number
    removedBy: number
    removedDate: string
    updatedBy: number
    updatedDate: string
    workflow: {
        version: number
        id: number
        createdBy: number
        createdDate: string
        orderNo: number
        removedBy: number
        removedDate: string
        updatedBy: number
        updatedDate: string
        linkId: number
        linkId2: number
        linkId3: number
        workflowActionId: number
        workflowActionIdType: number
        workflowActionName: string
        workflowActionPosition: string
        workflowActionType: string
        workflowActionDate: string
        workflowDescription: string
        workflowNote: string
        workflowTitle: string
        workflowStr01: string
        workflowStr02: string
        workflowStr03: string
        workflowStr04: string
        workflowDate01: string
        workflowDate02: string
    }
    workflowId: number
    userProfileId: number
    structureId: number
    userProfileFullName: string
    userProfilePosition: string

    workflowToReceiveFlag: number
    workflowToOpenFlag: number
    workflowToActionFlag: number
    workflowToFinishFlag: number
    workflowToReceiveDate: string
    workflowToOpenDate: string
    workflowToActionDate: string
    workflowToFinishDate: string

    structure: any
}
