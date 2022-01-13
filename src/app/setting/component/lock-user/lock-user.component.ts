import { Component, OnInit } from '@angular/core'
import { UserStatus } from '../../model/user-status.model'
import { MdDialogRef } from '@angular/material'
import { UserProfileService } from '../../service/user-profile.service'

@Component({
  selector: 'app-lock-user',
  templateUrl: './lock-user.component.html',
  styleUrls: ['./lock-user.component.styl'],
  providers: [UserProfileService]
})
export class LockUserComponent implements OnInit {
  userProfileId: number
  structureId: number
  status: any
  statusData: UserStatus
  userStatus: UserStatus[] = []

  constructor(
    private _userProfileService: UserProfileService,
    public dialogRef: MdDialogRef<LockUserComponent>
  ) { }

  ngOnInit() {
    this.getUserStatus()
  }

  getUserStatus() {
    this._userProfileService
      .getUserStatus()
      .subscribe(response => {
        console.log(response)
        this.userStatus = response
        this.statusData = this.status.id
      })
  }

  change(event) {
    this.status.id = event
  }

  save(status) {
    this.dialogRef.close(status)
  }


  close(): void {
    this.dialogRef.close()
  }

}
