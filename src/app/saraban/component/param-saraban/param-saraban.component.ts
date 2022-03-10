import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { Observable } from 'rxjs/Observable'
import { TreeNode } from 'primeng/primeng'

import { StructureService } from '../../../setting/service/structure.service'
import { ParamSarabanService } from '../../service/param-saraban.service'

@Component({
  selector: 'app-param-saraban',
  templateUrl: './param-saraban.component.html',
  styleUrls: ['./param-saraban.component.styl'],
  providers: [StructureService]
})
export class ParamSarabanComponent implements OnInit {

  constructor(
    private _router: Router,
    private _structureService: StructureService,
    private _paramSarabanService: ParamSarabanService
  ) { }

  ngOnInit() {
    console.log("ParamSarabanComponent")
    this._paramSarabanService.structureTree = []
    this._paramSarabanService.structureTree_filter = []
    this._paramSarabanService.privateGroupTree = [[], []]
    this.getStructuresTree()
    this._paramSarabanService.externalTree = []
    this._paramSarabanService.externalTree_filter = []
    this.getExternalStructuresTree()
    this._router.navigate(['/main'])
  }

  getStructuresTree() {
    Observable.forkJoin(
      this._structureService.getStructures('1.0', '0', '200', 'orderNo', 'asc', 1),
      this._structureService.getUserProfiles('1.1', '0', '200', 'orderNo', 'asc', 1)
    ).subscribe((response: Array<any>) => {
      response[0].forEach(structure => {
        let node = this._paramSarabanService.genParentNode(structure, null)
        this._paramSarabanService.structureTree.push(node)
        this._paramSarabanService.structureTree_filter.push(node)
        let nodePG = this.genParentNode_PG(structure, null)
        this._paramSarabanService.privateGroupTree[1].push(nodePG)
      })
      response[1].forEach(user => {
        let node = this._paramSarabanService.genNode(user, null)
        this._paramSarabanService.structureTree.push(node)
        this._paramSarabanService.structureTree_filter.push(node)
        let nodePG = this.genNode_PG(user, null)
        this._paramSarabanService.privateGroupTree[0].push(nodePG)
      })
      this._paramSarabanService.structureTree.forEach(node => {
        this.getStructuresTreeRecursive(node)
      })
    })
  }

  getStructuresTreeRecursive(node: TreeNode) {
    if (!node.leaf) {
      Observable.forkJoin(
        this._structureService.getStructures('1.0', '0', '200', 'orderNo', 'asc', node.data.id),
        this._structureService.getUserProfiles('1.1', '0', '200', 'orderNo', 'asc', node.data.id)
      ).subscribe((response: Array<any>) => {
        response[0].forEach(structure => {
          let tmp = this._paramSarabanService.genParentNode(structure, node)
          node.children.push(tmp)
          this._paramSarabanService.structureTree_filter.push(tmp)
          let tmpPG = this.genParentNode_PG(structure, node)
          this._paramSarabanService.privateGroupTree[1].push(tmpPG)
        })
        response[1].forEach(user => {
          let tmp = this._paramSarabanService.genNode(user, node)
          node.children.push(tmp)
          this._paramSarabanService.structureTree_filter.push(tmp)
          let tmpPG = this.genNode_PG(user, node)
          this._paramSarabanService.privateGroupTree[0].push(tmpPG)
        })
        node.children.forEach(childNode => {
          this.getStructuresTreeRecursive(childNode)
        })
      })
    }
  }

  genParentNode_PG(structure: any, parentNode: TreeNode): TreeNode {
    let child: TreeNode[] = []
    let parentKey = this._paramSarabanService.convertParentKey(structure.parentKey)
    return {
      label: structure.name + (!structure.shortName || structure.shortName.length == 0) ? '' : ' (' + structure.shortName + ')',
      icon: "fa-tag",
      leaf: true,
      data: { id: structure.id, userType: 1, isUser: false, parentKey: parentKey },
      parent: parentNode,
      children: child
    }
  }
  
  genNode_PG(user: any, parentNode: TreeNode): TreeNode {
    let child: TreeNode[] = []
    let parentKey = this._paramSarabanService.convertParentKey(user.structure.parentKey)
    return {
      label: user.fullName,
      icon: "fa-user",
      leaf: true,
      data: { id: user.id, userType: 0, isUser: true, parentKey: parentKey },
      parent: parentNode,
      children: child
    }
  }

  getExternalStructuresTree() {
    this._structureService.getOutStructures('1.0', '0', '200', 'orderNo', 'asc', 1)
      .subscribe(response => {
        response.forEach(structure => {
          let node = this.genExternalParentNode(structure, null)
          this._paramSarabanService.externalTree.push(node)
          this._paramSarabanService.externalTree_filter.push(node)
        })
        this._paramSarabanService.externalTree.forEach(node => {
          this.getExternalStructuresTreeRecursive(node)
        })
      })
  }

  getExternalStructuresTreeRecursive(node: TreeNode) {
    if (!node.leaf) {
      this._structureService.getOutStructures('1.0', '0', '200', 'orderNo', 'asc', node.data.id)
        .subscribe(response => {
          response.forEach(structure => {
            let tmp = this.genExternalParentNode(structure, node)
            node.children.push(tmp)
            this._paramSarabanService.externalTree_filter.push(tmp)
          })         
          node.children.forEach(childNode => {
            this.getExternalStructuresTreeRecursive(childNode)
          })
        })
    }
  }

  genExternalParentNode(structure: any, parentNode: TreeNode): TreeNode {
    let child: TreeNode[] = []
    return {
      label: structure.name + (!structure.shortName || structure.shortName.length == 0) ? '' : ' (' + structure.shortName + ')',
      icon: "fa-external-link-square",
      leaf: false,
      data: { id: structure.id, userType: 3, name: structure.name, profile: structure },
      parent: parentNode,
      children: child
    }
  }

}
