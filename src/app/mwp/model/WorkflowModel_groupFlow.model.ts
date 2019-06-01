import { WorkflowModel_groupLinkFlow } from "./WorkflowModel_groupLinkFlow.model";
import { WorkflowModel_groupNodeFlow } from "./WorkflowModel_groupNodeFlow.model";

export class WorkflowModel_groupFlow {
    topic: string
    workflowModel_groupNodeFlow: Array<WorkflowModel_groupNodeFlow>
    workflowModel_groupLinkFlow: Array<WorkflowModel_groupLinkFlow>
}