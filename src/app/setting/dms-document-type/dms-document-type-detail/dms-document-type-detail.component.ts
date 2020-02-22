import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router'
import { TdLoadingService } from '@covalent/core'
import 'rxjs/add/operator/switchMap'
import { Location } from '@angular/common'

import { TdDataTableService, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, ITdDataTableColumn, ITdDataTableSelectEvent } from '@covalent/core';
import { IPageChangeEvent } from '@covalent/core';

import { DmsField } from '../../../../app/dms/model/dmsField.model'
import { DmsFieldService } from '../../../../app/dms/service/dmsField.service'
import { DocumentType } from '../../../../app/dms/model/documentType.model'
import { DOCUMENTTYPES } from '../../../../app/dms/model/documentType.mock'
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
  test: number = 1
  testData: DocumentTypeDetail = null

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
    private _router: Router,
    private _location: Location,
    private _loadingService: TdLoadingService,
    private _dataTableService: TdDataTableService,
    private _docTypeService: DocumentTypeService,
    private _docTypeDetailService: DocumentTypeDetailService,
    private _dmsFieldService: DmsFieldService,
  ) {
    this.mode = 'Add'
    this.title = 'สร้างประเภทเอกสาร'
    this.documentType = new DocumentType
  }

  ngOnInit() {

    console.log('init edit document type.')
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

      });
  }

  getDocumentTypeDetialByDocumentTypeId(documentTypeId: number): DocumentTypeDetail[] {
    let oldData: DocumentTypeDetail[] = []
    // console.log('getDocumentTypeDetialByDocumentTypeId :' + documentTypeId)
    this._docTypeDetailService
      .getDocumentTypeDetail(documentTypeId)
      .subscribe(response => {
        console.log('oldData response - ',response)
        oldData = response as DocumentTypeDetail[]
        this.oldData = oldData
    

        this.ctrDataForTable(this.oldData, this.dmsFields);
        this.oldData.length === this.allData.length ? this.checkBoxAll = true : this.checkBoxAll = false;


        return oldData
      });
    return oldData
  }

  getDmsFields() {
    console.log('--- getDmsFields ---')
    this._dmsFieldService
      .getDmsFields()
      .subscribe(response => {
        console.log('-response- ',response)
        console.log('-oldData- ',this.oldData)
        this.dmsFields = response as DmsField[]
        if (this.documentTypeId != undefined) {
          this.getDocumentTypeDetialByDocumentTypeId(this.documentTypeId);
        } else {
          this.ctrDataForTable(this.oldData, this.dmsFields);
        }
        console.log(this.dmsFields)
      });

  }

  ctrDataForTable(documentTypeDetails: DocumentTypeDetail[], allDmsFields: DmsField[]) {
    console.log('--- ctrDataForTable ---',documentTypeDetails)
    console.log('--- ctrDataForTable ---',allDmsFields)
    let newDocTypeDetail: DocumentTypeDetail[] = []
    for (let i = 0; i < allDmsFields.length; i++) {
      let docTypeDetail = documentTypeDetails.filter(detail => detail.dmsFieldId == allDmsFields[i].id);
      // console.log(docTypeDetail)
      if (docTypeDetail.length > 0) {
        newDocTypeDetail[i] = docTypeDetail[0];
        this.flagCheck[i] = true;
        this.flagCheckOld[i] = true

        if (docTypeDetail[0].dmsFieldId == 17) {
          this.outLookText01 = docTypeDetail[0].documentTypeDetailLookup
        }

        if (docTypeDetail[0].dmsFieldId == 18) {
          this.outLookText02 = docTypeDetail[0].documentTypeDetailLookup
        }

        if (docTypeDetail[0].dmsFieldId == 19) {
          this.outLookText03 = docTypeDetail[0].documentTypeDetailLookup
        }

        if (docTypeDetail[0].dmsFieldId == 20) {
          this.outLookText04 = docTypeDetail[0].documentTypeDetailLookup
        }


        if (docTypeDetail[0].dmsFieldId == 21) {
          this.outLookVarchar01 = docTypeDetail[0].documentTypeDetailLookup
        }

        if (docTypeDetail[0].dmsFieldId == 22) {
          this.outLookVarchar02 = docTypeDetail[0].documentTypeDetailLookup
        }

        if (docTypeDetail[0].dmsFieldId == 23) {
          this.outLookVarchar03 = docTypeDetail[0].documentTypeDetailLookup
        }

        if (docTypeDetail[0].dmsFieldId == 24) {
          this.outLookVarchar04 = docTypeDetail[0].documentTypeDetailLookup
        }

        if (docTypeDetail[0].dmsFieldId == 25) {
          this.outLookVarchar05 = docTypeDetail[0].documentTypeDetailLookup
        }

        if (docTypeDetail[0].dmsFieldId == 26) {
          this.outLookVarchar06 = docTypeDetail[0].documentTypeDetailLookup
        }

        if (docTypeDetail[0].dmsFieldId == 27) {
          this.outLookVarchar07 = docTypeDetail[0].documentTypeDetailLookup
        }

        if (docTypeDetail[0].dmsFieldId == 28) {
          this.outLookVarchar08 = docTypeDetail[0].documentTypeDetailLookup
        }

        if (docTypeDetail[0].dmsFieldId == 29) {
          this.outLookVarchar09 = docTypeDetail[0].documentTypeDetailLookup
        }

        if (docTypeDetail[0].dmsFieldId == 30) {
          this.outLookVarchar10 = docTypeDetail[0].documentTypeDetailLookup
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

    console.log('--- allData ---')
    console.log(this.allData)

  }

  save() {  //insert
    console.log('---save insert---')
  
    let docId = 0;
    this._docTypeDetailService
      .createDocumentType(this.documentType)
      .subscribe(response => {
        let docType = response as DocumentType
        for (let i of this.getDataForSave()) {

          if (i.dmsFieldId == 17) {
            i.documentTypeDetailLookup = this.outLookText01
          }
          if (i.dmsFieldId == 18) {
            i.documentTypeDetailLookup = this.outLookText02
          }
          if (i.dmsFieldId == 19) {
            i.documentTypeDetailLookup = this.outLookText03
          }
          if (i.dmsFieldId == 20) {
            i.documentTypeDetailLookup = this.outLookText04
          }

          if (i.dmsFieldId == 21) {
            i.documentTypeDetailLookup = this.outLookVarchar01
          }
          if (i.dmsFieldId == 22) {
            i.documentTypeDetailLookup = this.outLookVarchar02
          }
          if (i.dmsFieldId == 23) {
            i.documentTypeDetailLookup = this.outLookVarchar03
          }
          if (i.dmsFieldId == 24) {
            i.documentTypeDetailLookup = this.outLookVarchar04
          }
          if (i.dmsFieldId == 25) {
            i.documentTypeDetailLookup = this.outLookVarchar05
          }
          if (i.dmsFieldId == 26) {
            i.documentTypeDetailLookup = this.outLookVarchar06
          }
          if (i.dmsFieldId == 27) {
            i.documentTypeDetailLookup = this.outLookVarchar07
          }
          if (i.dmsFieldId == 28) {
            i.documentTypeDetailLookup = this.outLookVarchar08
          }
          if (i.dmsFieldId == 29) {
            i.documentTypeDetailLookup = this.outLookVarchar09
          }
          if (i.dmsFieldId == 30) {
            i.documentTypeDetailLookup = this.outLookVarchar10
          }
          console.log(i)
          this._docTypeDetailService
            .createDocumentTypeDetail(docType.id, i)
            .subscribe(response => {


            });
        }
      });
    this._location.back()
  }

  update() {  //edit
    console.log('---save update edit---')
    // this.getDataForSave()
    console.log(this.getDataForSave())
    this._docTypeDetailService
      .updateDocumentType(this.documentType)
      .subscribe(response => {

      });
    for (let i of this.getDataForSave()) {
      if (i.dmsFieldId == 17) {
        i.documentTypeDetailLookup = this.outLookText01
      }
      if (i.dmsFieldId == 18) {
        i.documentTypeDetailLookup = this.outLookText02
      }
      if (i.dmsFieldId == 19) {
        i.documentTypeDetailLookup = this.outLookText03
      }
      if (i.dmsFieldId == 20) {
        i.documentTypeDetailLookup = this.outLookText04
      }

      if (i.dmsFieldId == 21) {
        i.documentTypeDetailLookup = this.outLookVarchar01
      }
      if (i.dmsFieldId == 22) {
        i.documentTypeDetailLookup = this.outLookVarchar02
      }
      if (i.dmsFieldId == 23) {
        i.documentTypeDetailLookup = this.outLookVarchar03
      }
      if (i.dmsFieldId == 24) {
        i.documentTypeDetailLookup = this.outLookVarchar04
      }
      if (i.dmsFieldId == 25) {
        i.documentTypeDetailLookup = this.outLookVarchar05
      }
      if (i.dmsFieldId == 26) {
        i.documentTypeDetailLookup = this.outLookVarchar06
      }
      if (i.dmsFieldId == 27) {
        i.documentTypeDetailLookup = this.outLookVarchar07
      }
      if (i.dmsFieldId == 28) {
        i.documentTypeDetailLookup = this.outLookVarchar08
      }
      if (i.dmsFieldId == 29) {
        i.documentTypeDetailLookup = this.outLookVarchar09
      }
      if (i.dmsFieldId == 30) {
        i.documentTypeDetailLookup = this.outLookVarchar10
      }
      if (i.id != undefined) {

        this._docTypeDetailService
          .updateDocumentTypeDetail(i)
          .subscribe(response => {

          });
      } else {
        this._docTypeDetailService
          .createDocumentTypeDetail(this.documentType.id, i)
          .subscribe(response => {

          });

      }
    }

    for (let i = 0; i < this.flagCheck.length; i++) {
      if (this.flagCheck[i] != this.flagCheckOld[i]) {
        if (this.flagCheckOld[i] == true) {
          this._docTypeDetailService
            .deleteDocumentTypeDetail(this.allData[i].id)
            .subscribe(response => {

            });
          // console.log(this.allData[i])
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
      });
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
    console.log('--- checkbox ---')
    console.log(this.allData)
    this.checkBoxAll = checkbox.checked

    if (checkbox.checked) {
      if (this.allData[index].documentTypeDetailName === '') {
        // console.log('0 ')
        let dms = this.dmsFields.filter(field => field.id == this.allData[index].dmsFieldId);
        dms.length > 0 ? this.allData[index].documentTypeDetailName = dms[0].fieldName : "";
      }
      if (this.allData[index].documentTypeDetailView === '') {
        // console.log('1')
        this.allData[index].documentTypeDetailView ='Y'
      }
      if (this.allData[index].documentTypeDetailSearch === '') {
        // console.log('2')
        this.allData[index].documentTypeDetailSearch ='Y'
      }
      if (this.allData[index].documentTypeDetailEdit === '') {
        // console.log('3')
        this.allData[index].documentTypeDetailEdit ='Y'
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
    // this.flagCheck คือ colume
    let dataSave: DocumentTypeDetail[] = []
    for (let i = 0; i < this.flagCheck.length; i++) {
      if (this.flagCheck[i]) {
        dataSave[dataSave.length] = this.allData[i];
      }
    }
    return dataSave;
  }

  getListLookUp() {
    this._docTypeDetailService
      .getListLookUp()
      .subscribe(response => {
        this.listLookUp = response
        console.log('--- getListLookUp ---')
        console.log(this.listLookUp)
      })
  }

  testEven(data:any){
    console.log(data)
  }



}
