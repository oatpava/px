import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router'
import { Location } from '@angular/common'
import { ITdDataTableColumn } from '@covalent/core';
import { DmsField } from '../../../../app/dms/model/dmsField.model'
import { DmsFieldService } from '../../../../app/dms/service/dmsField.service'
import { DocumentType } from '../../../../app/dms/model/documentType.model'
import { DocumentTypeDetail } from '../../../../app/dms/model/documentTypeDetail.model'
import { DocumentTypeService } from '../../../../app/dms/service/documentType.service'
import { DocumentTypeDetailService } from '../../../../app/dms/service/documentTypeDetail.service'

@Component({
  selector: 'app-dms-document-type-detail',
  templateUrl: './dms-document-type-detail.component.html',
  styleUrls: ['./dms-document-type-detail.component.styl'],
  providers: [DocumentTypeService, DocumentTypeDetailService, DmsFieldService]
})
export class DmsDocumentTypeDetailComponent implements OnInit {
  documentTypeId: number
  title: String
  mode: string
  iconHeader: string = 'text_fields'
  documentType: DocumentType
  allData: DocumentTypeDetail[] = []
  dmsFields: DmsField[] = []
  checkBoxAll: Boolean = true
  flagCheck: Boolean[] = []
  flagCheckOld: Boolean[] = []
  listLookUp: any[] = []
  dataDocTypeDetailDel: any[] = []
  oldData: DocumentTypeDetail[] = []
  columns: ITdDataTableColumn[] = [
    { name: 'dmsField', label: 'ฟิลด์' },
    { name: 'dmsType', label: 'ชนิด' },
    { name: 'documentTypeDetailName', label: 'ตั้งชื่อ' },
    { name: 'order', label: 'ลำดับ' },
    { name: 'documentTypeDetailView', label: 'แสดงรายชื่อ' },
    { name: 'documentTypeDetailSearch', label: 'ค้นหา' },
    { name: 'documentTypeDetailEdit', label: 'ใช้คีย์ข้อมูล' },
    { name: 'documentTypeDetailUnique', label: 'ห้ามซ้ำ' },
    { name: 'documentTypeDetailRequire', label: 'ห้ามว่าง' },
    // { name: 'documentTypeDetailLookup', label: 'LookUp' },
  ];

  outLookText01: number = 0 //17
  outLookText02: number = 0 //18
  outLookText03: number = 0 //19
  outLookText04: number = 0 //20
  outLookVarchar01: number = 0 //21
  outLookVarchar02: number = 0 //22
  outLookVarchar03: number = 0 //23
  outLookVarchar04: number = 0 //24
  outLookVarchar05: number = 0 //25
  outLookVarchar06: number = 0 //26
  outLookVarchar07: number = 0 //27
  outLookVarchar08: number = 0 //28
  outLookVarchar09: number = 0 //29
  outLookVarchar10: number = 0 //30

  constructor(
    private _route: ActivatedRoute,
    private _location: Location,
    private _docTypeService: DocumentTypeService,
    private _docTypeDetailService: DocumentTypeDetailService,
    private _dmsFieldService: DmsFieldService,
  ) {
    this.mode = 'Add'
    this.title = 'สร้างประเภทเอกสาร'
    this.documentType = new DocumentType
  }

  ngOnInit() {
    this.getDmsFields();
    this._route.params
      .subscribe((params: Params) => {
        this.title = '' + params['title']
        this.mode = '' + params['mode']
        if (!isNaN(params['documentTypeId'])) {
          this.documentTypeId = params['documentTypeId'];
          this.getDocumentTypeById(this.documentTypeId);
        }
      })
    this.getListLookUp()
  }

  getDocumentTypeById(documentTypeId: number) {
    this._docTypeService
      .getDocumentTypeById(documentTypeId)
      .subscribe(response => {
        this.documentType = (response as DocumentType)
      })
  }

  getDocumentTypeDetialByDocumentTypeId(documentTypeId: number): DocumentTypeDetail[] {
    let oldData: DocumentTypeDetail[] = []
    this._docTypeDetailService
      .getDocumentTypeDetail(documentTypeId)
      .subscribe(response => {
        console.log('oldData response - ', response)
        oldData = response as DocumentTypeDetail[]
        this.oldData = oldData

        this.ctrDataForTable(this.oldData, this.dmsFields);
        this.oldData.length === this.allData.length ? this.checkBoxAll = true : this.checkBoxAll = false;
        return oldData
      });
    return oldData
  }

