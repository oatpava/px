import { MdDialog } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router'
import { Observable } from 'rxjs/Observable'
import { Observer } from 'rxjs/Observer'
import { Location } from '@angular/common'
import 'rxjs/add/operator/switchMap'
import { TdDataTableService, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, ITdDataTableColumn, TdLoadingService, TdDialogService } from '@covalent/core';
import { IPageChangeEvent } from '@covalent/paging';
import { DocumentTypeService } from '../../service/document-type.service'
import { WfDocumentType } from '../../model/wfDocumentType.model';

@Component({
  selector: 'app-list-document-type',
  templateUrl: './list-document-type.component.html',
  styleUrls: ['./list-document-type.component.styl'],
  providers: [DocumentTypeService]
})
export class ListDocumentTypeComponent implements OnInit {
  iconHeader: String = 'list'
  title: String = 'ประเภทเอกสาร'
  listMenu: string = 'menu'
  filteredTotal: number;
  currentPage: number = 1;
  pageSize: number = 10;
  fromRow: number = 1;
  filteredData: any[] = [];
  allData: any[]

  columns: ITdDataTableColumn[] = [
    { name: 'docTypeName', label: 'ชื่อประเภทเอกสาร' },
    { name: 'docTypeDetail', label: 'รายละเอียดประเภทเอกสาร' },
  ];

  constructor(private _route: ActivatedRoute,
    private _router: Router,
    private _loadingService: TdLoadingService,
    private _location: Location,
    private _documentTypeService: DocumentTypeService,
    private _dataTableService: TdDataTableService,
    private _dialogService: TdDialogService,
    private _dialog: MdDialog) {
    this.getDocumentType()
  }

  ngOnInit() {
  }

  goBack() {
    this._location.back()
  }

  selectObj(documentType: WfDocumentType) {
    let param = {
      documentTypeId: documentType.id
    }
    this._router.navigate(
      ['/main', {
        outlets: {
          center: ['edit-document-type', param],
        }
      }],
      { relativeTo: this._route })
  }

  page(pagingEvent: IPageChangeEvent): void {
    this.fromRow = pagingEvent.fromRow;
    this.currentPage = pagingEvent.page;
    this.pageSize = pagingEvent.pageSize;
    this.filter();
  }

  filter(): void {
    let newData: any[] = this.allData
    // this.filteredTotal = newData.length;
    // newData = this._dataTableService.pageData(newData, this.fromRow, this.currentPage * this.pageSize);
    this.filteredData = newData;
  }

  getDocumentType(): void {
    this._loadingService.register('main')
    this._documentTypeService
      .getAllDocumentTypes()
      .subscribe(response => {
        this.allData = response as WfDocumentType[]
        this.filter()
      })
    this._loadingService.resolve('main')
  }

  add() {
    let param = {
      t: new Date().getTime(),
    }
    this._router.navigate(
      ['/main', {
        outlets: {
          center: ['edit-document-type', param],
        }
      }],
      { relativeTo: this._route })
  }

  deleteType(wfDocumentType: WfDocumentType) {
    this._documentTypeService.deleteDocumentType(wfDocumentType.id).subscribe(response => {
      if (response != null) {
        this.getDocumentType()
      } else {
        return;
      }
    })
  }
}