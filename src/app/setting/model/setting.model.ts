export class Setting {
      // version: number
      id: number
      moduleId: number
      name: string
      type: string
      subSetting: string
      iconModule: string
      child: any[]
      constructor(values: Object = {}) {
            // this.version = 1
            this.id = 1
            this.moduleId = 0
            this.name = ''
            this.type = ''
            this.subSetting = ''
            this.iconModule = ''
            this.child = []
            Object.assign(this, values)
      }
}