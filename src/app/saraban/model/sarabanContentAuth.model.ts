export class SarabanContentAuth {
    openContent: boolean
    createContent: boolean
    editContent: boolean
    deleteContent: boolean
    sendContent: boolean
    registerContent: boolean
    finishContent: boolean
    keepContent: boolean
    cancelContent: boolean
    workflow: boolean
    fileattach: boolean
    annotation: boolean
    print: boolean
    download: boolean
    email: boolean

    constructor(values: Object = {}) {
        this.openContent = true
        this.createContent = true
        this.editContent = true
        this.deleteContent = true
        this.sendContent = true
        this.registerContent = true
        this.finishContent = true
        this.keepContent = true
        this.cancelContent = true
        this.workflow = true
        this.fileattach = true
        this.annotation = true
        this.print = true
        this.download = true
        this.email = true
        Object.assign(this, values)
    }
}