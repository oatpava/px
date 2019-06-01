import { WorkflowNode } from "./workflowNode.model"
import { WorkflowLink } from "./workflowlink.model"

export class WorkflowImage {
    topic: string
    WorkflowModel_groupNodeFlow: WorkflowNode[]
    WorkflowModel_groupLinkFlow: WorkflowLink[]
}