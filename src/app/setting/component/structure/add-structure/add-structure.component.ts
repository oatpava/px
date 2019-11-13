import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute, Params } from '@angular/router'
import { Location } from '@angular/common'
import { TdLoadingService } from '@covalent/core'
import { TreeModule, TreeNode, Message } from 'primeng/primeng'
import { MdDialog, MdDialogRef } from '@angular/material'

import { DeleteDialogComponent } from '../../../../main/component/delete-dialog/delete-dialog.component'
import { ConfirmDialogComponent } from '../../../../main/component/confirm-dialog/confirm-dialog.component'

import { Structure } from '../../../model/structure.model'
import { StructureService } from '../structure.service'
import { StructureFolder } from '../../../model/structure-folder.model'

import { SarabanFolder } from '../../../../saraban/model/sarabanFolder.model'
import { SarabanService } from '../../../../saraban/service/saraban.service'

@Component({
  selector: 'px-add-structure',
  templateUrl: './add-structure.component.html',
  styleUrls: ['./add-structure.component.styl'],
  providers: [StructureService, SarabanService],
})
export class AddStructureComponent implements OnInit {
  msgs: Message[] = []
  mode: string = 'add'
  modeTitle: string = 'เพิ่ม'
  structure: Structure
  structureId: number
  parentStructure: Structure
  parentId: number
  structureFolders: StructureFolder[]
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _loadingService: TdLoadingService,
    private _location: Location,
    private _structureService: StructureService,
    private _dialog: MdDialog,
    private _sarabanService: SarabanService
  ) { }

  ngOnInit() {
    // this.parentStructure = new Structure()
    this.structure = new Structure({ name: '', code: '', detail: '' })
    this._route.params
      .subscribe((params: Params) => {
        this.mode = params['mode']
        this.modeTitle = params['modeTitle']
        this.parentId = +params['parentId']
        this.getStructure(this.mode, this.parentId)
      })
  }

  createStructure(structure: Structure) {
    //check Code
    this._structureService
      .checkStructureCode(structure.code, structure.name, 0)
      .subscribe(response => {
        console.log(response)
        //check Code
        if (response.result) {
          this.msgs = [];
          this.msgs.push({
            severity: 'warn',
            summary: 'ไม่สามารถเพิ่มได้เนื่องจาก',
            detail: 'รหัสหน่วยงาน หรือชื่อหน่วยงาน ซ้ำ'
          })
        } else {
          let dialogRef = this._dialog.open(ConfirmDialogComponent, {
            width: '50%',
          });
          let instance = dialogRef.componentInstance
          instance.dataName = 'เพิ่ม หน่วยงาน' + structure.name
          dialogRef.afterClosed().subscribe(result => {

            if (result) {

              this.msgs = [];
              this.msgs.push({
                severity: 'info',
                summary: 'บันทึกสำเร็จ',
                detail: 'เพิ่มหน่วยงาน' + structure.name
              })
              this._structureService
                .createStructure(structure)
                .subscribe(response => {
                  setTimeout(() => {
                    this.createStructureFolders(response)
                  }, 1000);
                })
            }
          })
        }
        //check Code
      })
  }

  createStructureFolders(structure: Structure) {
    let structureFolder = new StructureFolder({
      structureId: structure.id,
      structureFolderName: 'กล่องหนังสือเข้า',
      structureFolderType: 'I',
      structureFolderDetail: 'หนังสือเข้าของ ' + structure.name
    })
    this._structureService
      .createStructureFolder(structureFolder)
      .subscribe(response => {
        structureFolder = new StructureFolder({
          structureId: structure.id,
          structureFolderName: 'กล่องหนังสือออก',
          structureFolderType: 'O',
          structureFolderDetail: 'หนังสือออกของ ' + structure.name
        })
        this._structureService
          .createStructureFolder(structureFolder)
          .subscribe(response => {
            this._loadingService.resolve('main')

            if (structure.parentId != 1) {//get folder type 3 of parent Structure to use folderId as parentFodlerId
              this._sarabanService
              .listSarabanFoldersByStructureId(structure.parentId)
              .subscribe(parentFolder => {
                if (parentFolder.length > 0) this.createSarabanFolder(structure, parentFolder[0].id)
                else this.createSarabanFolder(structure, 0)
              })
            } else this.createSarabanFolder(structure, 0)
          })
      })
  }

  updateStructure(structure: Structure) {
    //check Code
    this._structureService
      .checkStructureCode(structure.code, structure.name, structure.id)
      .subscribe(response => {
        console.log(response)
        //check Code
        if (response.result) {
          this.msgs = [];
          this.msgs.push({
            severity: 'warn',
            summary: 'ไม่สามารถเพิ่มได้เนื่องจาก',
            detail: 'รหัสหน่วยงาน ซ้ำ'
          })
        } else {

          let dialogRef = this._dialog.open(ConfirmDialogComponent, {
            width: '50%',
          });
          let instance = dialogRef.componentInstance
          instance.dataName = 'แก้ไข หน่วยงาน' + structure.name
          dialogRef.afterClosed().subscribe(result => {

            if (result) {

              this.msgs = [];
              this.msgs.push({
                severity: 'info',
                summary: 'บันทึกสำเร็จ',
                detail: 'แก้ไขหน่วยงาน' + structure.name
              })
              this._structureService
                .updateStructure(structure)
                .subscribe(response => {

                  setTimeout(() => {
                    this.updateStructureFolders(structure)
                  }, 1000);

                })
            }
          })

        }
        //check Code
      })
  }

  updateStructureFolders(structure: Structure) {
    if (this.structure.name !== structure.name) {
      this.structureFolders[0].structureFolderDetail = 'หนังสือเข้าของ ' + structure.name
      this.structureFolders[1].structureFolderDetail = 'หนังสือออกของ ' + structure.name
      this._structureService
        .upDateStructureFolder(this.structureFolders[0])
        .subscribe(response => {
          this._structureService
            .upDateStructureFolder(this.structureFolders[1])
            .subscribe(response => {
              this.goBack()
            })
        })
    } else this.goBack()
  }

  deleteStructure(structure: Structure) {
    let dialogRef = this._dialog.open(DeleteDialogComponent, {
      width: '50%',
    });
    let instance = dialogRef.componentInstance
    instance.dataName = 'หน่วยงาน' + structure.name
    dialogRef.afterClosed().subscribe(result => {

      if (result) {
        this._structureService
          .deleteStructure(structure)
          .subscribe(response => {
            this.msgs = [];
            this.msgs.push({
              severity: 'success',
              summary: 'ลบข้อมูลสำเร็จ',
              detail: 'หน่วยงาน' + structure.name
            })

            this.deleteStructureFolders()
          })
      }
    })


  }

  deleteStructureFolders() {
    this._structureService
      .deleteStructureFolder(this.structureFolders[0])
      .subscribe(response => {
        this._structureService
          .deleteStructureFolder(this.structureFolders[1])
          .subscribe(response => {
            this.goBack()
          })
      })
  }

  getStructure(mode: string, structureId: number) {
    this._structureService
      .getStructure('1.0', structureId)
      .subscribe(response => {
        if (this.mode === 'add') {
          this.structure.parentId = response.id
          this.structure.parentKey = response.parentKey
        } else {
          this.structure = response
          this.getStructureFolders(structureId)
        }
      })
  }

  getStructureFolders(structureId: number) {
    this._structureService
      .getStructureFolders(structureId)
      .subscribe(response => {
        this.structureFolders = response
      })
  }

  goBack() {
    this._location.back()
  }

  createSarabanFolder(structure: Structure, rootParentId: number): void {
    let folder = new SarabanFolder()
    folder.parentId = rootParentId
    folder.wfFolderType = "T"
    folder.wfFolderLinkId = structure.id
    folder = this._sarabanService.changeBudgetYear(folder, false)
    folder = this._sarabanService.changeBookNoType(folder)
    folder.wfContentType.id = 3
    folder.wfContentType2.id = 1
    folder.wfFolderName = structure.name
    this._sarabanService
      .createSarabanFolder(folder)
      .subscribe(response => {
        let parentId = response.id
        folder.parentId = parentId

        folder.wfContentType.id = 1
        folder.wfContentType2.id = 2
        folder.wfFolderName = "ทะเบียนรับหนังสือภายใน"
        folder.wfFolderDetail = "ทะเบียนรับ"
        this._sarabanService
          .createSarabanFolder(folder)
          .subscribe(response => {
            folder.wfContentType.id = 1
            folder.wfContentType2.id = 3
            folder.wfFolderName = "ทะเบียนรับหนังสือภายนอก"
            folder.wfFolderDetail = "ทะเบียนรับ"
            this._sarabanService
              .createSarabanFolder(folder)
              .subscribe(response => {
                folder.wfContentType.id = 2
                folder.wfContentType2.id = 2
                folder.wfFolderName = "ทะเบียนส่งหนังสือภายใน"
                folder.wfFolderDetail = "ทะเบียนส่ง"
                this._sarabanService
                  .createSarabanFolder(folder)
                  .subscribe(response => {
                    folder.wfContentType.id = 2
                    folder.wfContentType2.id = 3
                    folder.wfFolderName = "ทะเบียนส่งหนังสือภายนอก"
                    folder.wfFolderDetail = "ทะเบียนรส่ง"
                    this._sarabanService
                      .createSarabanFolder(folder)
                      .subscribe(response => {
                        this.goBack()
                      })
                  })
              })
          })
      })
  }


}
