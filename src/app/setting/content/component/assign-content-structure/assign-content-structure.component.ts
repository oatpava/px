import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Structure } from '../../model/structure'
import { Location } from '@angular/common'
@Component({
    selector: 'app-assign-content-structure',
    templateUrl: './assign-content-structure.component.html',
    styleUrls: [
        './assign-content-structure.component.styl',
    ],
})
export class AssignContentStructureComponent implements OnInit {
    expanded: boolean;
    checked: boolean;
    userList: Structure[]
    directories: Structure[]
    iconHeader: string = 'assignment_ind'
    title: string = 'กำหนดแฟ้มทะเบียนให้เจ้าหน้าที่'
    nodes = [
        {
            "id": 1,
            "name": "โครงสร้างหน่วยงาน",
            "detail": null,
            "code": null,
            "nodeLevel": 0,
            "parentId": 0,
            "parentKey": "฿1฿", "children": null, "checked": false, "expanded": false,
            "type": 1
        },
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
            "type": 2
        }
    ]

    constructor(private _location: Location,
        private _router: Router,
        private _route: ActivatedRoute, ) {
        this.checked = false;
        this.expanded = false;
        this.userList = []
        this.nodes.sort(this.mycomparator);
    }

    ngOnInit() {
        // this.directories = this.createNodes();
        // console.log(this.directories);
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

    selectNode(dir: any) {
        if (dir) {
            let objType: number = 2
            let name = dir.name
            if (dir.position) {
                objType = 3
                name = dir.fullName
            }
            let param = {
                structureName: name,
                type: objType,
                id: dir.id
            }
            this._router.navigate(
                ['/main', {
                    outlets: {
                        center: ['setting-assign-content', param],
                    }
                }],
                { relativeTo: this._route });
        }
    }
}