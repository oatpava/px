import { Component, OnInit, Input, Directive, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core'
import { FormControl } from '@angular/forms'
import { PxService, } from '../../../main/px.service'
import { FolderService } from '../../../dms/service/folder.service'


import { FileUploader, FileSelectDirective } from 'ng2-file-upload'


import { FileAttach } from '../../../main/model/file-attach.model'
import { environment } from '../../../../environments/environment'

import { MdDialog, MdDialogRef } from '@angular/material';
import { TimerObservable } from 'rxjs/observable/TimerObservable'
import { DeleteDialogComponent } from '../../../main/component/delete-dialog/delete-dialog.component';
import * as es6printJS from "print-js";
import { ParamSarabanService } from '../../../saraban/service/param-saraban.service'
@Component({
  selector: 'app-file-attach',
  templateUrl: './file-attach.component.html',
  styleUrls: ['./file-attach.component.styl'],
})
export class FileAttachComponent implements OnInit {
  @Input() isAttach: boolean = false
  @Input() fileAttachs: any[]
  @Input() fileAttachRemoved: FileAttach[]
  @Input() checkInCheckOutLockStatus: boolean = false


  @Output() referenceFileAttachId = new EventEmitter();
  @Output() updateAtt = new EventEmitter();
  @Output() secrets = new EventEmitter();
  @Output() UpdateSecrets = new EventEmitter();
  @Output() addAttachFile = new EventEmitter();



  @Input() uploader: FileUploader
  @Input() uploaderUpdate: FileUploader
  @Input() myImage: any
  @Input() edit: boolean
  @ViewChild('file') file: ElementRef;
  @ViewChild('file') file2: ElementRef;

  @Input() folderId: number

  editMode: boolean = false
  hiddenButton: boolean = false

  authCreDocFile: boolean = false
  authEditDocFile: boolean = false
  authDelDocFile: boolean = false
  checkIe: boolean = false
  checkChrome: boolean = false
  fileAttachUpdate: FileAttach[]

  secretClassArr: any[] = []

  secretClassData: number = 1

  secretClass: any[] = [
    { id: 1, name: 'ปกติ' }, { id: 2, name: 'ลับ' }, { id: 3, name: 'ลับมาก' }, { id: 4, name: 'ลับที่สุด' }
  ]

  readonly allowedMimeType: any = [
    'image/png',
    'image/jpeg',
    'image/tiff',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'compress/zip',
    'compress/rar',
    'compress/7z'
  ];

  constructor(
    private _pxService: PxService,
    private _folderService: FolderService,
    private _dialog: MdDialog,
    private _paramSarabanService: ParamSarabanService
  ) {
    this.fileAttachUpdate = []
    // console.log('constructor file attach')
  }

  ngOnInit() {
    console.log('-- app-file-attach --')
    // this.referenceFileAttachId = 0
    // console.log('folderId', this.folderId)
    console.log('fileAttachs', this.fileAttachs)
    this.authMenu(this.folderId)

    let ua = window.navigator.userAgent;
    // console.log()
    console.log('ua -', ua)
    console.log(ua.indexOf('Chrome'))
    this.checkIe = false
    let msie = ua.indexOf('MSIE ');
    if (msie > 0) {
      // IE 10 or older => return version number
      let a = parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
      // console.log('a -',a)
      this.checkIe = true
    }

    let trident = ua.indexOf('Trident/');
    if (trident > 0) {
      // IE 11 => return version number
      var rv = ua.indexOf('rv:');
      let a = parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
      this.checkIe = true
    }

    let Chrome = ua.indexOf('Chrome');
    if (Chrome > 0) {
      this.checkChrome = true
    }




  }

  deleteFileAttach(deleteFileAttach: FileAttach) {
    console.log('---- del')


    let dialogRef = this._dialog.open(DeleteDialogComponent, {

    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result) {
        let indexRemovedFile: number = this.fileAttachs.indexOf(deleteFileAttach)
        this.fileAttachs.splice(indexRemovedFile, 1)
        this.fileAttachRemoved.push(deleteFileAttach)

        this._pxService
          .deleteFileAttachs(this.fileAttachRemoved)
          .subscribe(response => {
            this.fileAttachRemoved = []
          })

        if (this.editMode) {
          this.editMode = false
          this.hiddenButton = true
        }

      }
    });






  }

  downloadFile(fileAttach: FileAttach) {
  
    let tmp = new FileAttach(fileAttach)
    // this._pxService
    //   .downloadFileAttach(tmp)

    if (fileAttach.fileAttachType == '.PDF') {
      es6printJS(fileAttach.url, "pdf");
    } else {
      this._pxService
        .downloadFileAttach(tmp)
    }

  }

  view(fileAttach: any ,staus:any) {


    console.log('view att', fileAttach.url)
    console.log('authEditDocFile', this.authEditDocFile)


    if (fileAttach.fileAttachType == '.PDF' || fileAttach.fileAttachType == '.TIF' || fileAttach.fileAttachType == '.TIFF' || fileAttach.fileAttachType == '.JPG' || fileAttach.fileAttachType == '.PNG') {
      // let temp = environment.plugIn
      // console.log('temp url', temp)
      // let auth = 0
      // if (this.authEditDocFile && staus == 1) {
      //   auth = 1
      // }
      // // let url = 'http://192.168.1.8/scan/?'
      // let url = temp + '/scan/?'
      // let mode = 'view'
      // localStorage.setItem('scan', 'uncomplete')
      // window.open(url + "mode=" + mode + "&attachId=" + fileAttach.id + "&auth=" + auth, 'scan', "height=600,width=1000")

      // const timer = TimerObservable.create(3000, 10000);
      // this.subscription = timer.subscribe(t => {
      //   this.tick = '' + t;
      //   console.log(this.tick + ' ' + localStorage.getItem('scan'))
      //   if (localStorage.getItem('scan') == 'complete') {
      //     console.log('scan ---- complete')

      //     this.updateAtt.emit(true)
      //     localStorage.setItem('scan', 'uncomplete')

      //   }

      // });

      this.viewImage(fileAttach)


    } else {

      let temp = environment.plugIn
      console.log('temp url', temp)
      // let url = 'http://localhost:8383/activeX/view.html?'
      let url = temp + '/activeX/view.html?'
      let mode = 'view'
      let fileurl = fileAttach.url
      let fileAttachType = fileAttach.fileAttachType
      localStorage.setItem('activeX', 'uncomplete')
      window.open(url + "mode=" + mode + "&fileAttachType=" + fileAttachType + "&url=" + fileurl, 'scan', "height=500,width=800")
    }
  }

  editFile(fileAttachUpdateData: FileAttach, index: number) {
    console.log('editFileattach', fileAttachUpdateData)
    console.log('index', index)
    this.uploader.queue = []
    this.editMode = true
    this.hiddenButton = true

    this.fileAttachUpdate.push(fileAttachUpdateData)
    this.referenceFileAttachId.emit(fileAttachUpdateData.id)


    // this.file2.nativeElement.click()


  }

  editFile2(fileAttach: FileAttach, staus: number) {

    console.log('fileAttach - ',fileAttach)
    console.log('staus - ',staus)
    console.log('this.authEditDocFile - ',this.authEditDocFile)




    let temp = environment.plugIn
      console.log('temp url', temp)
      let auth = 0
      if (this.authEditDocFile ) {
        auth = 1
      }
      // let url = 'http://192.168.1.8/scan/?'
      let url = temp + '/scan/?'
      let mode = 'view'

      // window.open(url + "mode=" + mode + "&attachId=" + fileAttach.id + "&auth=" + auth, 'scan', "height=600,width=1000")

      this._pxService
      .createEmptyData(fileAttach.linkType, fileAttach.linkId, fileAttach.id)
      .subscribe(res => {
        window.open(url + "mode=" + mode + "&linkType=" + fileAttach.linkType + "&fileAttachName=" + fileAttach.fileAttachName
        + "&secret=" + fileAttach.secrets + "&documentId=" + fileAttach.linkId + "&urlNoName=" + ''
        + "&fileAttachId=" + res.id + "&auth=" + auth + "&attachId=" + fileAttach.id, 'scan', "height=600,width=1000")
        
        if (this._paramSarabanService.ScanSubscription) this._paramSarabanService.ScanSubscription.unsubscribe()
        const timer = TimerObservable.create(5000, 3000)
        this._paramSarabanService.ScanSubscription = timer.subscribe(t => {
          if (t == 60) this._paramSarabanService.ScanSubscription.unsubscribe()
          else {

            this._pxService
              .checkHaveAttach(res.id)
              .subscribe(res2 => {
      
                if (res2.data == 'true') {
                  this._paramSarabanService.ScanSubscription.unsubscribe()
                  this._pxService
                    .getFileAttachs('dms', fileAttach.linkId, 'asc')
                    .subscribe(response => {
                      let temp = response as any[]
                      let tempParent = response as any[]
                      tempParent = tempParent.filter(attarch => attarch.secrets <= this.authDocfileSecrets)
                      let datafileAttach = []
                      for (let i = 0; i < tempParent.length; i++) {
                        if (tempParent[i].referenceId == 0) {
                          tempParent[i].children = []
                          datafileAttach.push(tempParent[i])
                        }
                      }

                      for (let i = 0; i < datafileAttach.length; i++) {
                        let idParent = datafileAttach[i].id
                        for (let j = 0; j < temp.length; j++) {
                          if (idParent == temp[j].referenceId) {
                            datafileAttach[i].children.push(temp[j])
                            idParent = temp[j].id
                            j = -1
                          }

                        }


                      }

                      this.fileAttachs = datafileAttach
                    })
                }
              })

          }
        })

      })

   
 


  }

  addFileAttach(data: any) {
    // console.log('-- addFileAttach --')
    // console.log('--$event', data)
    let temp = this.uploader;
    // console.log('temp', temp.queue[0].file.name)
    this.addAttachFile.emit(temp.queue[0].file.name)
  }

  addByDrop(event) {
    console.log('event -', event)
    console.log('this.uploader -', this.uploader)
    let temp = this.uploader;
    this.addAttachFile.emit(this.uploader)

  }

  updateFileAttach(data: any) {
    console.log('-- updateFileAttach --')

    console.log('this.uploader', this.uploader)
    this.updateAtt.emit(true)
    this.editMode = false
    this.referenceFileAttachId.emit(0)
    this.fileAttachUpdate = []
    this.uploader.queue = []



  }
  updateSecrets(data: FileAttach, secrets: any) {
    // console.log('secrets',secrets)
    // console.log('data',data)
    data.secrets = secrets
    this.UpdateSecrets.emit(data)


  }
  removeTemp() {
    console.log('-- removeTemp --')
    this.editMode = false
    this.referenceFileAttachId.emit(0)
    this.fileAttachUpdate = []
    // this.uploader.queue = []
  }
  removeUpdate() {
    console.log('-- removeUpdate --')
    this.editMode = false
    this.referenceFileAttachId.emit(0)
    this.fileAttachUpdate = []
    this.uploader.queue = []

  }

  updateSecretClassData(data: any) {
    console.log('updateSecretClassData', this.secretClassData)

    this.secrets.emit(this.secretClassData)

  }

  authDocfileSecrets:number=1
  authMenu(folderId: number) {
    this._folderService
      .getMenu(folderId)
      .subscribe(response => {
        // console.log(' - authMenu - ', response)


        for (let i of response.data) {


          if (i.menuFunction == 'creDocFile') { this.authCreDocFile = true }
          if (i.menuFunction == 'editDocFile') { this.authEditDocFile = true }
          if (i.menuFunction == 'delDocFile') { this.authDelDocFile = true }
          if (i.menuFunction == 'sec1Df') { this.authDocfileSecrets = 1 }
          if (i.menuFunction == 'sec2Df') { this.authDocfileSecrets = 2 }
          if (i.menuFunction == 'sec3Df') { this.authDocfileSecrets = 3 }
          if (i.menuFunction == 'sec4Df') { this.authDocfileSecrets = 4 }

        }
      })

  }

  ngAfterViewInit() {
    this.uploader.onAfterAddingFile = (item => {
      this.file.nativeElement.value = ''
    });
  }

  viewImage(fileAttach: any) {
    window.open(this._pxService.getExpiredPath(fileAttach), "_blank", "height=600,width=1000")
  }

}
