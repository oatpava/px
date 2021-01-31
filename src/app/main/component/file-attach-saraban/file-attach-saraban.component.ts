import { Component, OnInit, Input, Directive, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core'
import { FormControl } from '@angular/forms'
import { PxService } from '../../../main/px.service'

import { FileUploader, FileSelectDirective } from 'ng2-file-upload'
import * as FileSaver from 'file-saver'
import * as es6printJS from "print-js";

import { MdDialog } from '@angular/material'

import { FileAttach } from '../../../main/model/file-attach.model'
import { environment } from '../../../../environments/environment'

import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component'
import { DialogWarningComponent } from '../../../saraban/component/add-saraban-content/dialog-warning/dialog-warning.component'
import { TimerObservable } from 'rxjs/observable/TimerObservable'

import { ParamSarabanService } from '../../../saraban/service/param-saraban.service'
import { DialogViewImageComponent } from './dialog-view-image/dialog-view-image.component'

@Component({
  selector: 'app-file-attach-saraban',
  templateUrl: './file-attach-saraban.component.html',
  styleUrls: ['./file-attach-saraban.component.styl']
})
export class FileAttachSarabanComponent implements OnInit {
  @ViewChild('file') uploaderRef: ElementRef
  //@ViewChild('file2') uploaderUpdateRef: ElementRef
  @Input() fileAttachs: any[]
  @Input() fileAttachRemoved: any[]
  @Input() uploader: FileUploader   //added FileAttach
  @Input() secret: number[]//added FileAttach.secrets
  @Input() type: string[]//added FileAttach type_tmp
  @Input() editMode: boolean
  @Input() uploaderUpdate: FileUploader
  //@Input() fileAttachUpdate: any[]
  //@Input() userId: number
  @Input() auth: boolean[]//[open, s1, s2, s3, s4]
  @Input() viewOnly: boolean//default = false, noauth[0]/from MWP/Archive = true
  @Input() uploaderUpdateIndex: number

  @Output() addFileAttach = new EventEmitter()
  @Output() editFileAttach = new EventEmitter()
  @Output() uploadFileAttach = new EventEmitter()
  @Output() editFileAttachView = new EventEmitter()

  hasBaseDropZoneOver: boolean = false
  hoverEdit: number = -1
  secretClass: any[] = [
    { label: 'ปกติ', value: 1 },
    { label: 'ลับ', value: 2 },
    { label: 'ลับมาก', value: 3 },
    { label: 'ลับที่สุด', value: 4 }
  ]
  allowedMimeType: any = [
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

  ];
  // auth: { label: string, auth: boolean }[] = [
  //   { label: 'dl', auth: true },
  //   { label: 's1', auth: true },
  //   { label: 's2', auth: true },
  //   { label: 's3', auth: true },
  //   { label: 's4', auth: true },
  //   { label: 'cre', auth: true },
  //   { label: 'edt', auth: true },
  //   { label: 'del', auth: true }
  // ]
  //viewWindow

  constructor(
    private _pxService: PxService,
    private _dialog: MdDialog,
    private _paramSarabanService: ParamSarabanService
  ) {
  }

  ngOnInit() {
  }

  fileOverBase(event) {
    this.hasBaseDropZoneOver = event
  }

  add() {
    let last: number = this.uploader.queue.length - 1
    //console.log("addFile", this.uploader.queue[last].file)
    let name: string = this.uploader.queue[last].file.name
    let typePos: number = name.lastIndexOf(".")
    //name = name.substr(name.lastIndexOf("."))
    //console.log("type", name)
    //console.log("addFile", this.uploader)
    this.secret.push(1)
    this.type.push(name.substr(typePos))
    this.uploader.queue[last].file.name = name.substr(0, typePos)
    this.addFileAttach.emit(true)
    //console.log(this.type[last])
  }

  addByDrop(event) {
    let num: number = this.uploader.queue.length - event.length
    //console.log(event.length)//cant use foreach
    for (let i = 0; i < event.length; i++) {
      let index: number = num + i
      let name: string = this.uploader.queue[index].file.name
      let typePos: number = name.lastIndexOf(".")
      this.secret.push(1)
      this.type.push(name.substr(typePos))
      this.uploader.queue[index].file.name = name.substr(0, typePos)
    }
    this.addFileAttach.emit(true)
  }

  selectSecret(value: number, index: number) {
    //console.log('selectSecret at ' + index + ' : ' + this.secretClass[value-1].label)
    //this.secret[index] = value
  }

  remove(index: number) {
    //console.log('removeFromQueue', this.uploader.queue[index])
    this.secret.splice(index, 1)//remove secret
    this.type.splice(index, 1)
    this.uploader.queue[index].remove()
    if (index == 0) this.addFileAttach.emit(false)//no added file left
  }

  view(fileAttach: any) {
    let temp = environment.plugIn
    let url = temp + '/scan/?'
    let mode = 'view'
    let auth = (this.viewOnly) ? 0 : (fileAttach.owner) ? 1 : 0
    localStorage.setItem('scan', 'uncomplete')

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
                  this.editFileAttachView.emit()
                }
              })
          }
        })
      })

  }

  download(fileAttach: FileAttach) {
    let tmp = new FileAttach(fileAttach)
    if (fileAttach.fileAttachType == '.PDF') {
      es6printJS(fileAttach.url, "pdf");
    } else {
      this._pxService
        .downloadFileAttach(tmp)
    }
  }

  delete(fileAttach: any) {
    //console.log('deleteFileAttach')
    // if (this.userId != fileAttach.createdBy) {
    //   let dialogRef = this._dialog.open(DialogWarningComponent)
    //   dialogRef.componentInstance.header = "แจ้งเตือน"
    //   dialogRef.componentInstance.message = "ไม่สามารถลบ เนื่องจากคุณไม่ใช่ผู้รับผิดชอบของเอกสารแนบดังกล่าว"
    //   dialogRef.componentInstance.confirmation = false
    // } else {
    let dialogRef = this._dialog.open(DeleteDialogComponent)
    // let dialogRef = this._dialog.open(DialogWarningComponent)
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let indexRemovedFile: number = this.fileAttachs.indexOf(fileAttach)

        this.fileAttachs.splice(indexRemovedFile, 1)
        this.fileAttachRemoved.push(fileAttach)
        this.editFileAttach.emit(-1)//for reload FileAttach
      }
    })
    //}
  }

  edit(fileAttach: any, index: number) {
    //console.log('editFileattach', this.fileAttachUpdate[index])
    if (!this.fileAttachs[index].uploaded) this.fileAttachs[index].edited = true
    this.editFileAttach.emit(0)
    //console.log('uploadFileattach', this.fileAttachUpdate[index])
  }

  update(fileAttach: any, index: number) {
    //console.log("uploadderUpdateIndex", this.uploaderUpdateIndex)
    //console.log("uploadderUpdate ", this.uploaderUpdate.queue[this.uploaderUpdateIndex].file)
    let last: number = this.uploaderUpdate.queue.length - 1
    let name: string = this.uploaderUpdate.queue[last].file.name
    let typePos: number = name.lastIndexOf(".")
    let uploadedFileAttach = new FileAttach(
      {
        //fileAttachName: this.uploaderUpdate.queue[last].file.name,
        fileAttachName: name.substr(0, typePos),
        linkType: 'dms',
        linkId: fileAttach.linkId,
        referenceId: fileAttach.id,
        secrets: fileAttach.secrets
      })
    this.fileAttachs[index] = uploadedFileAttach
    this.fileAttachs[index].type = name.substr(typePos)
    this.fileAttachs[index].uploaded = true
    this.fileAttachs[index].uploadIndex = this.uploaderUpdateIndex
    this.editFileAttach.emit(1)
    this.uploadFileAttach.emit()
    //console.log('uploadFileattach', this.fileAttachs[index])

  }

  ngAfterViewInit() {
    this.uploader.onAfterAddingFile = (item => {
      this.uploaderRef.nativeElement.value = ''
    });
    // this.uploaderUpdate.onAfterAddingFile = (item => {
    //   this.uploaderUpdateRef.nativeElement.value = ''
    // });
  }

  cellColor_secret(secret: number) {
    switch (secret) {
      case (1): return null
      case (2): return { 'color': 'red' }
      case (3): return { 'color': 'red' }
      case (4): return { 'color': 'red' }
      default: return null
    }
  }

  viewImage(fileAttach: any) {
    window.open(fileAttach.url, "_blank", "height=600,width=1000")
  }

  // viewImage(fileAttach: any) {
  //   let dialogRef = this._dialog.open(DialogViewImageComponent, {
  //     width: '90%', height: '90%'
  //   })
  //   dialogRef.componentInstance.type = fileAttach.type
  //   dialogRef.componentInstance.url = fileAttach.url
  //   dialogRef.componentInstance.trimmedName = fileAttach.trimmedName
  // }

