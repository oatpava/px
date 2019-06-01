import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dialog-instruction',
  templateUrl: './dialog-instruction.component.html',
  styleUrls: ['./dialog-instruction.component.styl']
})
export class DialogInstructionComponent implements OnInit {
  images: any[]

  constructor() { }

  ngOnInit() {
    this.images = [];
    this.images.push({source:'assets/instruction/1.jpg', alt:'เลือกทะเบียนหนังสือที่ต้องการ จากนั้นกดที่เมนูค้นหา (แว่นขยาย)', title:'ขั้นตอนที่ 1'});
    this.images.push({source:'assets/instruction/2.jpg', alt:'ใส่เงื่อนไขที่ต้องการค้นหาหนังสือ จากนั้นกดค้นหา', title:'ขั้นตอนที่ 2'});
    this.images.push({source:'assets/instruction/3.jpg', alt:'เลือกประเภทการออกรายงาน จากเมนู (รายงาน PDF/รายงาน Excel)', title:'ขั้นตอนที่ 3'});
    this.images.push({source:'assets/instruction/4.jpg', alt:'เลือกรายงานที่ต้องการจากรายการ', title:'ขั้นตอนที่ 4'});
    this.images.push({source:'assets/instruction/5.jpg', alt:'ถ้ารายงานเปิดไม่ขึ้นให้ดูที่ป๊อปอัป (มุมขวาบนของเบราเซอร์) ว่าโดนบล้อกอยู่หรือไม่', title:'ขั้นตอนที่ 5'});
    this.images.push({source:'assets/instruction/6.jpg', alt:'ถ้าโดนบล้อก ให้ทำตามขั้นตอนดังนี้', title:'ขั้นตอนที่ 6'});
    this.images.push({source:'assets/instruction/7.jpg', alt:'สามารถเปิดดูขั้นตอนการออกรายงานได้จากเมนูในหน้าข้อมูลส่วนตัว', title:'หมายเหตุ'});
  }

}
