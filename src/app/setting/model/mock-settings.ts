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
        subSetting: 'user-profile',
      },
      {
        childId: 46,//17,
        childName: 'หน่วยงานภายนอก',
        childIcon: 'people',
        subSetting: 'outing',
      },
      {
        childId: 47,//2,
        childName: 'ประวัติการทำงาน',
        childIcon: 'history',
        subSetting: 'history-log',
      },
      // {
      //   childId: 3,
      //   childName: 'วันหยุด',
      //   childIcon: 'directions_bike',
      //   subSetting: 'holiday',
      // },
      // {
      //   childId: 4,
      //   childName: 'ข้อมูลตัวเลือก',
      //   childIcon: 'local_library',
      //   subSetting: 'lookup',
      // },
      {
        childId: 48,//10,
        childName: 'ตั้งค่าระบบ',
        childIcon: 'settings_system',
        subSetting: 'setting-param',
      },
      {
        childId: 49,//5,
        childName: 'ตั้งค่าการค้นหา',
        childIcon: 'search',
        subSetting: 'search-setting',
      },
      {
        childId: 50,//11,
        childName: 'กำหนดสิทธิ์ให้ผู้ดูแลระบบ',
        childIcon: 'donut_small',
        subSetting: 'auth-admin',
      },
      // {
      //   childId: 6,
      //   childName: 'นำเข้า HRIS (หน่วยงาน)',
      //   childIcon: 'supervisor_account',
      //   subSetting: 'hrs-structure',
      // },
      // {
      //   childId: 7,
      //   childName: 'นำเข้า HRIS (รายชื่อบุคลากร)',
      //   childIcon: 'supervisor_account',
      //   subSetting: 'hrs-user',
      // },
      // {
      //   childId: 8,
      //   childName: 'ปรับปรุง (หน่วยงาน)',
      //   childIcon: 'thumbs_up_down',
      //   subSetting: 'up-structure',
      // },
      // {
      //   childId: 9,
      //   childName: 'ปรับปรุง (รายชื่อบุคลากร)',
      //   childIcon: 'thumbs_up_down',
      //   subSetting: 'up-user',
      // },      
    ]
  }
  ,{
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
        subSetting: 'document-type',
      }, 
      // {
      //   childId: 2,
      //   childName: 'รายการสิทธิ์แฟ้มทะเบียน',
      //   childIcon: 'dns',
      //   subSetting: 'dms-auth',
      // }, 
      // {
      //   childId: 3,
      //   childName: 'รายการสิทธิ์ผู้ใช้แฟ้มทะเบียน',
      //   childIcon: 'reorder',
      //   subSetting: 'dms-user-auth',
      // }, 

      // {
      //   childId: 6,
      //   childName: 'ประเภทเอกสาร',
      //   childIcon: 'list',
      //   subSetting: 'list-document-type',
      // },
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
      // {
      //   childId: 56,//0,
      //   childName: 'กำหนดรูปแบบสิทธิ์แฟ้มทะเบียน',
      //   childIcon: 'folder_shared',
      //   subSetting: 'saraban-folder-group-auth',
      // },
      {
        childId: 51,//1,
        childName: 'กำหนดแฟ้มทะเบียนให้เจ้าหน้าที่',
        // childIcon: 'assignment_ind',
        childIcon: 'turned_in',
        subSetting: 'folder-auth',
      },
      {
        childId: 52,//2,
        childName: 'กำหนดสิทธิ์หนังสือเข้า',
        childIcon: 'lock_outline',
        subSetting: 'setting-permission-input-structure',
      },
      // {
      //   childId: 3,
      //   childName: 'ปรับปรุงรายชื่อหน่วยงาน',
      //   childIcon: 'lock_outline',
      //   subSetting: 'department',
      // },
      // {
      //   childId: 4,
      //   childName: 'ปรับปรุงรายชื่อผู้ใช้งาน',
      //   childIcon: 'lock_outline',
      //   subSetting: 'user-list',
      // }
      {
        childId: 53,//5,
        childName: 'ประเภทการส่ง',
        childIcon: 'list',
        subSetting: 'list-type',
      },
      // {
      //   childId: 54,//6,
      //   childName: 'รายการสิทธิ์แฟ้มทะเบียน',
      //   childIcon: 'dns',
      //   subSetting: 'wf-auth',
      // },
      // {
      //   childId: 55,//7,
      //   childName: 'รายการสิทธิ์ผู้ใช้แฟ้มทะเบียน',
      //   childIcon: 'reorder',
      //   subSetting: 'wf-user-auth',
      // },
    ]

  }
  // ,{
  //   id: 3,
  //   moduleId: 3,
  //   name: 'ระบบ Workflow',
  //   type: '',
  //   subSetting: '',
  //   iconModule: 'praxticol',
  //   child: [ 
  //     {
  //       childId: 1,
  //       childName: 'Setting Project',
  //       childIcon: 'view_compact',
  //       subSetting: 'settingProject',
  //     },{
  //       childId: 2,
  //       childName: 'Setting Flow',
  //       childIcon: 'view_comfy',
  //       subSetting: 'settingFlow',
  //     },{
  //       childId: 3,
  //       childName: 'Setting Process',
  //       childIcon: 'view_list',
  //       subSetting: 'settingProcess',
  //     },{
  //       childId: 4,
  //       childName: 'Setting Role',
  //       childIcon: 'group_add',
  //       subSetting: 'settingRole',
  //     }
  //   ]

  // }
]

