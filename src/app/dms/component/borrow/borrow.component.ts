
import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { IMyOptions, IMyDateModel } from 'mydatepicker'
import { Router, ActivatedRoute, Params } from '@angular/router'
import { Location } from '@angular/common'
import { Message, TreeNode} from 'primeng/primeng';
import { Observable } from 'rxjs/Observable'

import { BorrowService } from '../../service/borrow.service'
import { Borrow } from '../../model/borrow.model'
import { StructureService } from '../../../setting/service/structure.service'
import { UserProfileService } from '../../../setting/service/user-profile.service'
import { UserProfile } from '../../../setting/model/user-profile.model'

@Component({
  selector: 'app-borrow',
  templateUrl: './borrow.component.html',
  styleUrls: ['./borrow.component.styl'],
  providers: [BorrowService, StructureService, UserProfileService]
})
export class BorrowComponent implements OnInit {
  @Input("selectDepartment") selectDepartment: boolean
  @Output("onselectData") onselectData = new EventEmitter();
  @Input("alertMsgTo") aletMsgTo: boolean
  @Output('msgTo') msgTo = new EventEmitter();

dmsfolderName: string = 'ยืม-คืน เอกสาร'
documentId: number
documentName: string
documentStatus: string
borrowId: number
borrowed: boolean
borrower: string
date: any
date_str: string

borrowDate: any
borrowDate_str: string
numDate: number
toReturnDate: any
//toReturnDate_str: string
returnDate: any
returnDate_str: string
borrowerType: string

////sendTo: TreeNode
////filtered: TreeNode[] = []
////tree: TreeNode[] = []
////tree_filter: TreeNode[] = []
////selectedNode: TreeNode
////nodeExpand: boolean = false
dialogTo: boolean = false
handlerTitel:string='ผู้ทำรายการ'
borrowUser: string
rootStructureId = 0
structureTree = []
//structureTree_filter = []
selectedStructure: TreeNode;
msgs: Message[] = [];
handler:string = 'ผู้ดูแลระบบ'
private myDatePickerOptions: IMyOptions[] = [
  {
    dateFormat: 'dd/mm/yyyy'+' :วันที่ยืม',
    editableDateField: false,
    height: '30px',
    width: '100%',
    inline: false,
    selectionTxtFontSize: '14px',
    openSelectorOnInputClick: false,
    showSelectorArrow: false,
    componentDisabled: true
  },
  {
    dateFormat: 'dd/mm/yyyy'+' :วันที่ถึงกำหนดคืน',
    editableDateField: false,
    height: '30px',
    width: '100%',
    inline: false,
    selectionTxtFontSize: '14px',
    openSelectorOnInputClick: false,
    showSelectorArrow: false,
    componentDisabled: true
  },
  {
    dateFormat: 'dd/mm/yyyy'+' :วันที่คืน',
    editableDateField: false,
    height: '30px',
    width: '100%',
    inline: false,
    selectionTxtFontSize: '14px',
    openSelectorOnInputClick: false,
    showSelectorArrow: false,
    componentDisabled: true
  }]
  
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _location: Location,
    private _borrowService: BorrowService,
    private _structureService: StructureService,
    private _userProfileService: UserProfileService
  ) { 
    let date = new Date()
    let year = date.getFullYear()+543
    let month = date.getMonth()+1
    let day = date.getDate()
    this.date = { date: { year: year,
                          month: month,
                          day: day } }
    this.date_str = ("0"+day).slice(-2)+"/"+("0"+month).slice(-2)+"/"+year
    console.log("date : "+ this.date_str)
  }

  ngOnInit() {
    console.log("++++++++++++docborrow")
    this._route.params
      .subscribe((params: Params) => {
        if (!isNaN(params['documentId'])) {
          this.documentId = params['documentId']
          this.documentName = params['documentName']
        }
      })
      console.log("documentId="+this.documentId)
    //this.beginTree()
    this.loadStructureTree()
    this.checkDocumentStatus(this.documentId)
    this.getuser()
  }

  
  nodeSelect(event) {
    if(event.node.selectable) {
      this.borrowUser = event.node.label
    }
    else {
      this.selectedStructure = null
      this.borrowUser = null
      this.msgs = [];
            this.msgs.push(
              {
                severity: 'warn',
                summary: 'เพิ่มได้เฉพาะผู้ใช้งานเท่านั้น',
                detail: event.node.label,
              })
    }

  }
  nodeUnSelect(event) {
    this.borrowUser = null
  }
  borrowUserChanged() {
    this.selectedStructure = null
  }

 

  showReceiverDialog() {
    this.dialogTo = !this.dialogTo
  }

  

  checkDocumentStatus(documentId: number) {
    this._borrowService
    .getDocumentBorrowRecord(documentId)
    .subscribe(response => { 
    console.log('checkDocumentStatus - ',response)
    let last_index = response.length -1
      if(response[last_index]==null || response[last_index].statusId==0) {
        console.log("ว่าง")
        this.documentStatus = "ว่าง"
        this.borrowed = false
        this.borrowerType = "ผู้ยืม"
        this.borrowDate = this.date
        this.borrowDate_str = this.date_str
        this.numDate = 7//default 7 days
        this.numDateChange()
      } else {
        console.log("ถูกกยืม")
        this.documentStatus = "ถูกยืม"
        this.borrowed =true
        this.borrowerType = "ผู้คืน"
        this.borrowId = response[last_index].id
        this.borrower = response[last_index].lendName
        this.returnDate = this.date
        this.returnDate_str = this.date_str
        this.borrowDate_str = response[last_index].lendDate.substr(0,10)
        this.borrowDate = { date: { year: parseInt(response[last_index].lendDate.substr(6,4)), 
                                    month: parseInt(response[last_index].lendDate.substr(3,2)), 
                                    day: parseInt(response[last_index].lendDate.substr(0,2))} }
        this.numDate = response[last_index].retuenDateNum
        this.numDateChange()
        console.log("borrowId = "+this.borrowId)
    } 
    })
  }

  onReturnDateChanged(event) {
    this.returnDate_str = ("0"+event.date.day).slice(-2)+"/"+("0"+event.date.month).slice(-2)+"/"+(event.date.year)
  }
  onBorrowDateChanged(event) {
    console.log(event)
    this.borrowDate_str = ("0"+event.date.day).slice(-2)+"/"+("0"+event.date.month).slice(-2)+"/"+(event.date.year)
    this.numDateChange()
  }
  numDateChange() {
    let date = new Date()
    date.setDate(this.borrowDate.date.day)
    date.setMonth(this.borrowDate.date.month)
    date.setFullYear(this.borrowDate.date.year)
    date.setDate(date.getDate()+this.numDate)
    let year = date.getFullYear()
    let month = date.getMonth()+1
    let day = date.getDate()
    this.toReturnDate = { date: { year: year,
                          month: month,
                          day: day } }
    //this.toReturnDate_str = ("0"+day).slice(-2)+"/"+("0"+month).slice(-2)+"/"+year
    
  }

  goBack() {
    this._location.back()
  }
  cancel() {
    this._location.back()
  }
  getuser(){
    this._userProfileService
    .getUserProfile(-1, '1.0')
    .subscribe(response => {
      console.log('_userProfileService response = ',response)
      console.log(response.fullName)
      this.handler = response.fullName
    })
  }

  borrow() {
    let borrowRecord = new Borrow()
    this._userProfileService
      .getUserProfile(-1, '1.0')
      .subscribe(response => {
        borrowRecord.userHandlerId = response.id
        borrowRecord.lendDate = this.borrowDate_str
        borrowRecord.dmsDocument = {
          id: this.documentId,
          documentName: this.documentName
        }
        if(this.selectedStructure!=null) {
          borrowRecord.userLentId = this.selectedStructure.data
          borrowRecord.lendName = this.selectedStructure.label
        } else {
          borrowRecord.userLentId = 0
          borrowRecord.lendName = this.borrowUser
        }
        borrowRecord.retuenDateNum = this.numDate

        this._borrowService
        .borrowDocument(borrowRecord)
        .subscribe(res => this.goBack())
      })
  }
  return() {
    let returnRecord = new Borrow()
    if(this.selectedStructure!=null) {
       returnRecord.userReturnId = this.selectedStructure.data
       returnRecord.returnName = this.selectedStructure.label
    } else {
       returnRecord.userReturnId = 0
       returnRecord.returnName = this.borrowUser
    }
      returnRecord.returnDate = this.returnDate_str
    console.log(returnRecord)
    this._borrowService
    .returnDocument(this.borrowId, returnRecord)
    .subscribe(res => this.goBack())
  }

  listBorrow() {
    this._router.navigate(
       ['../listBorrow/', {
        documentId: this.documentId,
        documentName: this.documentName
      }],
      { relativeTo: this._route })
  }
  
  selectStructure(event) {
    console.log(event.id)
    console.log(event.fullName)
  }

  loadStructureTree() {
    this._structureService
      .getStructures('1.0', '0', '1', '', '', this.rootStructureId)
      .subscribe(response => {
        let i = 0
        for (let node of response) {
          this.structureTree.push({
            "label": node.name,
            "data": node.id,
            "expandedIcon": "fa-home",
            "collapsedIcon": "fa-home",
            "leaf": false,
            "selectable": false,
            "expanded": true,
            "dataObj": node,
            "children": []
          })
          Observable.forkJoin(
            this._structureService.getStructures('1.0', '0', '200', '', '', node.id),
            this._structureService.getUserProfiles('1.1', '0', '200', '', '', node.id),
          ).subscribe((response: Array<any>) => {
            let structures = []
            for (let structure of response[0]) {
              this.structureTree[i].children.push({
                "label": structure.name,
                "data": structure.id,
                "expandedIcon": "fa-tag",
                "collapsedIcon": "fa-tag",
                "leaf": false,
                "selectable": false,
                "dataObj": structure
              })
            }
            let userProfiles = []
            for (let userProfile of response[1]) {
              this.structureTree[i].children.push({
                "label": userProfile.fullName,
                "data": userProfile.id,
                "expandedIcon": "fa-user",
                "collapsedIcon": "fa-user",
                "leaf": true,
                "selectable": true,
                "dataObj": userProfile
              })
            }
            i++;
          });

        }

      });
      console.log(this.structureTree)
  }

  loadNode(event) {
    console.log("loadnode")
    if (event.node) {
      Observable.forkJoin(
        this._structureService.getStructures('1.0', '0', '200', '', '', event.node.data),
        this._structureService.getUserProfiles('1.1', '0', '200', '', '', event.node.data),
      ).subscribe((response: Array<any>) => {
        let structures = []
        for (let structure of response[0]) {
          structures.push({
            "label": structure.name,
            "data": structure.id,
            "expandedIcon": "fa-tag",
            "collapsedIcon": "fa-tag",
            "leaf": false,
            "selectable": false,
            "dataObj": structure
          })
        }
        let userProfiles = []
        for (let userProfile of response[1]) {
          structures.push({
            "label": userProfile.fullName,
            "data": userProfile.id,
            "expandedIcon": "fa-user",
            "collapsedIcon": "fa-user",
            "leaf": true,
            "selectable": true,
            "dataObj": userProfile
          })
        }
        event.node.children = structures
      });
    }
  }

}
