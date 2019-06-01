import { SarabanFolder } from '../../../../saraban/model/sarabanFolder.model';
import { TdLoadingService } from '@covalent/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Input, Component, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { Location } from '@angular/common'
import { AssignContentService } from '../../service/assign-content.service'
import { Observable } from 'rxjs/Observable'
import { TreeModule, TreeNode, Message } from 'primeng/primeng';
@Component({
    selector: 'app-assign-content',
    templateUrl: './assign-content.component.html',
    styleUrls: [
        './assign-content.component.styl',
    ],
    providers: [AssignContentService]
})
export class AssignContentComponent implements OnInit {
    @Input("selectDepartment") selectDepartment: boolean
    @Output("onselectData") onselectData = new EventEmitter();
    @Input("alertMsgTo") aletMsgTo: boolean
    @Output('msgTo') msgTo = new EventEmitter();
    rootStructureId = 0
    structureTree = []
    selectedStructure: TreeNode;
    msgs: Message[] = [];
    firstList: any

    userList: SarabanFolder[]
    iconHeader: string = 'assignment_ind'
    title: string = 'กำหนดแฟ้มทะเบียนให้เจ้าหน้าที่'
    type: number
    pathGet: string
    pathSave: string
    pathDelete: string
    objId: number
    constructor(private _location: Location,
        private _route: ActivatedRoute,
        private _loadingService: TdLoadingService,
        private _assignContentService: AssignContentService, ) {
    }

    ngOnInit() {
        this.userList = []
        this._route.params
            .subscribe((params: Params) => {
                if (params['structureName'] !== undefined)
                    this.title = this.title + ' [' + params['structureName'] + ']'
                if (params['type'] !== undefined)
                    this.type = params['type']
                if (params['id'] !== undefined)
                    this.objId = params['id']
                this.pathGet = this.type == 2 ? 'listShortcutByStructureId' : 'listShortcutByUserProfileId'
                this.getShortcutByUser(this.objId, this.pathGet)
                this.getFolders(0)
            })
    }

    delete(shortcut: SarabanFolder) {
        this.pathDelete = this.type == 2 ? 'deleteShortcutStructureIdAndFolderId' : 'delete'
        this.deleteShortcut(this.type == 2 ? this.objId : null, shortcut, this.pathDelete)
    }

    goBack() {
        this._location.back()
    }

    getFolders(parentId: number): void {
        this._loadingService.register('main')
        this._assignContentService
            .getFolders(parentId)
            .subscribe(response => {
                // this.structureTree = response as SarabanFolder[]
                let i = 0
                for (let node of response) {
                    this.structureTree.push({
                        "label": node.wfFolderName,
                        "data": node.id,
                        "expandedIcon": "fa-home",
                        "collapsedIcon": "fa-home",
                        "leaf": false,
                        "expanded": true,
                        "children": []
                    })
                }
            })
        this._loadingService.resolve('main')
    }

    getShortcutByUser(objId: number, pathGet: string): void {
        this._loadingService.register('main')
        this._assignContentService
            .getShortcutByUserId(objId, pathGet)
            .subscribe(response => {
                this.userList = response as SarabanFolder[]
            })
        this._loadingService.resolve('main')
    }

    deleteShortcut(structureId : number, shortcut: SarabanFolder, pathDelete : string) {
        this._assignContentService.deleteShortcut(structureId, shortcut.id, pathDelete).subscribe(response => {
            if (response == true) {
                this.userList.splice(this.userList.indexOf(shortcut), 1)
            } else {
                return;
            }
        })
    }

}