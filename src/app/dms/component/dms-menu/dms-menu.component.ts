import { Component, OnInit, Input, Directive, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core'
import { FormControl } from '@angular/forms'
import { PxService, } from '../../../main/px.service'

import { Folder } from '../../model/folder.model'
import { FolderService } from '../../service/folder.service'

@Component({
  selector: 'app-dms-menu',
  templateUrl: './dms-menu.component.html',
  styleUrls: ['./dms-menu.component.styl'],
  providers: [FolderService],
})
export class DmsMenuComponent implements OnInit {
  // @Input() FolderId: number 
  @Input() Folder: Folder

  @Output() selecFunction = new EventEmitter();
  folderButtons:any = []

  constructor(
     private _pxService: PxService,
      private _folderService: FolderService,
  ) { }

  ngOnInit() {
    // console.log('--dms menu--')
    // console.log('Folder ',this.Folder)
    this.authMenu()
  }

  selecFunctionClick(selec:String){
    // console.log('-- selec --',selec)
    let data ={
      'selec':selec,
      'Folder':this.Folder
    }
     this.selecFunction.emit(data)

  }

   authMenu(){
    //  console.log(this.Folder.id)
     this._folderService
      .getMenu(this.Folder.id)
      .subscribe(response => {
        // console.log('authMenu button- ',response.data)
        this.folderButtons=response.data
      })

  }



}
