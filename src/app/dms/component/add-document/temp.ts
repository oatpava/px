// uploadFile(linkId: number, linkType: string) {
//     console.log('--- uploadFile ---')
//     // console.log(this.uploader)


//     let fileAttachDetail = new FileAttach({
//       linkType: 'dms',
//       linkId: linkId

//     })

//     for (let i = 0; i < this.uploader.queue.length; i++) {
//       this._documentService.createAdocument(160)
//         .subscribe(response => {
//           let dataDoc = response as Document
//           let docId = dataDoc.id
//           // console.log('idDoc = ',dataDoc)
          
//           this._documentService.updateAdocument(docId ,this.uploader.queue[i].file.name,1,2,'001.006','TOR')
//           .subscribe(response => {
//             console.log('-- update --')
//           })

//           let uploaderTemp: FileUploader = new FileUploader({})
//           uploaderTemp.queue[0] = this.uploader.queue[i]
//           console.log('-- uploaderTemp --', uploaderTemp)
//           fileAttachDetail.linkType = 'dms'
//           fileAttachDetail.linkId = docId

          
//           return this._pxService.uploadFileAttach(this.uploader, fileAttachDetail)

//         })
//     }

//   }