import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material'
import { ContentRecord } from '../../../model/contentRecord.model'
import { SarabanRecordService } from '../../../service/saraban-record.service'
import { ParamSarabanService } from '../../../service/param-saraban.service'

@Component({
  selector: 'app-dialog-record',
  templateUrl: './dialog-record.component.html',
  styleUrls: ['./dialog-record.component.styl'],
  providers: [SarabanRecordService]
})
export class DialogRecordComponent implements OnInit {
  addMode: boolean = false
  contentId: number = 0
  record = new ContentRecord()
  records: ContentRecord[] = []
  dateTime: string = ''

  constructor(
    public dialogRef: MdDialogRef<DialogRecordComponent>,
    private _recordService: SarabanRecordService,
    private _paramSarabanService: ParamSarabanService
  ) { }

  ngOnInit() {
    if (!this.addMode) {
      this.getRecords()
    } else {
      this.record.contentId = this.contentId
      this.dateTime = this._paramSarabanService.getStringDateTime(new Date()).substr(0, 16)
    }
  }

  close() {
    this.dialogRef.close()
  }

  getRecords() {
    this._recordService
      .listByContentId(this.contentId)
      .subscribe(reponse => {
        this.records = reponse
      })
  }

  createRecord() {
    this._recordService
      .create(this.record)
      .subscribe(respone => {
        this.dialogRef.close(true)
      })
  }

}
