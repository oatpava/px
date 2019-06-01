import { Directive, ElementRef, Input, Renderer, OnChanges, SimpleChanges } from '@angular/core'

@Directive({
    selector: '[ImagePreview]'
})
export class ImagePreviewDirective {

    @Input('myImage') image: any
    @Input('uploaded') uploaded: boolean
    constructor(
        private el: ElementRef,
        private renderer: Renderer
    ) {

    }

    ngOnChanges(changes: SimpleChanges) {
        //console.log(this.image)
        let reader = new FileReader()
        let el = this.el
        reader.onloadend = function (e) {
            el.nativeElement.src = reader.result
        }
        if (this.uploaded == false) {
            if (this.image) {
                if (this.image.type === 'image/jpeg' || this.image.type === 'image/png' || this.image.type === 'image/svg+xml') {
                    return reader.readAsDataURL(this.image)
                } else if (this.image.type === 'application/msword' || this.image.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                    el.nativeElement.src = 'assets/icons/icon-word.svg'
                    return
                } else if (this.image.type === 'application/vnd.ms-excel' || this.image.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
                    el.nativeElement.src = 'assets/icons/icon-excel.svg'
                    return
                } else if (this.image.type === 'application/vnd.ms-powerpoint' || this.image.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
                    el.nativeElement.src = 'assets/icons/icon-powerpoint.svg'
                    return
                } else if (this.image.type === 'text/plain') {
                    el.nativeElement.src = 'assets/icons/icon-text.svg'
                    return
                } else if (this.image.type === 'application/pdf') {
                    el.nativeElement.src = 'assets/icons/icon-pdf.svg'
                    return
                } else if (this.image.type === 'image/tiff') {
                    el.nativeElement.src = 'assets/icons/icon-tif.svg'
                    return
                } else {
                    el.nativeElement.src = 'assets/icons/icon-unknown.svg'
                }
            }
        } else {
            if (this.image === '.jpg' || this.image === '.jpeg' || this.image === '.png' || this.image === '.svg') {
                el.nativeElement.src = 'assets/icons/icon-image.svg'
                return
            } else if (this.image === '.doc' || this.image === '.docx' || this.image === '.rtf') {
                el.nativeElement.src = 'assets/icons/icon-word.svg'
                return
            } else if (this.image === '.xls' || this.image === '.xlsx') {
                el.nativeElement.src = 'assets/icons/icon-excel.svg'
                return
            } else if (this.image === '.ppt' || this.image === '.pptx') {
                el.nativeElement.src = 'assets/icons/icon-powerpoint.svg'
                return
            } else if (this.image === '.txt') {
                el.nativeElement.src = 'assets/icons/icon-text.svg'
                return
            } else if (this.image === '.pdf') {
                el.nativeElement.src = 'assets/icons/icon-pdf.svg'
                return
            } else if (this.image === '.tif' || this.image === '.tiff') {
                el.nativeElement.src = 'assets/icons/icon-tif.svg'
                return
            } else {
                el.nativeElement.src = 'assets/icons/icon-unknown.svg'
            }
        }
    }

}
