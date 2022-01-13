import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Params } from '@angular/router'
import { Location } from '@angular/common'
import { Message } from 'primeng/primeng'
import { MdDialog } from '@angular/material'

import { DeleteDialogComponent } from '../../../../main/component/delete-dialog/delete-dialog.component'
import { ConfirmDialogComponent } from '../../../../main/component/confirm-dialog/confirm-dialog.component'

import { Structure } from '../../../model/structure.model'
import { StructureService } from '../../../service/structure.service'
import { StructureFolder } from '../../../model/structure-folder.model'

@Component({
  selector: 'app-add-organize',
  templateUrl: './add-organize.component.html',
  styleUrls: ['./add-organize.component.styl'],
  providers: [StructureService]
})
export class AddOrganizeComponent implements OnInit {
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
    private _location: Location,
    private _structureService: StructureService,
    private _dialog: MdDialog
  ) { }

  ngOnInit() {
    this.structure = new Structure({ name: '', code: '', detail: '' })
    this._route.params
      .subscribe((params: Params) => {
        this.mode = params['mode']
        this.modeTitle = params['modeTitle']
        this.parentId = +params['parentId']
        this.getOrg(this.mode, this.parentId)
      })
  }

  getOrg(mode: string, structureId: number) {
    this._structureService
      .getOrg('1.0', structureId)
      .subscribe(response => {
        console.log(response)
        this.structure = response
      })
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
          .deleteOrg(structure)
          .subscribe(response => {
            this.msgs = [];
            this.msgs.push({
              severity: 'success',
              summary: 'ลบข้อมูลสำเร็จ',
              detail: 'หน่วยงาน' + structure.name
            })
          })
      }
    })
  }

  updateStructure(structure: Structure) {

    let dialogRef = this._dialog.open(ConfirmDialogComponent, {
      width: '50%',
    });
    let instance = dialogRef.componentInstance
    instance.dataName = 'แก้ไข หน่วยงาน' + structure.name
    dialogRef.afterClosed().subscribe(result => {

      if (result) {

        this.msgs = [];
        this.msgs.push({
          severity: 'success',
          summary: 'บันทึกสำเร็จ',
          detail: 'แก้ไขหน่วยงาน' + structure.name
        })
        this._structureService
          .updateOrg(structure)
          .subscribe(response => {
            setTimeout(() => {
              this.goBack()
            }, 1000);
          })
      }
    })
  }


  createStructure(structure: Structure) {
    structure.parentId = this.parentId
    this._structureService
      .checkOrgCode(structure.code, structure.name, 0)
      .subscribe(response => {
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
                severity: 'success',
                summary: 'บันทึกสำเร็จ',
                detail: 'เพิ่มหน่วยงาน' + structure.name
              })
              this._structureService
                .createOrg(structure)
                .subscribe(response => {
                  setTimeout(() => {
                    this.goBack()
                  }, 1000);
                })
            }
          })
        }
      })
  }

  goBack() {
    this._location.back()
  }

}
