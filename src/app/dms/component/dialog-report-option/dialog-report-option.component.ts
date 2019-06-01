import { Component, OnInit, } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router'
import { Location } from '@angular/common'
import { Observable } from 'rxjs/Observable'
import { TdLoadingService } from '@covalent/core'
import 'rxjs/add/operator/switchMap'
import { MdDialog, MdDialogRef } from '@angular/material'
import { DocumentTypeDetailService } from '../../service/documentTypeDetail.service'
import { DocumentService } from '../../service/document.service'
import { TdDataTableService, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, ITdDataTableColumn } from '@covalent/data-table'
import { ReportInput } from '../../model/ReportInput.model';
@Component({
  selector: 'app-dialog-report-option',
  templateUrl: './dialog-report-option.component.html',
  styleUrls: ['./dialog-report-option.component.styl'],
  providers: [DocumentTypeDetailService, DocumentService]
})
export class DialogReportOptionComponent implements OnInit {


  columns: ITdDataTableColumn[] = [
    { name: 'DocType', label: 'ประเภทการออกรายงาน' },

  ];

  columns2: ITdDataTableColumn[] = [
    { name: 'dmsFieldName', label: 'ชื่อ Field' },

  ];

  data: any[] = [
    {
      id: 1,
      DocType: 'เอกสารทั้งหมด'
    },
    {
      id: 2,
      DocType: 'เอกสารหมดอายุ'
    }
  ];

  selectedRows: any[] = [];
  selectedField: any[] = [];
  docTypeId: number
  documentTypeDetails: any
  folderId: number
  listDocId: string
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _loadingService: TdLoadingService,
    private _location: Location,
    public dialogRef: MdDialogRef<DialogReportOptionComponent>,
    private _documentTypeDetailService: DocumentTypeDetailService,
    private _documentService: DocumentService,
  ) { }

  ngOnInit() {
    console.log('docTypeId -', this.docTypeId)
    this.getDocumentTypeDetail(this.docTypeId)
  }

  ok(): void {
    console.log('selectedField -', this.selectedField)
    console.log('selectedRows -', this.selectedRows)
    if (this.selectedField.length > 20) alert('คุณเลือก field ที่จะแสดงมากกว่า 20 field');

    if (this.selectedField.length > 0 && this.selectedField.length > 0) {
      let documentTypeDetailId = ''
      for (let entry of this.selectedField) {
        if (documentTypeDetailId.length == 0) { documentTypeDetailId = entry.id } else { documentTypeDetailId = documentTypeDetailId + '-' + entry.id }
      }
      console.log('documentTypeDetailId - ', documentTypeDetailId)
      let data = new ReportInput()
      if (this.folderId > 0) {
        data.reportOutput = 'PDF'
        data.folderId = this.folderId
        data.mode = this.selectedRows[0].id
        data.docTypeDetialId = documentTypeDetailId
      } else {
        // ค้นหา
        data.reportOutput = this.listDocId
        data.folderId = this.folderId
        data.mode = 3
        data.docTypeDetialId = documentTypeDetailId
      }
      console.log('data - ',data)
      this._documentService
        .createReport(data)
        .subscribe(response => {
          console.log('report - ', response)
          window.open(response.data)
          this.dialogRef.close(false);
        })

    }


  }
  cancel(): void {
    this.dialogRef.close(false);
  }

  getDocumentTypeDetail(documentTypeId: number): void {

    this._documentTypeDetailService
      .getDocumentTypeDetailMap(documentTypeId)
      .subscribe(response => {
        this.documentTypeDetails = response as any[]
        console.log('this.documentTypeDetails - ', this.documentTypeDetails)
      })


  }


}
