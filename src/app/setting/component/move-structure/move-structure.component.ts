import { Component, OnInit } from '@angular/core'
import { Message } from 'primeng/primeng'
import { Structure } from '../../model/structure.model'
import { MdDialog, MdDialogRef } from '@angular/material'
import { StructureService } from '../../service/structure.service'
import { ConfirmDialogComponent } from '../../../main/component/confirm-dialog/confirm-dialog.component'

@Component({
  selector: 'app-move-structure',
  templateUrl: './move-structure.component.html',
  styleUrls: ['./move-structure.component.styl'],
  providers: [StructureService]
})
export class MoveStructureComponent implements OnInit {
  msgs: Message[] = []
  structureData: any
  selectStructureData: any
  structure: Structure
  isOrganize: boolean = false

  constructor(
    private _structureService: StructureService,
    public dialogRef: MdDialogRef<MoveStructureComponent>,
    private _dialog: MdDialog
  ) { }

  ngOnInit() {
    this.structure = new Structure()
    this.structure.id = this.structureData.id
    this.structure.name = this.structureData.name
    this.structure.shortName = this.structureData.shortName
    this.structure.detail = this.structureData.detail
    this.structure.code = this.structureData.code
    this.structure.nodeLevel = this.structureData.nodeLevel
    this.structure.parentId = this.structureData.parentId
    this.structure.parentKey = this.structureData.parentKey
  }

  selectStructure(event) {
    this.selectStructureData = event
  }

  selectMove() {
    this.structure.parentId = this.selectStructureData.id
    let dialogRef1 = this._dialog.open(ConfirmDialogComponent, {
      width: '50%',
    });
    let instance = dialogRef1.componentInstance
    instance.dataName = 'ย้าย หน่วยงาน' + this.structure.name
    dialogRef1.afterClosed().subscribe(result => {
      if (result) {
        if (!this.isOrganize) {
          this._structureService
            .updateStructure(this.structure)
            .subscribe(response => {
              this.dialogRef.close(true)
            })
        } else {
          this._structureService
            .updateOrg(this.structure)
            .subscribe(response => {
              this.dialogRef.close(true)
            })
        }
      }
    })
  }

  close(): void {
    this.dialogRef.close()
  }


}
