import { TdLoadingService } from '@covalent/core';
import { Params, Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common'
import { DocumentTypeService } from '../../service/document-type.service'
import { WfDocumentType } from '../../model/wfDocumentType.model';

@Component({
  selector: 'app-edit-document-type',
  templateUrl: './edit-document-type.component.html',
  styleUrls: ['./edit-document-type.component.styl'],
  providers: [DocumentTypeService]
})
export class EditDocumentTypeComponent implements OnInit {
  documentType: WfDocumentType = new WfDocumentType
  listDocumentType: WfDocumentType[]
  mode: string = 'Add'
  title: string = 'เพิ่มประเภทเอกสาร'
  docTypeCode: string = 'รหัสประเภทเอกสาร'
  docTypeName: string = 'ชื่อประเภทเอกสาร'
  docTypeDetail: string = 'รายละเอียดประเภทเอกสาร'
  documentTypeId: number
  nodeLevel: number = 0
  codeLengthValid: boolean = true
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _loadingService: TdLoadingService,
    private _location: Location,
    private _documentTypeService: DocumentTypeService,
  ) {

  }

  ngOnInit() {
    this.getAllDocumentType()
    this._route.params
      .subscribe((params: Params) => {
        if (!isNaN(params['documentTypeId']))
          this.documentTypeId = params['documentTypeId']
        if (this.documentTypeId > 0) {
          this.mode = 'Edit'
          this.title = 'แก้ไขประเภทเอกสาร'
        }
      })
  }

  goBack() {
    this._location.back()
  }

  getDocumentTypeById(wfDocumentTypeId: number): void {
    this._loadingService.register('main')
    this._documentTypeService
      .getDocumentTypeById(wfDocumentTypeId)
      .subscribe(response => {
        this.documentType = response as WfDocumentType
        this.nodeLevel = this.documentType.nodeLevel
      })
    this._loadingService.resolve('main')
  }

  createDocumentType(wfDocumentType: WfDocumentType) {
    wfDocumentType.nodeLevel = this.nodeLevel
    wfDocumentType.parentKey = '฿' + wfDocumentType.parentId + '฿'
    this._documentTypeService.createDocumentType(wfDocumentType).subscribe(response => {
      this.goBack()
    })
  }

  updateDocumentType(wfDocumentType: WfDocumentType) {
    wfDocumentType.nodeLevel = this.nodeLevel
    this._documentTypeService.updateDocumentType(wfDocumentType).subscribe(response => {
      this.goBack()
    })
  }

  getAllDocumentType(): void {
    this._documentTypeService
      .getAllDocumentTypes()
      .subscribe(response => {
        this.listDocumentType = response as WfDocumentType[]
        if (this.documentTypeId) {
          let objRemove = this.listDocumentType.find(x => x.id == this.documentTypeId)
          let removeIndex = this.listDocumentType.indexOf(objRemove)
          this.listDocumentType.splice(removeIndex, 1)
          this.getDocumentTypeById(this.documentTypeId)
        }
      })
  }

  change(event) {
    if (event == 0) {
      this.nodeLevel = 0
      if ((this.documentType.code.length > ((this.nodeLevel+1) * 3) - 1))
        this.documentType.code = this.documentType.code.slice(0, (this.nodeLevel+1) * 3)
      if (this.documentType.code.length === (this.nodeLevel+1) * 3)
        this.codeLengthValid = true
      else
        this.codeLengthValid = false
    } else {
      let objSelect = this.listDocumentType.find(x => x.id == event)
        this.nodeLevel = objSelect.nodeLevel+1
      if ((this.documentType.code.length > ((this.nodeLevel+1) * 3) - 1))
        this.documentType.code = this.documentType.code.slice(0, (this.nodeLevel+1) * 3)
      if (this.documentType.code.length === (this.nodeLevel+1) * 3)
        this.codeLengthValid = true
      else
        this.codeLengthValid = false
    }
  }

  checkDocumentTypeCodeLength(event) {
    if (event.length === (this.nodeLevel+1) * 3)
      this.codeLengthValid = true
    else
      this.codeLengthValid = false
  }
}