  getDmsFields() {
    this._dmsFieldService
      .getDmsFields()
      .subscribe(response => {
        this.dmsFields = response as DmsField[]
        if (this.documentTypeId != undefined) {
          this.getDocumentTypeDetialByDocumentTypeId(this.documentTypeId);
        } else {
          this.ctrDataForTable(this.oldData, this.dmsFields);
        }
      })
  }

  ctrDataForTable(documentTypeDetails: DocumentTypeDetail[], allDmsFields: DmsField[]) {
    let newDocTypeDetail: DocumentTypeDetail[] = []
    for (let i = 0; i < allDmsFields.length; i++) {
      let docTypeDetail = documentTypeDetails.filter(detail => detail.dmsFieldId == allDmsFields[i].id);
      if (docTypeDetail.length > 0) {
        newDocTypeDetail[i] = docTypeDetail[0];
        this.flagCheck[i] = true
        this.flagCheckOld[i] = true

        switch (docTypeDetail[0].dmsFieldId) {
          case 17: this.outLookText01 = docTypeDetail[0].documentTypeDetailLookup; break;
          case 18: this.outLookText02 = docTypeDetail[0].documentTypeDetailLookup; break;
          case 19: this.outLookText03 = docTypeDetail[0].documentTypeDetailLookup; break;
          case 20: this.outLookText04 = docTypeDetail[0].documentTypeDetailLookup; break;
          case 21: this.outLookVarchar01 = docTypeDetail[0].documentTypeDetailLookup; break;
          case 22: this.outLookVarchar02 = docTypeDetail[0].documentTypeDetailLookup; break;
          case 23: this.outLookVarchar03 = docTypeDetail[0].documentTypeDetailLookup; break;
          case 24: this.outLookVarchar04 = docTypeDetail[0].documentTypeDetailLookup; break;
          case 25: this.outLookVarchar05 = docTypeDetail[0].documentTypeDetailLookup; break;
          case 26: this.outLookVarchar06 = docTypeDetail[0].documentTypeDetailLookup; break;
          case 27: this.outLookVarchar07 = docTypeDetail[0].documentTypeDetailLookup; break;
          case 28: this.outLookVarchar08 = docTypeDetail[0].documentTypeDetailLookup; break;
          case 29: this.outLookVarchar09 = docTypeDetail[0].documentTypeDetailLookup; break;
          case 30: this.outLookVarchar10 = docTypeDetail[0].documentTypeDetailLookup; break;
        }
      } else {
        let newDetail = new DocumentTypeDetail
        newDetail.dmsFieldId = allDmsFields[i].id
        newDetail.documentTypeDetailName = '';
        newDetail.order = '';
        newDetail.documentTypeDetailView = '';
        newDetail.documentTypeDetailSearch = '';
        newDetail.documentTypeDetailEdit = '';
        newDocTypeDetail[i] = newDetail
        this.flagCheck[i] = false;
        this.flagCheckOld[i] = false
      }
    }
    this.allData = newDocTypeDetail;
  }

  save() {
    this._docTypeDetailService
      .createDocumentType(this.documentType)
      .subscribe(response => {
        let docType = response as DocumentType
        for (let i of this.getDataForSave()) {
          switch (i.dmsFieldId) {
            case 17: i.documentTypeDetailLookup = this.outLookText01; break;
            case 18: i.documentTypeDetailLookup = this.outLookText02; break;
            case 19: i.documentTypeDetailLookup = this.outLookText03; break;
            case 20: i.documentTypeDetailLookup = this.outLookText04; break;
            case 21: i.documentTypeDetailLookup = this.outLookVarchar01; break;
            case 22: i.documentTypeDetailLookup = this.outLookVarchar02; break;
            case 23: i.documentTypeDetailLookup = this.outLookVarchar03; break;
            case 24: i.documentTypeDetailLookup = this.outLookVarchar04; break;
            case 25: i.documentTypeDetailLookup = this.outLookVarchar05; break;
            case 26: i.documentTypeDetailLookup = this.outLookVarchar06; break;
            case 27: i.documentTypeDetailLookup = this.outLookVarchar07; break;
            case 28: i.documentTypeDetailLookup = this.outLookVarchar08; break;
            case 29: i.documentTypeDetailLookup = this.outLookVarchar09; break;
            case 30: i.documentTypeDetailLookup = this.outLookVarchar10; break;
          }
          this._docTypeDetailService
            .createDocumentTypeDetail(docType.id, i)
            .subscribe(response => {
            })
        }
      })
    this._location.back()
  }

