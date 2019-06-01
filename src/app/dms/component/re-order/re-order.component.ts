import { Component, OnInit, OnDestroy, Input } from '@angular/core'
import { Router, ActivatedRoute, Params } from '@angular/router'
import { Location } from '@angular/common'
import { Observable } from 'rxjs/Observable'
import { TdLoadingService } from '@covalent/core'

import 'rxjs/add/operator/switchMap'
import 'rxjs/add/operator/map'

import { FolderService } from '../../service/folder.service'
import { DmsFieldService } from '../../service/dmsField.service'
import { Folder } from '../../model/folder.model'
import { Menu } from '../../model/menu.model'
import { Document } from '../../model/document.model'
import { DmsField } from '../../model/dmsField.model';
import { DocumentType } from '../../model/documentType.model'

@Component({
  selector: 'app-re-order',
  templateUrl: './re-order.component.html',
  styleUrls: ['./re-order.component.styl']
})
export class ReOrderComponent implements OnInit {


  listOne: any[]
  listid: string = ''
  parentId: number
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _loadingService: TdLoadingService,
    private _folderService: FolderService,
    // private _dmsFieldService: DmsFieldService,
    private _location: Location,
  ) { }

  ngOnInit() {

    this._route.params
      .subscribe((params: Params) => {
        // console.log('ListFolderComponent ngOnInit this.parentId = '+this.parentId)
        if (!isNaN(params['parentId'])) this.parentId = +params['parentId']
        this.getFolders(this.parentId)
      })
  }


  cancel() {
    console.log('--- cancel ---')
    this._location.back()
  }

  saveOrder() {
    console.log('--- saveOrder ---')
    for (let i of this.listOne) {
      if (this.listid == '') {
        this.listid = i.id
      } else {
        this.listid = this.listid + ',' + i.id
      }

    }

    console.log(this.listid)
   
    this._loadingService.register('main')
    this._folderService
      .reOrder(this.listid)
      .subscribe(response => {
       this._location.back()
      })
    this._loadingService.resolve('main')
    // this.getFolders(this.parentId)
    // this._location.back();
    
  }

  getFolders(parentId: number): void {
    this._loadingService.register('main')
    this._folderService
      .getFolders(parentId)
      .subscribe(response => {
        this.listOne = response as Folder[]
      })
    this._loadingService.resolve('main')
  }


   goBack() {
    this._location.back()
  }

}