//   viewImage(fileAttach: any) {
//     // console.log(encodeURIComponent(fileAttach.url))
//     // console.log(decodeURIComponent(fileAttach.url))

//     // window.location.href = fileAttach.url
//     //window.open(fileAttach.url, "_blank", "height=600,width=1000")
//     //window.open(fileAttach.url,'','toolbar=no,height=600,width=1000')
//     // window.open(fileAttach.url,'winname','directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=400,height=350');
//     // this._pxService
//     //     .viewFileAttach(fileAttach)
//     // window.open(fileAttach.url, 'xxxx','directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=720,height=800')



//     // this.onURLinserted(fileAttach.url +'/?api_key=praXis')
//     //let url = encodeURIComponent(fileAttach.url)
// ////http://127.0.0.1:8080/document/Temp/dms/EXT45/45127.PDF
//     /////http://127.0.0.1:8080/document/Temp/dms/EXT45/45126.PNG
//     // let dialogRef = this._dialog.open(DeleteDialogComponent)
//     // dialogRef.componentInstance.img = fileAttach.url



//     //   this._pxService.downloadPDF(fileAttach.url).subscribe(response => {
//     //         let dialogRef = this._dialog.open(DeleteDialogComponent)
//     // dialogRef.componentInstance.img = response
//     //   })
//     //   window.addEventListener('unload', function(event) {
//     //     console.log('Navigation occuring');
//     // });
//     // let newWin = window.open(fileAttach.url, "_blank", "height=600,width=1000")
//     // newWin.onload = function () {
//     //   console.log('on load')
//     //   newWin.addEventListener('click', function (event) {
//     //     this.console.log('sss', event)
//     //   })
//     // }
//     // newWin.onclick = function () {
//     //   console.log('on click')
//     // }
//     // this.viewWindow = window.open(fileAttach.url, "_blank", "height=600,width=1000")
//     // // this.viewWindow.document.addEventListener('click', function (event) {
//     // //        this.console.log('sss', event)
//     // // })
//     // this.viewWindow.onload = function() {
//     //   setTimeout(function(){ 
//     //     let tmp = this.viewWindow.document.documentElement.outerHTML
//     //     console.log(tmp) 
//     //         let dialogRef = this._dialog.open(DeleteDialogComponent)
//     // dialogRef.componentInstance.img = tmp
//     // this.viewWindow.close()
//     //   }, 2000);
//     // }
//     // console.log(this.viewWindow.document.documentElement)
//     // console.log(this.viewWindow.document.documentElement.innerHTML)
//     // console.log(this.viewWindow.document.documentElement.outerHTML)


