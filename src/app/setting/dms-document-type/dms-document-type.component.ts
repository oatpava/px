import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router'
import { Location } from '@angular/common'
import { TdLoadingService } from '@covalent/core'

import { TdDataTableService, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, ITdDataTableColumn, ITdDataTableSelectEvent } from '@covalent/core';
import { IPageChangeEvent } from '@covalent/core';

import { DocumentType } from '../../../app/dms/model/documentType.model'
import { DOCUMENTTYPES } from '../../../app/dms/model/documentType.mock'
import { DocumentTypeService } from '../../../app/dms/service/documentType.service'

@Component({
  selector: 'app-dms-document-type',
  templateUrl: './dms-document-type.component.html',
  styleUrls: ['./dms-document-type.component.styl'],
  providers: [DocumentTypeService]
})
export class DmsDocumentTypeComponent implements OnInit {
  iconHeader: string = 'text_fields'

  data: DocumentType[] = [] //no source
  columns: ITdDataTableColumn[] = [
    { name: 'documentTypeName', label: 'ชื่อประเภทเอกสาร' },
    { name: 'documentTypeDescription', label: 'รายละเอียดประเภทเอกสาร' },
  ];

  filteredData: any[]
  filteredTotal: number
  searchTerm: string = '';
  fromRow: number = 1;
  currentPage: number = 1;
  pageSize: number = 5;
  sortBy: string = 'id';
  sortOrder: TdDataTableSortingOrder = TdDataTableSortingOrder.Descending;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _loadingService: TdLoadingService,
    private _location: Location,
    private _dataTableService: TdDataTableService,
    private _docTypeService: DocumentTypeService,
  ) { }

  ngOnInit() {
    this.filter()
    this.getDocumentTypes()
  }

  sort(sortEvent: ITdDataTableSortChangeEvent): void {
    this.sortBy = sortEvent.name;
    this.sortOrder = sortEvent.order;
    this.filter();
  }
  search(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.filter();
  }
  page(pagingEvent: IPageChangeEvent): void {
    this.fromRow = pagingEvent.fromRow;
    this.currentPage = pagingEvent.page;
    this.pageSize = pagingEvent.pageSize;
    this.filter();
  }
  filter(): void {
    let newData: any[] = this.data;
    newData = this._dataTableService.filterData(newData, this.searchTerm, true);
    this.filteredTotal = newData.length;
    newData = this._dataTableService.sortData(newData, this.sortBy, this.sortOrder);
    newData = this._dataTableService.pageData(newData, this.fromRow, this.currentPage * this.pageSize);
    this.filteredData = newData;
  }
  getDocumentTypes() {  //no source
    this._docTypeService
      .getDocumentTypes()
      .subscribe(response => {
        this.data = (response as DocumentType[])
      });
  }
  add() {
    let param = {
      t: new Date().getTime(),
      title: 'สร้างประเภทเอกสาร',
      mode: 'Add',
    }
    this._router.navigate(
      ['/main', {
        outlets: {
          center: ['document-type-detail', param],
        }
      }],
      { relativeTo: this._route })
  }

  select(editDocumentType: DocumentType) {
    console.log('edit');
    let param = {
      t: new Date().getTime(),
      title: 'แก้ไขประเภทเอกสาร',
      mode: 'Edit',
      documentTypeId: editDocumentType.id,
    }
    this._router.navigate(
      ['/main', {
        outlets: {
          center: ['document-type-detail', param],
        }
      }],
      { relativeTo: this._route })
  }

  goBack() {
    this._location.back()
  }
}
