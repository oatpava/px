import { Component, Input, Output, EventEmitter } from '@angular/core'
import { ListReturn } from '../model/listReturn.model'

@Component({
    selector: 'loadMore',
    template: `
        <div style="text-align: center;">
            <span>จำนวน [ {{listReturn.count}}/{{listReturn.all}} รายการ ]</span>
            <button *ngIf="listReturn.next>0" (click)="loadMoreContents()" title="ดึงรายการเพิ่ม"><i class="fa fa-plus"></i></button>
        </div>
    `,
    styles: [``]
})
export class LoadMoreComponent {
    @Input() listReturn: ListReturn
    @Output() load = new EventEmitter()

    loadMoreContents() {
        this.load.emit()
    }
}