  update() {
    this._docTypeDetailService
      .updateDocumentType(this.documentType)
      .subscribe(response => {
      })
    for (let i of this.getDataForSave()) {
      switch (i.dmsFieldId) {
        case 17: i.documentTypeDetailLookup = this.outLookText01; break;
        case 18: i.documentTypeDetailLookup = this.outLookText02; break;
        case 19: i.documentTypeDetailLookup = this.outLookText03; break;
        case 20: i.documentTypeDetailLookup = this.outLookText04; break;
        case 21: i.documentTypeDetailLookup = this.outLookVarchar01; break;
        case 22: i.documentTypeDetailLookup = this.outLookVarchar02; break;
        case 23: i.documentTypeDetailLookup = this.outLookVarchar03; break;
        case 24: i.documentTypeDetailLookup = this.outLookVarchar04; break;
        case 25: i.documentTypeDetailLookup = this.outLookVarchar05; break;
        case 26: i.documentTypeDetailLookup = this.outLookVarchar06; break;
        case 27: i.documentTypeDetailLookup = this.outLookVarchar07; break;
        case 28: i.documentTypeDetailLookup = this.outLookVarchar08; break;
        case 29: i.documentTypeDetailLookup = this.outLookVarchar09; break;
        case 30: i.documentTypeDetailLookup = this.outLookVarchar10; break;
      }

      if (i.id != undefined) {
        this._docTypeDetailService
          .updateDocumentTypeDetail(i)
          .subscribe(response => {
          })
      } else {
        this._docTypeDetailService
          .createDocumentTypeDetail(this.documentType.id, i)
          .subscribe(response => {
          })
      }
    }
    for (let i = 0; i < this.flagCheck.length; i++) {
      if (this.flagCheck[i] != this.flagCheckOld[i]) {
        if (this.flagCheckOld[i] == true) {
          this._docTypeDetailService
            .deleteDocumentTypeDetail(this.allData[i].id)
            .subscribe(response => {
            })
        }
      }
    }
    this._location.back()
  }


  delete() {
    this._docTypeDetailService
      .deleteDocumentType(this.documentType)
      .subscribe(response => {
        this._location.back()
      })
  }

  cancel() {
    this._location.back()
  }

  onKey(index: number, event: any) {
    this.allData[index].documentTypeDetailName = event.target.value
  }

  onKey2(index: number, event: any) {
    this.allData[index].order = event.target.value
  }

  clickSave(index: number, checkbox: any) {
    this.checkBoxAll = checkbox.checked

    if (checkbox.checked) {
      if (this.allData[index].documentTypeDetailName === '') {
        let dms = this.dmsFields.filter(field => field.id == this.allData[index].dmsFieldId);
        dms.length > 0 ? this.allData[index].documentTypeDetailName = dms[0].fieldName : "";
      }
      if (this.allData[index].documentTypeDetailView === '') {
        this.allData[index].documentTypeDetailView = 'Y'
      }
      if (this.allData[index].documentTypeDetailSearch === '') {
        this.allData[index].documentTypeDetailSearch = 'Y'
      }
      if (this.allData[index].documentTypeDetailEdit === '') {
        this.allData[index].documentTypeDetailEdit = 'Y'
      }
    }
    this.flagCheck[index] = checkbox.checked
  }

  checkAll(event: any) {
    this.checkBoxAll = event.checked
    for (let i = 0; i < this.flagCheck.length; i++) {
      this.flagCheck[i] = event.checked
    }
    if (event.checked) {
      for (let i = 0; i < this.allData.length; i++) {
        if (this.allData[i].documentTypeDetailName == '') {
          let dms = this.dmsFields.filter(field => field.id == this.allData[i].dmsFieldId);
          this.allData[i].documentTypeDetailName = dms[0].fieldName
          this.allData[i].documentTypeDetailView = 'Y'
          this.allData[i].documentTypeDetailSearch = 'Y'
          this.allData[i].documentTypeDetailEdit = 'Y'
        }
      }
    }
  }

  getDataForSave(): DocumentTypeDetail[] {
    let dataSave: DocumentTypeDetail[] = []
    for (let i = 0; i < this.flagCheck.length; i++) {
      if (this.flagCheck[i]) {
        dataSave[dataSave.length] = this.allData[i]
      }
    }
    return dataSave
  }

  getListLookUp() {
    this._docTypeDetailService
      .getListLookUp()
      .subscribe(response => {
        this.listLookUp = response
      })
  }

}
