import { Component, OnInit } from '@angular/core'
import { MdDialogRef } from '@angular/material'

@Component({
  selector: 'app-list-histtory-user',
  templateUrl: './list-histtory-user.component.html',
  styleUrls: ['./list-histtory-user.component.styl']
})
export class ListHisttoryUserComponent implements OnInit {
  selectStructureData: any
  constructor(
    public dialogRef: MdDialogRef<ListHisttoryUserComponent>
  ) { }

  ngOnInit() {
  }

  selectStructure(event) {
    this.selectStructureData = event
  }

  selectMove(){
    this.dialogRef.close(this.selectStructureData)
  }

  close(): void {
    this.dialogRef.close(null)
  }

}
