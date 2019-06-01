import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core'
import { AutoComplete } from 'primeng/primeng'
import { TdLoadingService } from '@covalent/core'

import { SarabanContentService } from '../service/saraban-content.service'
import { SarabanContentFilter } from '../model/SarabanContentFilter.model'

@Component({
    selector: 'barcode',
    template: `
        <div hide show-gt-md layout="row" style="margin-left:auto; margin-right:1rem; align-items: center; height:40px;">
            <span style="margin-right:1rem;">บาร์โค้ด</span>
            <p-autoComplete #acBarcode [multiple]="true" [(ngModel)]="barcodeFilter" (completeMethod)="xxx($event)" (onUnselect)="reset()" placeholder="" [minLength]="3" (onFocus)="checkMultiple()"></p-autoComplete>
        </div>
    `,
    styles: [``],
    providers: [SarabanContentService]
})
export class BarcodeComponent {
    @ViewChild('acBarcode') acBarcode: AutoComplete
    @Input() barcodeFilter: string[]
    @Output() search = new EventEmitter()
    @Output() onUnselect = new EventEmitter()

    constructor(
        private _loadingService: TdLoadingService,
        private _sarabanContentService: SarabanContentService
    ) {
    }

    searchBarcode(event) {
        this.search.emit(event.query)
        this.checkInput()
    }

    checkInput() {
        let barcodeFilter = this.acBarcode.domHandler.findSingle(this.acBarcode.el.nativeElement, 'input')
        //this.barcodeFilter.push(barcodeFilter.value)
        barcodeFilter.value = ''
        barcodeFilter.blur()
    }

    reset() {
        this.onUnselect.emit()
    }

    checkMultiple() {
        if (this.barcodeFilter.length > 0) {
            this.barcodeFilter.splice(0, 1)
            this.reset()
        }
    }

    xxx(event) {
        this.reset()
        let tmp = event.query.split("-")
        if (tmp.length == 3) {
            this._loadingService.register('main')
            this._sarabanContentService
                .search(new SarabanContentFilter({
                    wfContentContentYear: tmp[0],
                    wfContentFolderId: tmp[1],
                    wfContentStartContentNo: tmp[2],
                    wfContentEndContentNo: tmp[2]
                }))
                .subscribe(response => {
                    this._loadingService.resolve('main')
                    this.barcodeFilter[0] = response[0].wfContentBookNo
                    this.search.emit(response[0].wfContentBookNo)
                })
        } else {
            this.search.emit(false)
        }
        this.checkInput()
    }
}