import { Component, OnInit, ViewEncapsulation } from '@angular/core'
import { MdDialogRef } from '@angular/material'

import { Inbox } from '../../../model/inbox.model'

@Component({
  selector: 'app-dialog-cancel-send',
  templateUrl: './dialog-cancel-send.component.html',
  styleUrls: ['./dialog-cancel-send.component.styl'],
  //encapsulation: ViewEncapsulation.None
})
export class DialogCancelSendComponent implements OnInit {
  inboxs: Inbox[]
  datas: { i: number, id: number, name: string, stat: number, date: string, selected: boolean }[] = []
  selectedInboxIds: number[] = []
  allCheck: boolean = true
  numCheck: number = 0
  numCheckMax: number = 0
  canceledUsers: string = ''

  constructor(
    public dialogRef: MdDialogRef<DialogCancelSendComponent>
  ) {}

  ngOnInit() {
    this.initialDatas(this.inboxs)
  }

  initialDatas(response: Inbox[]) {
    for (let i = 0; i < response.length; i++) {
      let stat: number = 0
      let selected: boolean = true
      this.numCheckMax++ 
      if (response[i].inboxOpenFlag == 1) {
        stat = 1  
        //**//selected = false    
        if (response[i].inboxActionFlag == 1) {
          stat = 2
          selected = false
          this.numCheckMax--
        } else if (response[i].inboxFinishFlag == 1) {
          stat = 3
          selected = false
          this.numCheckMax--
        }
      }
      this.datas.push({ i: i + 1, id: response[i].id, name: response[i].inboxTo, stat: stat, date: response[i].inboxOpenDate, selected: selected })
      this.numCheck = this.numCheckMax
    }
  }

  checkAll() {
    this.numCheck = (this.allCheck) ? this.numCheckMax : 0
    //**//
    // this.datas.forEach(inbox => {
    //   if (inbox.stat == 0) {
    //     inbox.selected = this.allCheck
    //   }
    // })
    this.datas.forEach(inbox => {
      if (inbox.stat < 2) {
        inbox.selected = this.allCheck
      }
    })
  }

  select(check: boolean) {
    (check) ? this.numCheck++ : this.numCheck--
    if (this.numCheck == 0 ) {
      this.allCheck = false
    } else if (this.numCheck == this.numCheckMax) {
      this.allCheck = true
    }
  }

  ok() {
    this.datas.forEach(inbox => {
      if (inbox.selected) {
        this.selectedInboxIds.push(inbox.id)
        this.canceledUsers += inbox.name + ", "
      }
    })
    this.canceledUsers = this.canceledUsers.substr(0, this.canceledUsers.length - 2)
    if (this.canceledUsers.length > 990) {
      this.canceledUsers = this.canceledUsers.substring(0, 990) + "..."
    }
    this.dialogRef.close(this.datas.length - this.selectedInboxIds.length)
  }

}
