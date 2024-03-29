import { Setting } from './setting.model'

export const SETTINGS: Setting[] = [
  {
    id: 1,
    moduleId: 7,
    name: 'ทั่วไป',
    type: '',
    subSetting: '',
    iconModule: 'account_balance',
    child: [
      {
        childId: 45,//1,
        childName: 'รายชื่อบุคลากร',
        childIcon: 'person_add',
        subSetting: 'user-profile'
      },
      {
        childId: 46,//17,
        childName: 'หน่วยงานภายนอก',
        childIcon: 'people',
        subSetting: 'outing'
      },
      {
        childId: 47,//2,
        childName: 'ประวัติการทำงาน',
        childIcon: 'history',
        subSetting: 'history-log'
      },
      {
        childId: 48,//10,
        childName: 'ตั้งค่าระบบ',
        childIcon: 'settings_system',
        subSetting: 'setting-param'
      },
      {
        childId: 49,//5,
        childName: 'ตั้งค่าการค้นหา',
        childIcon: 'search',
        subSetting: 'search-setting'
      },
      // {
      //   childId: 6,
      //   childName: 'นำเข้า HRIS (หน่วยงาน)',
      //   childIcon: 'supervisor_account',
      //   subSetting: 'hrs-structure'
      // },
      // {
      //   childId: 7,
      //   childName: 'นำเข้า HRIS (รายชื่อบุคลากร)',
      //   childIcon: 'supervisor_account',
      //   subSetting: 'hrs-user'
      // }   
    ]
  }
  , {
    id: 2,
    moduleId: 1,
    name: 'ระบบจัดเก็บเอกสาร',
    type: 'DMS',
    subSetting: '',
    iconModule: 'dashboard',
    child: [
      {
        childId: 1,
        childName: 'การจัดการประเภทเอกสาร',
        childIcon: 'text_fields',
        subSetting: 'document-type'
      },
      {
        childId: 2,
        childName: 'รายการสิทธิ์แฟ้มทะเบียน',
        childIcon: 'dns',
        subSetting: 'dms-auth'
      },
      {
        childId: 3,
        childName: 'รายการสิทธิ์ผู้ใช้แฟ้มทะเบียน',
        childIcon: 'reorder',
        subSetting: 'dms-user-auth'
      }
    ]
  }
  , {
    id: 4,
    moduleId: 4,
    name: 'ระบบสารบรรณ',
    type: 'WF',
    subSetting: '',
    iconModule: 'class',
    child: [
      {
        childId: 56,//0,
        childName: 'กำหนดรูปแบบสิทธิ์แฟ้มทะเบียน',
        childIcon: 'folder_shared',
        subSetting: 'auth-template'
      },
      {
        childId: 51,//1,
        childName: 'กำหนดแฟ้มทะเบียนให้เจ้าหน้าที่',
        // childIcon: 'assignment_ind',
        childIcon: 'turned_in',
        subSetting: 'folder-auth'
      },
      {
        childId: 52,//2,
        childName: 'กำหนดสิทธิ์หนังสือเข้า',
        childIcon: 'lock_outline',
        subSetting: 'setting-permission-input-structure'
      },
      {
        childId: 53,//5,
        childName: 'ประเภทการส่ง',
        childIcon: 'list',
        subSetting: 'list-type'
      },
      {
        childId: 54,//6,
        childName: 'รายการสิทธิ์แฟ้มทะเบียน',
        childIcon: 'dns',
        subSetting: 'wf-auth'
      },
      {
        childId: 55,//7,
        childName: 'รายการสิทธิ์ผู้ใช้แฟ้มทะเบียน',
        childIcon: 'reorder',
        subSetting: 'wf-user-auth'
      }
    ]
  }

]

