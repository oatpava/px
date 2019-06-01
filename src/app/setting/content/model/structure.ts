export class Structure {
    children: Array<any>;
    expanded: boolean;
    checked: boolean;
    version: number
    id: number
    name: string
    detail: string
    code: string
    nodeLevel: number
    parentId: number
    parentKey: string
    type : number
    constructor(values: Object = {}) {
        this.expanded = false;
        this.checked = false;
        this.children = null
        this.version = 0
        this.id = 0
        this.name = ""
        this.detail = ""
        this.code = ""
        this.nodeLevel = 0
        this.parentId = 0
        this.parentKey = ""
        this.type = 1
        Object.assign(this, values)
    }
    toggle() {
        this.expanded = !this.expanded;
    }
    check() {
        let newState = !this.checked;
        this.checked = newState;
        this.checkRecursive(newState);
    }
    checkRecursive(state) {
        this.children.forEach(d => {
            d.checked = state;
            d.checkRecursive(state);
        })
    }
}