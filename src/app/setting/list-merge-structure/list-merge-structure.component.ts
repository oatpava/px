import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute, Params } from '@angular/router'
import { TdLoadingService, LoadingType, LoadingMode } from '@covalent/core'
import { TreeModule, TreeNode, Message } from 'primeng/primeng'
import { Location } from '@angular/common'

import { TdDataTableService, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, ITdDataTableColumn, ITdDataTableSelectEvent } from '@covalent/core';
import { IPageChangeEvent } from '@covalent/core'
import { MdDialog, MdDialogRef } from '@angular/material'

import { MergeStructureComponent } from '../../setting/component/merge-structure/merge-structure.component'

import { PxService } from '../../main/px.service'

import { VStructureModel } from '../../setting/model/structure.model'
import { StructureConvertModel } from '../../setting/model/structure.model'
import { StructureService } from '../../setting/component/structure/structure.service'
import { ConfirmDialogComponent } from '../../main/component/confirm-dialog/confirm-dialog.component'

import { Observable } from 'rxjs/Observable'
import { StructureFolder } from '../../setting/model/structure-folder.model'
import { Structure } from '../model/structure.model';
import { WSAETIMEDOUT } from 'constants';

@Component({
  selector: 'app-list-merge-structure',
  templateUrl: './list-merge-structure.component.html',
  styleUrls: ['./list-merge-structure.component.styl'],
  providers: [PxService, StructureService]
})
export class ListMergeStructureComponent implements OnInit {
  msgs: Message[] = []
  data: any[] = [] //no source
  ModeSearch: boolean = true
  searchMerge: any
  dataSearch: 'none'
  allRecord: number = 0
  allCheck: boolean = true
  numCheck: number = 0
  dataRow: any
  dataSaveAll: any[] = [] //no source
  selectedRow: any[]
  status: any = [
    {
      id: null,
      name: ''
    }, {
      id: 1,
      name: 'เพิ่ม'
    }, {
      id: 2,
      name: 'ลบ'
    }, {
      id: 3,
      name: 'แก้ไข'
    }
  ]
  rowSelected: StructureConvertModel[] = []
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _loadingService: TdLoadingService,
    private _location: Location,
    private _pxService: PxService,
    private _dialog: MdDialog,
    private _dataTableService: TdDataTableService,
    private _structureService: StructureService,
  ) { }

  ngOnInit() {
    this.searchMerge = {
      vstatus: '',
      structureCode: '',
      structureName: '',
      strucShortName: '',
      strucDetail: ''
    }
    console.log(this.rowSelected)
    this.getdata()
  }

  getdata() {  //no source
    this.selectedRow = []
    this._loadingService.register('main')
    this._structureService
      .getStructureConvert('1.0', '0', '20', '', '')
      .subscribe(response => {
        let dataResponse = response
        console.log(response)
        this._loadingService.resolve('main')
        this.dataSaveAll = response
        this.data = dataResponse
        this.allRecord = response.length
      });
  }


  searchdata(data) {  //no source
    this._loadingService.register('main')
    this._structureService
      .searchStructureConvert(data, '1.0', '0', '20', '', '')
      .subscribe(response => {
        console.log(response)
        let dataResponse = response
        console.log(response)
        this._loadingService.resolve('main')
        this.dataSaveAll = response
        this.data = dataResponse

        this.allRecord = response.length
      });
  }

  sideNavAlert(e): void {
    if (e.toElement.className === 'md-sidenav-backdrop') {
      this.ModeSearch = true;
    }
  }

  onDateChanged(event: any) {
  }

  selectRow(data) {
    console.log(data)
    let dialogRef = this._dialog.open(MergeStructureComponent, {
      width: '50%',
    });
    let instance = dialogRef.componentInstance
    instance.data = data
    // instance.structureData = this.parentStructure
    dialogRef.afterClosed().subscribe(result => {

    })
  }


  save() {
    console.log(this.selectedRow)
    let dialogRef = this._dialog.open(ConfirmDialogComponent, {
      width: '50%',
    });
    let instance = dialogRef.componentInstance
    instance.dataName = 'ดำเนินการเพื่อปรับโครงสร้างหน่วยงานตามที่เลือก '
    dialogRef.afterClosed().subscribe(result => {

      this.rowSelected = []
      this.selectedRow.forEach((data: any) => {
        let rowSelected: StructureConvertModel = new StructureConvertModel()
        console.log(data)
        rowSelected.status = data.status

        if (data.structure == null) {
          rowSelected.structure = null
        } else {
          rowSelected.structure.id = data.structure.id
          rowSelected.structure.name = data.structure.name
          rowSelected.structure.shortName = data.structure.shortName
          rowSelected.structure.detail = data.structure.detail
          rowSelected.structure.code = data.structure.code
          rowSelected.structure.nodeLevel = data.structure.nodeLevel
          rowSelected.structure.parentId = data.structure.parentId
          rowSelected.structure.parentKey = data.structure.parentKey
        }
        if (data.vStructure == null) {
          rowSelected.vStructure = null
        }
        else {
          rowSelected.vStructure.id = data.vStructure.id
          rowSelected.vStructure.name = data.vStructure.name
          rowSelected.vStructure.shortName = data.vStructure.shortName
          rowSelected.vStructure.detail = data.vStructure.detail
          rowSelected.vStructure.code = data.vStructure.code
        }
        this.rowSelected.push(rowSelected)
      })
      console.log(this.rowSelected)


      this._loadingService.register('main')
      this._structureService
        .convertStructure(this.rowSelected)
        .subscribe(response => {
          console.log('==============response save', response)
          if (response.length !== 0) {
            this._loadingService.resolve('main')                    
            this.msgs = [];
            this.msgs.push({
              severity: 'success',
              summary: 'บันทึกสำเร็จ',
              detail: 'ดำเนินการเพื่อปรับโครงสร้างหน่วยงานเรียบร้อย'
            })

            this.getdata()
            // let tmp: any[] = []
            // tmp.push(this._structureService.createStructureFolder(this.genStructureFolderI(response[0])))
            // tmp.push(this._structureService.createStructureFolder(this.genStructureFolderO(response[0])))
            // this._loadingService.register('main')
            // Observable.forkJoin(tmp)
            //   .subscribe((res: any[]) => {
            //     this._loadingService.resolve('main')
            //     this.getdata()
            //   })
          } else {
            this._loadingService.resolve('main')
            this.msgs = [];
            this.msgs.push({
              severity: 'error',
              summary: 'ไม่สามารถบันทึกได้',
              detail: 'ต้องบันทึกหน่วยงานตามลำดับ เช่น บันทึกฝ่ายก่อนสำนักงาน กรม กอง'
            })
          }
        })
    })
  }

  saveAll() {
    console.log('Save', this.dataSaveAll)
    this._loadingService.register('main')
    this._structureService
      .convertStructure(this.dataSaveAll)
      .subscribe(response => {
        console.log('==============response saveAll', response)
        this._loadingService.resolve('main')
        
        this.getdata()//do folder action in service instead
        // let tmp: any[] = []
        // response.forEach(structure => {
        //   tmp.push(this._structureService.createStructureFolder(this.genStructureFolderI(structure)))
        //   tmp.push(this._structureService.createStructureFolder(this.genStructureFolderO(structure)))
        // })
        // this._loadingService.register('main')
        // Observable.forkJoin(tmp)
        //   .subscribe((res: any[]) => {
        //     this._loadingService.resolve('main')
        //     this.getdata()
        //   })
      })
  }

  goBack() {
    this._location.back()
  }

  genStructureFolderI(structure: Structure): StructureFolder {
    console.log('gen I ', structure)
    return new StructureFolder({
      structureId: structure.id,
      structureFolderName: 'กล่องข้อมูลเข้า',
      structureFolderType: 'I',
      structureFolderDetail: 'ข้อมูลเข้าของ ' + structure.name
    })
  }

  genStructureFolderO(structure: Structure): StructureFolder {
    console.log('gen O ', structure)
    return new StructureFolder({
      structureId: structure.id,
      structureFolderName: 'กล่องข้อมูลออก',
      structureFolderType: 'O',
      structureFolderDetail: 'ข้อมูลออกของ ' + structure.name
    })
  }



}