//     // let tmp = this.viewWindow.document.documentElement.innerHTML
//     // let dialogRef = this._dialog.open(DeleteDialogComponent)
//     // dialogRef.componentInstance.img = tmp
//     // this.viewWindow.close()
//     let dialogRef = this._dialog.open(DialogViewImageComponent, {
//       width: '90%', height: '90%'
//     })
//     dialogRef.componentInstance.type = fileAttach.type
//     dialogRef.componentInstance.url = fileAttach.url
//     dialogRef.componentInstance.trimmedName = fileAttach.trimmedName
//   }

//   // onURLinserted(myURL) {
//   //   this.getImage(myURL).subscribe(data => {
//   //     this.createImageFromBlob(data);
//   //   }, error => {
//   //     console.log("Error occured",error);
//   //   });
//   // }

//   // getImage(imageUrl: string): Observable<any> {
//   //   let headers={ responseType: ResponseContentType.Blob }
//   //   return this.http
//   //       .get(imageUrl, headers)
//   //       .map(res => res.blob());
//   // }

//   // createImageFromBlob(image: Blob) {
//   // let imageToShow
//   //  let reader = new FileReader(); //you need file reader for read blob data to base64 image data.
//   //  reader.addEventListener("load", () => {
//   //     imageToShow = reader.result; // here is the result you got from reader
//   //     let dialogRef = this._dialog.open(DeleteDialogComponent)
//   //     dialogRef.componentInstance.img = imageToShow
//   //  }, false);

//   //  if (image) {
//   //     reader.readAsDataURL(image);
//   //  }
//   // }
//   ///////

}





