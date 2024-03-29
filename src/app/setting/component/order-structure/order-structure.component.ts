import { Component, OnInit } from '@angular/core'
import { MdDialogRef } from '@angular/material'
import { StructureService } from '../../service/structure.service'

@Component({
  selector: 'app-order-structure',
  templateUrl: './order-structure.component.html',
  styleUrls: ['./order-structure.component.styl'],
  providers: [StructureService],
})
export class OrderStructureComponent implements OnInit {
  structureId: number
  type: string
  dataList: any[]
  typeName: string
  constructor(
    private _structureService: StructureService,
    public dialogRef: MdDialogRef<OrderStructureComponent>
  ) { }

  ngOnInit() {
    if (this.type == 'user') {
      this.typeName = 'บุคลากร'
      this.loadParentUser()
    } else if (this.type == 'structure') {
      this.typeName = 'หน่วยงาน'
      this.loadParentStructure()
    } else {
      this.typeName = 'หน่วยงานภายนอก'
      this.loadParentOrganize()
    }
  }

  loadParentStructure() {
    this._structureService
      .getStructures('1.0', '0', '200', 'orderNo', 'asc', this.structureId)
      .subscribe(response => {
        this.dataList = response
      })
  }

  loadParentUser() {
    this._structureService
      .getUserProfiles('1.1', '0', '200', 'orderNo', 'asc', this.structureId)
      .subscribe(response => {
        this.dataList = response
      })
  }

  loadParentOrganize() {
    this._structureService
      .getOutStructures('1.0', '0', '200', 'orderNo', 'asc', this.structureId)
      .subscribe(response => {
        this.dataList = response
      })
  }

  selectMove() {
    this.dialogRef.close()
  }

  rightData(item, data) {
    let index = data.indexOf(item)
    console.log(data[index + 1])
    if (this.type == 'user') {
      if (typeof data[index + 1] == 'undefined') {
        this._structureService
          .orderProfile(item.id, 0, item)
          .subscribe(response => {
          })
      } else {
        this._structureService
          .orderProfile(item.id, data[index + 1].id, item)
          .subscribe(response => {
          })
      }

    } else if (this.type == 'structure') {
      if (typeof data[index + 1] == 'undefined') {
        this._structureService
          .orderStructure(item.id, 0, item)
          .subscribe(response => {
          })
      } else {
        this._structureService
          .orderStructure(item.id, data[index + 1].id, item)
          .subscribe(response => {
          })
      }

    } else {
      if (typeof data[index + 1] == 'undefined') {
        this._structureService
          .orderOrganize(item.id, 0, item)
          .subscribe(response => {
          })
      } else {
        this._structureService
          .orderOrganize(item.id, data[index + 1].id, item)
          .subscribe(response => {
          })
      }
    }
  }

  close(): void {
    this.dialogRef.close()
  }

}
