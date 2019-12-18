import { Report } from './report.model'

export const REPORTS: Report[] = [
    {
        id: 0,
        name: '',
        url: '',
        parameters: [null, null, null, null, null],//['startDate', 'endDate', 'folderId', 'linkId', 'userId']
        useTempTable: false,
        showInputDialog: false,
        showDir: false
    },
    {
        id: 1,
        name: 'รายงานการรับเอกสารภายในองค์กร',//1-2 :date, folderId //list-saraban
        url: 'saraban_1_2_ORC',
        parameters: [null, null, 'folderId', null, null],
        useTempTable: true,
        showInputDialog: false,
        showDir: true
    },
    {
        id: 2,
        name: 'รายงานการรับเอกสารภายนอกองค์กร',//1-2 :date, folderId //list-saraban
        url: 'saraban_1_2_ORC',
        parameters: [null, null, 'folderId', null, null],
        useTempTable: true,
        showInputDialog: false,
        showDir: true
    },
    {
        id: 3,
        name: 'รายงานการส่งเอกสารภายในองค์กร',//1-2 :date, folderId //list-saraban
        url: 'saraban_1_2_ORC',
        parameters: [null, null, 'folderId', null, null],
        useTempTable: true,
        showInputDialog: false,
        showDir: true
    },
    {
        id: 4,
        name: 'รายงานการส่งเอกสารภายนอกองค์กร',//1-2 :date, folderId //list-saraban
        url: 'saraban_1_2_ORC',
        parameters: [null, null, 'folderId', null, null],
        useTempTable: true,
        showInputDialog: false,
        showDir: true
    },
    {
        id: 5,
        name: 'รายงานผังการไหล',//4 :linkId //saraban
        url: 'saraban_4_ORC',
        parameters: [null, null, null, 'linkId', null],
        useTempTable: false,
        showInputDialog: false,
        showDir: false
    },
    {
        id: 6,
        name: 'รายงานจำนวนหนังสือรับเข้า-ส่งออก',//5 :date //list-folder
        url: 'saraban_5_ORC',
        parameters: ['startDate', 'endDate', 'folderId', null, null],
        useTempTable: true,
        showInputDialog: true,
        showDir: true
    },
    {
        id: 7,
        name: 'รายงานสถิติการดำเนินงานของเจ้าหน้าที่',//6 :date, userId //list-folder
        url: 'saraban_6_ORC',
        parameters: ['startDate', 'endDate', 'folderId', null, 'userId'],
        useTempTable: true,
        showInputDialog: true,
        showDir: true
    },
    {
        id: 8,
        name: 'รายงานสถานะการดำเนินงานหนังสือ-อยู่ระหว่างดำเนินการ',//10 :date, folderId //list-saraban
        url: 'saraban_10_ORC',
        parameters: [null, null, 'folderId', null, null],
        useTempTable: true,
        showInputDialog: false,
        showDir: true
    },
    {
        id: 9,
        name: 'รายงานการคืนเรื่อง',//11 inbox
        url: 'saraban_11_ORC',
        parameters: [null, null, 'sName', 'uOutboxId', 'sOutboxId'],
        useTempTable: false,
        showInputDialog: false,
        showDir: false
    },
    {
        id: 10,
        name: 'รายงานการดึงกลับ',//12 outbox
        url: 'saraban_12_ORC',
        parameters: [null, null, 'sName', null, 'userId'],
        useTempTable: false,
        showInputDialog: false,
        showDir: false
    },
    {
        id: 11,
        name: 'รายงานสถานะการดำเนินงานหนังสือ-เรื่องเสร็จ',//13 :date, folderId //list-saraban
        url: 'saraban_13_ORC',
        parameters: [null, null, 'folderId', null, null],
        useTempTable: true,
        showInputDialog: false,
        showDir: true
    },
    {
        id: 12,
        name: 'รายงานสถานะการดำเนินงานหนังสือ-ยกเลิกเรื่อง',//14 :date, folderId //list-saraban
        url: 'saraban_14_ORC',
        parameters: [null, null, 'folderId', null, null],
        useTempTable: true,
        showInputDialog: false,
        showDir: true
    },
    {
        id: 13,
        name: 'รายงานการรับหนังสือ',//15 :date//inbox
        url: 'saraban_inbox',
        parameters: [null, null, null, null, null],
        useTempTable: true,
        showInputDialog: false,
        showDir: false
    },
    {
        id: 14,
        name: 'รายงานการส่งหนังสือ',//14 :date//outbox
        url: 'saraban_outbox',
        parameters: [null, null, null, null, null],
        useTempTable: true,
        showInputDialog: false,
        showDir: false
    },
    {
        id: 15,
        name: 'บาร์โค้ด',
        url: 'saraban_barcode',
        parameters: [null, null, 'folderId', 'contentId', null],
        useTempTable: false,
        showInputDialog: false,
        showDir: false
    },
    {
        id: 16,
        name: 'รายงานการค้นหาจากเลขไปรษณีย์ลงทะเบียน',
        url: 'saraban_1_2_ORC',
        parameters: ['startDate', 'endDate', null, 'str03', null],
        useTempTable: true,
        showInputDialog: true,
        showDir: true
    }
]