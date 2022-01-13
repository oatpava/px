import { Component, OnInit } from '@angular/core'
import { TdLoadingService } from '@covalent/core'
import { Message } from 'primeng/primeng'
import { Location } from '@angular/common'
import { FileAttach } from '../../../main/model/file-attach.model'
import { FileUploader } from 'ng2-file-upload'
import { PxService } from '../../../main/px.service'
import { UserProfileService } from '../../service/user-profile.service'

@Component({
  selector: 'app-hrs-user',
  templateUrl: './hrs-user.component.html',
  styleUrls: ['./hrs-user.component.styl'],
  providers: [PxService, UserProfileService]
})
export class HrsUserComponent implements OnInit {
  msgs: Message[] = []
  uploader: FileUploader = new FileUploader({})
  fileAttach: FileAttach
  fileAttachRemoved: FileAttach[] = []
  linkType: string = 'STRUCTEXCEL'
  isCheck: boolean = true
  hasBaseDropZoneOver: boolean = false
  fileType: string = 'excel'
  timeAttachFile: any

  constructor(
    private _loadingService: TdLoadingService,
    private _pxService: PxService,
    private _location: Location,
    private _userProfileService: UserProfileService,
  ) { }

  ngOnInit() {
  }

  saveFile(data) {
    this.timeAttachFile = Math.floor(Math.random() * (1 - 999 + 1)) + 999
    this.uploadFile(this.timeAttachFile, this.linkType)
  }

  uploadFile(linkId: number, linkType: string) {
    let fileAttachDetail = new FileAttach({
      version: 1,
      linkType: linkType,
      linkId: this.timeAttachFile
    })
    while (this.uploader.queue.length > 1) {  // upload last index
      this.uploader.queue = this.uploader.queue.splice(this.uploader.queue.length - 1, 1)
    }
    return this._pxService.uploadFileAttachExcel(this.uploader, fileAttachDetail)
  }

  alertMsg(event) {
    this.msgs = [];
    this.msgs.push(event)
  }

  save(data) {
    this._loadingService.register('line')
    this._pxService
      .getFileAttachs(this.linkType, this.timeAttachFile, 'asc')
      .subscribe(response => {
        this._userProfileService
          .userImport('1.0', response[0].id)
          .subscribe(response => {
            this.msgs = []
            this.msgs.push(
              {
                severity: 'success',
                summary: 'สำเร็จ',
                detail: 'นำเข้า HRIS (บุคลากร)',
              },
            );
            this._loadingService.resolve('main')
          })
      })
  }

  goBack() {
    this._location.back()
  }

}
