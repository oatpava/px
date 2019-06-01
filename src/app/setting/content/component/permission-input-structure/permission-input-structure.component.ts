import { PermissionInputService } from '../../service/permission-input.service';
import {Router, ActivatedRoute,  Params} from '@angular/router';
import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { Structure } from '../../model/structure'
import { InOutAssign } from '../../model/inOutAssign.model'
import { Location } from '@angular/common'
import { TreeModule, TreeNode, Message } from 'primeng/primeng';
@Component({
    selector: 'app-permission-input-structure',
    templateUrl: './permission-input-structure.component.html',
    styleUrls: [
        './permission-input-structure.component.styl',
    ],
    providers: [PermissionInputService]
})
export class PermissionInputStructureComponent implements OnInit {
    @Input("selectDepartment") selectDepartment: boolean
    @Output("onselectData") onselectData = new EventEmitter();
    @Input("alertMsgTo") aletMsgTo: boolean
    @Output('msgTo') msgTo = new EventEmitter();
    rootStructureId = 0
    // dataList = []
    selectedUser: TreeNode;
    msgs: Message[] = [];
    firstList: any

    expanded: boolean;
    checked: boolean;
    userList: Structure[]
    dataList: Structure[]
    iconHeader: string = 'lock_outline'
    title: string = 'กำหนดสิทธิ์ข้อมูลเข้า'
    nodes = [
        {
            "id": 1,
            "name": "โครงสร้างหน่วยงาน",
            "detail": null,
            "code": null,
            "nodeLevel": 0,
            "parentId": 0,
            "parentKey": "฿1฿", "checked": false, "expanded": false,
            "type": 1,
            "children": [
                {
                    "id": 2,
                    "name": "สำนักงานบริหารหนี้สาธารณะ",
                    "detail": "สำนักงานบริหารหนี้สาธารณะ",
                    "code": "",
                    "nodeLevel": 1,
                    "parentId": 1,
                    "parentKey": "฿1฿2฿", "children": null, "checked": false, "expanded": false,
                    "type": 1
                },
                {
                    "id": 3,
                    "name": "หน่วยงานภายนอก",
                    "detail": "หน่วยงานภายนอก",
                    "code": "",
                    "nodeLevel": 1,
                    "parentId": 1,
                    "parentKey": "฿1฿3฿", "children": null, "checked": false, "expanded": false,
                    "type": 1
                },
                {
                    "id": 4,
                    "name": "ผอ.ทุกสำนัก",
                    "detail": "ผอ.ทุกสำนัก",
                    "code": "",
                    "nodeLevel": 1,
                    "parentId": 1,
                    "parentKey": "฿1฿4฿", "children": null, "checked": false, "expanded": false,
                    "type": 1
                },
                {
                    "id": 5,
                    "name": "ผู้ดูแลระบบ สมาร์ทออฟฟิต",
                    "detail": "ผู้ดูแลระบบ สมาร์ทออฟฟิต",
                    "code": "",
                    "nodeLevel": 1,
                    "parentId": 1,
                    "parentKey": "฿1฿4฿", "children": null, "checked": false, "expanded": false,
                    "type": 0
                }]
        }
    ]
    // structureName : string

    constructor(
        private _location: Location,
        private _router: Router,
        private _route: ActivatedRoute,
        private _permissionInputService: PermissionInputService, ) {
        this.checked = false;
        this.expanded = false;
        this.userList = []

    }

    ngOnInit() {
        // this.dataList = this.createNodes();
    }

    delete(id: number) {
        this.userList.splice(id, 1);
    }

    goBack() {
        this._location.back()
    }

    createNodes() {
        let map = {}, node, roots = [];
        for (let i = 0; i < this.nodes.length; i += 1) {
            node = this.nodes[i] as Structure;
            node.children = [];
            map[node.id] = i; // use map to look-up the parents
            if (node.parentId !== 0) {
                this.nodes[map[node.parentId]].children.push(node);
            } else {
                roots.push(node);
            }
        }
        return roots;
    }
    mycomparator(a, b) {
        return parseInt(a.parentId, 10) - parseInt(b.parentId, 10);
    }

    addActorInRole(event) {
        console.log(event);
    }
    loadNode(event) {
        console.log(event);
    }


    selectNode(dir: any) {
        if (dir) {
            let ownerType: number = 1
            let name = dir.name
            if (dir.position) {
                ownerType = 0
                name = dir.fullName
            }
            let param = {
                name: name,
                ownerType: ownerType,
                ownerId: dir.id,
            }
            this._router.navigate(
                ['/main', {
                    outlets: {
                        center: ['setting-permission-input', param],
                    }
                }],
                { relativeTo: this._route });
        }
    }
}