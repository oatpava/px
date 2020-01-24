import { WfContentType } from './wfContentType.model'
import { WfContentType2 } from './wfContentType2.model'

export class SarabanFolder {
    version: number
    id: number
    wfFolderParentType: number
    parentKey: string
    nodeLevel: number
    wfContentType: WfContentType
    wfContentType2: WfContentType2
    createdBy: number
    createdDate: any
    orderNo: number
    removedBy: number
    removedDate: any
    updatedBy: number
    updatedDate: any
    wfFolderExpireDate: any
    wfFolderOwnerName: string
    convertId: number
    wfFolderName: string
    wfFolderType: string
    parentId: number
    wfFolderParentName: string
    wfFolderDetail: string
    wfFolderAutorun: number
    wfFolderBookNoType: number
    wfFolderPreBookNo: string
    wfFolderPreContentNo: string
    wfFolderOwnerId: number
    wfFolderLinkFolderId: number
    wfFolderLinkId: number
    wfFolderByBudgetYear: number
    wfFolderTypeYearExpire: string
    wfFolderNumYearExpire: number
    //NIE
    auth: boolean[]
    searchField: boolean[]

    constructor(values: Object = {}) {
        this.version = 1
        this.id = 0
        this.wfFolderParentType = 0
        this.parentKey = ''
        this.nodeLevel = 0
        this.wfContentType = new WfContentType()
        this.wfContentType2 = new WfContentType2()
        this.createdBy = 0
        this.createdDate = null
        this.orderNo = 0
        this.removedBy = 0
        this.removedDate = null
        this.updatedBy = 0
        this.updatedDate = null
        this.wfFolderExpireDate = null
        this.wfFolderOwnerName = null
        this.convertId = 0
        this.wfFolderName = ''
        this.wfFolderType = ''
        this.parentId = 0
        this.wfFolderParentName = null
        this.wfFolderDetail = ''
        this.wfFolderAutorun = 0
        this.wfFolderBookNoType = 0
        this.wfFolderPreBookNo = null
        this.wfFolderPreContentNo = null
        this.wfFolderOwnerId = 0
        this.wfFolderLinkFolderId = 0
        this.wfFolderLinkId = 0
        this.wfFolderByBudgetYear = 0
        this.wfFolderTypeYearExpire = null
        this.wfFolderNumYearExpire = 0
        
        //this.auth = [true, true, true, true, true]
        this.searchField = [true, true, true, true, true, true, true, true, true, true, true, true, true, true]
        Object.assign(this, values)
    }
}