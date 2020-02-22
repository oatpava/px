
export const auth: any[] = [
    {
        "structure": {
            "id": 1,
            "structureName": "โครงสร้างหน่วยงาน",
            "structureDetail": null,
            "structureCode": null,
            "parentId": 0,
            "parentKey": "฿1฿",
            "nodeLevel": 0
        },
        "userProfile": {
            "id": 1,
            "userProfileFullName": "คมกริช วงษ์พิมเสน",
            "userProfileFullNameEng": "KOMKRIT WONGPHIMSEN",
            "title": {
                "id": 1,
                "titleName": "นาย",
                "titleNameEng": "Mr."
            },
            "structure": {
                "id": 23,
                "structureName": "กลุ่มตรวจสอบภายใน",
                "structureDetail": null,
                "structureCode": "กตส",
                "parentId": 5,
                "parentKey": "฿1฿5฿23฿",
                "nodeLevel": 2
            },
            "user": {
                "id": 1,
                "userActiveDate": null,
                "userExpireDate": null,
                "userPasswordExpireDate": null,
                "userName": "admin"
            },
            "userProfileStatus": {
                "id": 1,
                "userStatusName": "เปิดการใช้งาน"
            },
            "userProfileType": {
                "id": 1,
                "userProfileTypeName": "ผู้ดูแลระบบ"
            },
            "userProfileTypeSaraban": null,
            "userProfileTypeOrder": {
                "id": 4,
                "userTypeOrderName": "พนักงานทั่วไป"
            },
            "userProfileDataAppointment": null,
            "userProfileDataCivilStart": null,
            "position": {
                "id": 5,
                "positionName": "นักบัญชี",
                "positionNameEng": null,
                "positionNameExtra": null
            },
            "positionType": {
                "id": 14,
                "positionTypeName": "พนักงานราชการ",
                "positionTypeAbbr": "Y0"
            },
            "userProfileFirstName": "คมกริช",
            "userProfileLastName": "วงษ์พิมเสน",
            "userProfilePosition": "ผู้ทดสอบระบบ",
            "userProfileEmail": "kom@test.com",
            "userProfileTel": "916782235",
            "userProfileDefaultSelect": 0,
            "userProfileFirstNameEng": "KOMKRIT",
            "userProfileLastNameEng": "WONGPHIMSEN",
            "userProfilePositionEng": null,
            "userProfileCardId": "1111111111111",
            "userProfileCode": null,
            "userProfileAddress": "161/438 ซ.จรัญสนิทวงศ์ 27 แขวงบางขุนศรี เขตบางกอกน้อย กทม. 10700",
            "digitalKey": null
        },
        "authority": [
            {
                "id": 798,
                "submoduleAuth": {
                    "id": 27,
                    "submodule": {
                        "id": 4,
                        "module": {
                            "id": 3,
                            "moduleCode": "",
                            "moduleName": "ระบบจัดเก็บเอกสาร",
                            "moduleNameEng": "dms",
                            "moduleIcon": "dms.png"
                        },
                        "submoduleCode": "dms",
                        "submoduleName": "จัดเก็บเอกสาร"
                    },
                    "auth": {
                        "id": 27,
                        "authName": "เปิดใช้"
                    },
                    "submoduleAuthCode": "open"
                },
                "linkId": 1,
                "authority": "1"
            },
            {
                "id": 799,
                "submoduleAuth": {
                    "id": 28,
                    "submodule": {
                        "id": 4,
                        "module": {
                            "id": 3,
                            "moduleCode": "",
                            "moduleName": "ระบบจัดเก็บเอกสาร",
                            "moduleNameEng": "dms",
                            "moduleIcon": "dms.png"
                        },
                        "submoduleCode": "dms",
                        "submoduleName": "จัดเก็บเอกสาร"
                    },
                    "auth": {
                        "id": 28,
                        "authName": "สร้างที่เก็บเอกสาร"
                    },
                    "submoduleAuthCode": "create_F"
                },
                "linkId": 1,
                "authority": "1"
            },
            {
                "id": 800,
                "submoduleAuth": {
                    "id": 29,
                    "submodule": {
                        "id": 4,
                        "module": {
                            "id": 3,
                            "moduleCode": "",
                            "moduleName": "ระบบจัดเก็บเอกสาร",
                            "moduleNameEng": "dms",
                            "moduleIcon": "dms.png"
                        },
                        "submoduleCode": "dms",
                        "submoduleName": "จัดเก็บเอกสาร"
                    },
                    "auth": {
                        "id": 29,
                        "authName": "แก้ไขคุณ สมบัติที่เก็บเอกสาร"
                    },
                    "submoduleAuthCode": "edit_F"
                },
                "linkId": 1,
                "authority": "1"
            },
            {
                "id": 801,
                "submoduleAuth": {
                    "id": 30,
                    "submodule": {
                        "id": 4,
                        "module": {
                            "id": 3,
                            "moduleCode": "",
                            "moduleName": "ระบบจัดเก็บเอกสาร",
                            "moduleNameEng": "dms",
                            "moduleIcon": "dms.png"
                        },
                        "submoduleCode": "dms",
                        "submoduleName": "จัดเก็บเอกสาร"
                    },
                    "auth": {
                        "id": 30,
                        "authName": "ทำลายที่เก็บเอกสาร"
                    },
                    "submoduleAuthCode": "del_F"
                },
                "linkId": 1,
                "authority": "1"
            },
            {
                "id": 802,
                "submoduleAuth": {
                    "id": 31,
                    "submodule": {
                        "id": 4,
                        "module": {
                            "id": 3,
                            "moduleCode": "",
                            "moduleName": "ระบบจัดเก็บเอกสาร",
                            "moduleNameEng": "dms",
                            "moduleIcon": "dms.png"
                        },
                        "submoduleCode": "dms",
                        "submoduleName": "จัดเก็บเอกสาร"
                    },
                    "auth": {
                        "id": 31,
                        "authName": "สร้างเอกสาร"
                    },
                    "submoduleAuthCode": "create_D"
                },
                "linkId": 1,
                "authority": "1"
            },
            {
                "id": 803,
                "submoduleAuth": {
                    "id": 32,
                    "submodule": {
                        "id": 4,
                        "module": {
                            "id": 3,
                            "moduleCode": "",
                            "moduleName": "ระบบจัดเก็บเอกสาร",
                            "moduleNameEng": "dms",
                            "moduleIcon": "dms.png"
                        },
                        "submoduleCode": "dms",
                        "submoduleName": "จัดเก็บเอกสาร"
                    },
                    "auth": {
                        "id": 32,
                        "authName": "แก้ไขคุณ สมบัติ เอกสาร"
                    },
                    "submoduleAuthCode": "edit_P_D"
                },
                "linkId": 1,
                "authority": "1"
            },
            {
                "id": 804,
                "submoduleAuth": {
                    "id": 33,
                    "submodule": {
                        "id": 4,
                        "module": {
                            "id": 3,
                            "moduleCode": "",
                            "moduleName": "ระบบจัดเก็บเอกสาร",
                            "moduleNameEng": "dms",
                            "moduleIcon": "dms.png"
                        },
                        "submoduleCode": "dms",
                        "submoduleName": "จัดเก็บเอกสาร"
                    },
                    "auth": {
                        "id": 33,
                        "authName": "แก้ไขเอกสาร"
                    },
                    "submoduleAuthCode": "edit_D"
                },
                "linkId": 1,
                "authority": "1"
            },
            {
                "id": 805,
                "submoduleAuth": {
                    "id": 34,
                    "submodule": {
                        "id": 4,
                        "module": {
                            "id": 3,
                            "moduleCode": "",
                            "moduleName": "ระบบจัดเก็บเอกสาร",
                            "moduleNameEng": "dms",
                            "moduleIcon": "dms.png"
                        },
                        "submoduleCode": "dms",
                        "submoduleName": "จัดเก็บเอกสาร"
                    },
                    "auth": {
                        "id": 34,
                        "authName": "ลบเอกสาร"
                    },
                    "submoduleAuthCode": "del_D"
                },
                "linkId": 1,
                "authority": "1"
            },
            {
                "id": 806,
                "submoduleAuth": {
                    "id": 35,
                    "submodule": {
                        "id": 4,
                        "module": {
                            "id": 3,
                            "moduleCode": "",
                            "moduleName": "ระบบจัดเก็บเอกสาร",
                            "moduleNameEng": "dms",
                            "moduleIcon": "dms.png"
                        },
                        "submoduleCode": "dms",
                        "submoduleName": "จัดเก็บเอกสาร"
                    },
                    "auth": {
                        "id": 35,
                        "authName": "บันทึกออกภายนอก"
                    },
                    "submoduleAuthCode": ""
                },
                "linkId": 1,
                "authority": "1"
            },
            {
                "id": 807,
                "submoduleAuth": {
                    "id": 36,
                    "submodule": {
                        "id": 4,
                        "module": {
                            "id": 3,
                            "moduleCode": "",
                            "moduleName": "ระบบจัดเก็บเอกสาร",
                            "moduleNameEng": "dms",
                            "moduleIcon": "dms.png"
                        },
                        "submoduleCode": "dms",
                        "submoduleName": "จัดเก็บเอกสาร"
                    },
                    "auth": {
                        "id": 36,
                        "authName": "พิมพ์ลายน้ำ"
                    },
                    "submoduleAuthCode": ""
                },
                "linkId": 1,
                "authority": "1"
            },
            {
                "id": 808,
                "submoduleAuth": {
                    "id": 37,
                    "submodule": {
                        "id": 4,
                        "module": {
                            "id": 3,
                            "moduleCode": "",
                            "moduleName": "ระบบจัดเก็บเอกสาร",
                            "moduleNameEng": "dms",
                            "moduleIcon": "dms.png"
                        },
                        "submoduleCode": "dms",
                        "submoduleName": "จัดเก็บเอกสาร"
                    },
                    "auth": {
                        "id": 37,
                        "authName": "ส่งจดหมายอิเล็คทรอนิกส์ "
                    },
                    "submoduleAuthCode": "sendEmail"
                },
                "linkId": 1,
                "authority": "1"
            },
            {
                "id": 809,
                "submoduleAuth": {
                    "id": 38,
                    "submodule": {
                        "id": 4,
                        "module": {
                            "id": 3,
                            "moduleCode": "",
                            "moduleName": "ระบบจัดเก็บเอกสาร",
                            "moduleNameEng": "dms",
                            "moduleIcon": "dms.png"
                        },
                        "submoduleCode": "dms",
                        "submoduleName": "จัดเก็บเอกสาร"
                    },
                    "auth": {
                        "id": 38,
                        "authName": "ส่งแฟกซ์ "
                    },
                    "submoduleAuthCode": ""
                },
                "linkId": 1,
                "authority": "1"
            },
            {
                "id": 810,
                "submoduleAuth": {
                    "id": 39,
                    "submodule": {
                        "id": 4,
                        "module": {
                            "id": 3,
                            "moduleCode": "",
                            "moduleName": "ระบบจัดเก็บเอกสาร",
                            "moduleNameEng": "dms",
                            "moduleIcon": "dms.png"
                        },
                        "submoduleCode": "dms",
                        "submoduleName": "จัดเก็บเอกสาร"
                    },
                    "auth": {
                        "id": 39,
                        "authName": "เรียกดู ANNO TATION"
                    },
                    "submoduleAuthCode": ""
                },
                "linkId": 1,
                "authority": "1"
            },
            {
                "id": 811,
                "submoduleAuth": {
                    "id": 40,
                    "submodule": {
                        "id": 4,
                        "module": {
                            "id": 3,
                            "moduleCode": "",
                            "moduleName": "ระบบจัดเก็บเอกสาร",
                            "moduleNameEng": "dms",
                            "moduleIcon": "dms.png"
                        },
                        "submoduleCode": "dms",
                        "submoduleName": "จัดเก็บเอกสาร"
                    },
                    "auth": {
                        "id": 40,
                        "authName": "กู้คืนเอกสาร"
                    },
                    "submoduleAuthCode": ""
                },
                "linkId": 1,
                "authority": "1"
            },
            {
                "id": 812,
                "submoduleAuth": {
                    "id": 41,
                    "submodule": {
                        "id": 4,
                        "module": {
                            "id": 3,
                            "moduleCode": "",
                            "moduleName": "ระบบจัดเก็บเอกสาร",
                            "moduleNameEng": "dms",
                            "moduleIcon": "dms.png"
                        },
                        "submoduleCode": "dms",
                        "submoduleName": "จัดเก็บเอกสาร"
                    },
                    "auth": {
                        "id": 41,
                        "authName": "ทำลายเอกสาร จากถังขยะ"
                    },
                    "submoduleAuthCode": ""
                },
                "linkId": 1,
                "authority": "1"
            },
            {
                "id": 813,
                "submoduleAuth": {
                    "id": 42,
                    "submodule": {
                        "id": 4,
                        "module": {
                            "id": 3,
                            "moduleCode": "",
                            "moduleName": "ระบบจัดเก็บเอกสาร",
                            "moduleNameEng": "dms",
                            "moduleIcon": "dms.png"
                        },
                        "submoduleCode": "dms",
                        "submoduleName": "จัดเก็บเอกสาร"
                    },
                    "auth": {
                        "id": 42,
                        "authName": "สิทธิ์เอกสาร (ปกติ)"
                    },
                    "submoduleAuthCode": ""
                },
                "linkId": 1,
                "authority": "1"
            },
            {
                "id": 814,
                "submoduleAuth": {
                    "id": 43,
                    "submodule": {
                        "id": 4,
                        "module": {
                            "id": 3,
                            "moduleCode": "",
                            "moduleName": "ระบบจัดเก็บเอกสาร",
                            "moduleNameEng": "dms",
                            "moduleIcon": "dms.png"
                        },
                        "submoduleCode": "dms",
                        "submoduleName": "จัดเก็บเอกสาร"
                    },
                    "auth": {
                        "id": 43,
                        "authName": "สิทธิ์เอกสาร (ลับ)"
                    },
                    "submoduleAuthCode": ""
                },
                "linkId": 1,
                "authority": "1"
            },
            {
                "id": 815,
                "submoduleAuth": {
                    "id": 44,
                    "submodule": {
                        "id": 4,
                        "module": {
                            "id": 3,
                            "moduleCode": "",
                            "moduleName": "ระบบจัดเก็บเอกสาร",
                            "moduleNameEng": "dms",
                            "moduleIcon": "dms.png"
                        },
                        "submoduleCode": "dms",
                        "submoduleName": "จัดเก็บเอกสาร"
                    },
                    "auth": {
                        "id": 44,
                        "authName": "สิทธิ์เอกสาร (ลับมาก)"
                    },
                    "submoduleAuthCode": ""
                },
                "linkId": 1,
                "authority": "1"
            },
            {
                "id": 816,
                "submoduleAuth": {
                    "id": 45,
                    "submodule": {
                        "id": 4,
                        "module": {
                            "id": 3,
                            "moduleCode": "",
                            "moduleName": "ระบบจัดเก็บเอกสาร",
                            "moduleNameEng": "dms",
                            "moduleIcon": "dms.png"
                        },
                        "submoduleCode": "dms",
                        "submoduleName": "จัดเก็บเอกสาร"
                    },
                    "auth": {
                        "id": 45,
                        "authName": "สิทธิ์เอกสารแนบ (ปกติ)"
                    },
                    "submoduleAuthCode": ""
                },
                "linkId": 1,
                "authority": "1"
            },
            {
                "id": 817,
                "submoduleAuth": {
                    "id": 46,
                    "submodule": {
                        "id": 4,
                        "module": {
                            "id": 3,
                            "moduleCode": "",
                            "moduleName": "ระบบจัดเก็บเอกสาร",
                            "moduleNameEng": "dms",
                            "moduleIcon": "dms.png"
                        },
                        "submoduleCode": "dms",
                        "submoduleName": "จัดเก็บเอกสาร"
                    },
                    "auth": {
                        "id": 46,
                        "authName": "สิทธิ์เอกสารแนบ (ลับ)"
                    },
                    "submoduleAuthCode": ""
                },
                "linkId": 1,
                "authority": "1"
            },
            {
                "id": 818,
                "submoduleAuth": {
                    "id": 47,
                    "submodule": {
                        "id": 4,
                        "module": {
                            "id": 3,
                            "moduleCode": "",
                            "moduleName": "ระบบจัดเก็บเอกสาร",
                            "moduleNameEng": "dms",
                            "moduleIcon": "dms.png"
                        },
                        "submoduleCode": "dms",
                        "submoduleName": "จัดเก็บเอกสาร"
                    },
                    "auth": {
                        "id": 47,
                        "authName": "สิทธิ์เอกสารแนบ (ลับมาก)"
                    },
                    "submoduleAuthCode": ""
                },
                "linkId": 1,
                "authority": "1"
            },
            {
                "id": 819,
                "submoduleAuth": {
                    "id": 48,
                    "submodule": {
                        "id": 4,
                        "module": {
                            "id": 3,
                            "moduleCode": "",
                            "moduleName": "ระบบจัดเก็บเอกสาร",
                            "moduleNameEng": "dms",
                            "moduleIcon": "dms.png"
                        },
                        "submoduleCode": "dms",
                        "submoduleName": "จัดเก็บเอกสาร"
                    },
                    "auth": {
                        "id": 48,
                        "authName": "สิทธิ์เอกสารแนบ (ลับที่สุด)"
                    },
                    "submoduleAuthCode": ""
                },
                "linkId": 1,
                "authority": "1"
            },
            {
                "id": -1,
                "submoduleAuth": {
                    "id": 57,
                    "submodule": {
                        "id": 4,
                        "module": {
                            "id": 3,
                            "moduleCode": "",
                            "moduleName": "ระบบจัดเก็บเอกสาร",
                            "moduleNameEng": "dms",
                            "moduleIcon": "dms.png"
                        },
                        "submoduleCode": "dms",
                        "submoduleName": "จัดเก็บเอกสาร"
                    },
                    "auth": {
                        "id": 57,
                        "authName": "พิมพ์"
                    },
                    "submoduleAuthCode": ""
                },
                "linkId": 1,
                "authority": "2"
            }
        ]
    }
    ]


export const auth2: any[] = [
    {
        "structure": {
            "id": 1,
            "structureName": "โครงสร้างหน่วยงาน",
            "structureDetail": null,
            "structureCode": null,
            "parentId": 0,
            "parentKey": "฿1฿",
            "nodeLevel": 0
        },
        "userProfile": {
            "id": 1,
            "userProfileFullName": "คมกริช วงษ์พิมเสน",
            "userProfileFullNameEng": "KOMKRIT WONGPHIMSEN",
            "title": {
                "id": 1,
                "titleName": "นาย",
                "titleNameEng": "Mr."
            },
            "structure": {
                "id": 23,
                "structureName": "กลุ่มตรวจสอบภายใน",
                "structureDetail": null,
                "structureCode": "กตส",
                "parentId": 5,
                "parentKey": "฿1฿5฿23฿",
                "nodeLevel": 2
            },
            "user": {
                "id": 1,
                "userActiveDate": null,
                "userExpireDate": null,
                "userPasswordExpireDate": null,
                "userName": "admin"
            },
            "userProfileStatus": {
                "id": 1,
                "userStatusName": "เปิดการใช้งาน"
            },
            "userProfileType": {
                "id": 1,
                "userProfileTypeName": "ผู้ดูแลระบบ"
            },
            "userProfileTypeSaraban": null,
            "userProfileTypeOrder": {
                "id": 4,
                "userTypeOrderName": "พนักงานทั่วไป"
            },
            "userProfileDataAppointment": null,
            "userProfileDataCivilStart": null,
            "position": {
                "id": 5,
                "positionName": "นักบัญชี",
                "positionNameEng": null,
                "positionNameExtra": null
            },
            "positionType": {
                "id": 14,
                "positionTypeName": "พนักงานราชการ",
                "positionTypeAbbr": "Y0"
            },
            "userProfileFirstName": "คมกริช",
            "userProfileLastName": "วงษ์พิมเสน",
            "userProfilePosition": "ผู้ทดสอบระบบ",
            "userProfileEmail": "kom@test.com",
            "userProfileTel": "916782235",
            "userProfileDefaultSelect": 0,
            "userProfileFirstNameEng": "KOMKRIT",
            "userProfileLastNameEng": "WONGPHIMSEN",
            "userProfilePositionEng": null,
            "userProfileCardId": "1111111111111",
            "userProfileCode": null,
            "userProfileAddress": "161/438 ซ.จรัญสนิทวงศ์ 27 แขวงบางขุนศรี เขตบางกอกน้อย กทม. 10700",
            "digitalKey": null
        },
        "authority": [
            {
                "id": 798,
                "submoduleAuth": {
                    "id": 27,
                    "submodule": {
                        "id": 4,
                        "module": {
                            "id": 3,
                            "moduleCode": "",
                            "moduleName": "ระบบจัดเก็บเอกสาร",
                            "moduleNameEng": "dms",
                            "moduleIcon": "dms.png"
                        },
                        "submoduleCode": "dms",
                        "submoduleName": "จัดเก็บเอกสาร"
                    },
                    "auth": {
                        "id": 27,
                        "authName": "เปิดใช้"
                    },
                    "submoduleAuthCode": "open"
                },
                "linkId": 1,
                "authority": "2"
            },
            {
                "id": 799,
                "submoduleAuth": {
                    "id": 28,
                    "submodule": {
                        "id": 4,
                        "module": {
                            "id": 3,
                            "moduleCode": "",
                            "moduleName": "ระบบจัดเก็บเอกสาร",
                            "moduleNameEng": "dms",
                            "moduleIcon": "dms.png"
                        },
                        "submoduleCode": "dms",
                        "submoduleName": "จัดเก็บเอกสาร"
                    },
                    "auth": {
                        "id": 28,
                        "authName": "สร้างที่เก็บเอกสาร"
                    },
                    "submoduleAuthCode": "create_F"
                },
                "linkId": 1,
                "authority": "1"
            },
            {
                "id": 800,
                "submoduleAuth": {
                    "id": 29,
                    "submodule": {
                        "id": 4,
                        "module": {
                            "id": 3,
                            "moduleCode": "",
                            "moduleName": "ระบบจัดเก็บเอกสาร",
                            "moduleNameEng": "dms",
                            "moduleIcon": "dms.png"
                        },
                        "submoduleCode": "dms",
                        "submoduleName": "จัดเก็บเอกสาร"
                    },
                    "auth": {
                        "id": 29,
                        "authName": "แก้ไขคุณ สมบัติที่เก็บเอกสาร"
                    },
                    "submoduleAuthCode": "edit_F"
                },
                "linkId": 1,
                "authority": "1"
            },
            {
                "id": 801,
                "submoduleAuth": {
                    "id": 30,
                    "submodule": {
                        "id": 4,
                        "module": {
                            "id": 3,
                            "moduleCode": "",
                            "moduleName": "ระบบจัดเก็บเอกสาร",
                            "moduleNameEng": "dms",
                            "moduleIcon": "dms.png"
                        },
                        "submoduleCode": "dms",
                        "submoduleName": "จัดเก็บเอกสาร"
                    },
                    "auth": {
                        "id": 30,
                        "authName": "ทำลายที่เก็บเอกสาร"
                    },
                    "submoduleAuthCode": "del_F"
                },
                "linkId": 1,
                "authority": "1"
            },
            {
                "id": 802,
                "submoduleAuth": {
                    "id": 31,
                    "submodule": {
                        "id": 4,
                        "module": {
                            "id": 3,
                            "moduleCode": "",
                            "moduleName": "ระบบจัดเก็บเอกสาร",
                            "moduleNameEng": "dms",
                            "moduleIcon": "dms.png"
                        },
                        "submoduleCode": "dms",
                        "submoduleName": "จัดเก็บเอกสาร"
                    },
                    "auth": {
                        "id": 31,
                        "authName": "สร้างเอกสาร"
                    },
                    "submoduleAuthCode": "create_D"
                },
                "linkId": 1,
                "authority": "1"
            },
            {
                "id": 803,
                "submoduleAuth": {
                    "id": 32,
                    "submodule": {
                        "id": 4,
                        "module": {
                            "id": 3,
                            "moduleCode": "",
                            "moduleName": "ระบบจัดเก็บเอกสาร",
                            "moduleNameEng": "dms",
                            "moduleIcon": "dms.png"
                        },
                        "submoduleCode": "dms",
                        "submoduleName": "จัดเก็บเอกสาร"
                    },
                    "auth": {
                        "id": 32,
                        "authName": "แก้ไขคุณ สมบัติ เอกสาร"
                    },
                    "submoduleAuthCode": "edit_P_D"
                },
                "linkId": 1,
                "authority": "1"
            },
            {
                "id": 804,
                "submoduleAuth": {
                    "id": 33,
                    "submodule": {
                        "id": 4,
                        "module": {
                            "id": 3,
                            "moduleCode": "",
                            "moduleName": "ระบบจัดเก็บเอกสาร",
                            "moduleNameEng": "dms",
                            "moduleIcon": "dms.png"
                        },
                        "submoduleCode": "dms",
                        "submoduleName": "จัดเก็บเอกสาร"
                    },
                    "auth": {
                        "id": 33,
                        "authName": "แก้ไขเอกสาร"
                    },
                    "submoduleAuthCode": "edit_D"
                },
                "linkId": 1,
                "authority": "1"
            },
            {
                "id": 805,
                "submoduleAuth": {
                    "id": 34,
                    "submodule": {
                        "id": 4,
                        "module": {
                            "id": 3,
                            "moduleCode": "",
                            "moduleName": "ระบบจัดเก็บเอกสาร",
                            "moduleNameEng": "dms",
                            "moduleIcon": "dms.png"
                        },
                        "submoduleCode": "dms",
                        "submoduleName": "จัดเก็บเอกสาร"
                    },
                    "auth": {
                        "id": 34,
                        "authName": "ลบเอกสาร"
                    },
                    "submoduleAuthCode": "del_D"
                },
                "linkId": 1,
                "authority": "1"
            },
            {
                "id": 806,
                "submoduleAuth": {
                    "id": 35,
                    "submodule": {
                        "id": 4,
                        "module": {
                            "id": 3,
                            "moduleCode": "",
                            "moduleName": "ระบบจัดเก็บเอกสาร",
                            "moduleNameEng": "dms",
                            "moduleIcon": "dms.png"
                        },
                        "submoduleCode": "dms",
                        "submoduleName": "จัดเก็บเอกสาร"
                    },
                    "auth": {
                        "id": 35,
                        "authName": "บันทึกออกภายนอก"
                    },
                    "submoduleAuthCode": ""
                },
                "linkId": 1,
                "authority": "1"
            },
            {
                "id": 807,
                "submoduleAuth": {
                    "id": 36,
                    "submodule": {
                        "id": 4,
                        "module": {
                            "id": 3,
                            "moduleCode": "",
                            "moduleName": "ระบบจัดเก็บเอกสาร",
                            "moduleNameEng": "dms",
                            "moduleIcon": "dms.png"
                        },
                        "submoduleCode": "dms",
                        "submoduleName": "จัดเก็บเอกสาร"
                    },
                    "auth": {
                        "id": 36,
                        "authName": "พิมพ์ลายน้ำ"
                    },
                    "submoduleAuthCode": ""
                },
                "linkId": 1,
                "authority": "1"
            },
            {
                "id": 808,
                "submoduleAuth": {
                    "id": 37,
                    "submodule": {
                        "id": 4,
                        "module": {
                            "id": 3,
                            "moduleCode": "",
                            "moduleName": "ระบบจัดเก็บเอกสาร",
                            "moduleNameEng": "dms",
                            "moduleIcon": "dms.png"
                        },
                        "submoduleCode": "dms",
                        "submoduleName": "จัดเก็บเอกสาร"
                    },
                    "auth": {
                        "id": 37,
                        "authName": "ส่งจดหมายอิเล็คทรอนิกส์ "
                    },
                    "submoduleAuthCode": "sendEmail"
                },
                "linkId": 1,
                "authority": "1"
            },
            {
                "id": 809,
                "submoduleAuth": {
                    "id": 38,
                    "submodule": {
                        "id": 4,
                        "module": {
                            "id": 3,
                            "moduleCode": "",
                            "moduleName": "ระบบจัดเก็บเอกสาร",
                            "moduleNameEng": "dms",
                            "moduleIcon": "dms.png"
                        },
                        "submoduleCode": "dms",
                        "submoduleName": "จัดเก็บเอกสาร"
                    },
                    "auth": {
                        "id": 38,
                        "authName": "ส่งแฟกซ์ "
                    },
                    "submoduleAuthCode": ""
                },
                "linkId": 1,
                "authority": "1"
            },
            {
                "id": 810,
                "submoduleAuth": {
                    "id": 39,
                    "submodule": {
                        "id": 4,
                        "module": {
                            "id": 3,
                            "moduleCode": "",
                            "moduleName": "ระบบจัดเก็บเอกสาร",
                            "moduleNameEng": "dms",
                            "moduleIcon": "dms.png"
                        },
                        "submoduleCode": "dms",
                        "submoduleName": "จัดเก็บเอกสาร"
                    },
                    "auth": {
                        "id": 39,
                        "authName": "เรียกดู ANNO TATION"
                    },
                    "submoduleAuthCode": ""
                },
                "linkId": 1,
                "authority": "1"
            },
            {
                "id": 811,
                "submoduleAuth": {
                    "id": 40,
                    "submodule": {
                        "id": 4,
                        "module": {
                            "id": 3,
                            "moduleCode": "",
                            "moduleName": "ระบบจัดเก็บเอกสาร",
                            "moduleNameEng": "dms",
                            "moduleIcon": "dms.png"
                        },
                        "submoduleCode": "dms",
                        "submoduleName": "จัดเก็บเอกสาร"
                    },
                    "auth": {
                        "id": 40,
                        "authName": "กู้คืนเอกสาร"
                    },
                    "submoduleAuthCode": ""
                },
                "linkId": 1,
                "authority": "1"
            },
            {
                "id": 812,
                "submoduleAuth": {
                    "id": 41,
                    "submodule": {
                        "id": 4,
                        "module": {
                            "id": 3,
                            "moduleCode": "",
                            "moduleName": "ระบบจัดเก็บเอกสาร",
                            "moduleNameEng": "dms",
                            "moduleIcon": "dms.png"
                        },
                        "submoduleCode": "dms",
                        "submoduleName": "จัดเก็บเอกสาร"
                    },
                    "auth": {
                        "id": 41,
                        "authName": "ทำลายเอกสาร จากถังขยะ"
                    },
                    "submoduleAuthCode": ""
                },
                "linkId": 1,
                "authority": "1"
            },
            {
                "id": 813,
                "submoduleAuth": {
                    "id": 42,
                    "submodule": {
                        "id": 4,
                        "module": {
                            "id": 3,
                            "moduleCode": "",
                            "moduleName": "ระบบจัดเก็บเอกสาร",
                            "moduleNameEng": "dms",
                            "moduleIcon": "dms.png"
                        },
                        "submoduleCode": "dms",
                        "submoduleName": "จัดเก็บเอกสาร"
                    },
                    "auth": {
                        "id": 42,
                        "authName": "สิทธิ์เอกสาร (ปกติ)"
                    },
                    "submoduleAuthCode": ""
                },
                "linkId": 1,
                "authority": "1"
            },
            {
                "id": 814,
                "submoduleAuth": {
                    "id": 43,
                    "submodule": {
                        "id": 4,
                        "module": {
                            "id": 3,
                            "moduleCode": "",
                            "moduleName": "ระบบจัดเก็บเอกสาร",
                            "moduleNameEng": "dms",
                            "moduleIcon": "dms.png"
                        },
                        "submoduleCode": "dms",
                        "submoduleName": "จัดเก็บเอกสาร"
                    },
                    "auth": {
                        "id": 43,
                        "authName": "สิทธิ์เอกสาร (ลับ)"
                    },
                    "submoduleAuthCode": ""
                },
                "linkId": 1,
                "authority": "1"
            },
            {
                "id": 815,
                "submoduleAuth": {
                    "id": 44,
                    "submodule": {
                        "id": 4,
                        "module": {
                            "id": 3,
                            "moduleCode": "",
                            "moduleName": "ระบบจัดเก็บเอกสาร",
                            "moduleNameEng": "dms",
                            "moduleIcon": "dms.png"
                        },
                        "submoduleCode": "dms",
                        "submoduleName": "จัดเก็บเอกสาร"
                    },
                    "auth": {
                        "id": 44,
                        "authName": "สิทธิ์เอกสาร (ลับมาก)"
                    },
                    "submoduleAuthCode": ""
                },
                "linkId": 1,
                "authority": "1"
            },
            {
                "id": 816,
                "submoduleAuth": {
                    "id": 45,
                    "submodule": {
                        "id": 4,
                        "module": {
                            "id": 3,
                            "moduleCode": "",
                            "moduleName": "ระบบจัดเก็บเอกสาร",
                            "moduleNameEng": "dms",
                            "moduleIcon": "dms.png"
                        },
                        "submoduleCode": "dms",
                        "submoduleName": "จัดเก็บเอกสาร"
                    },
                    "auth": {
                        "id": 45,
                        "authName": "สิทธิ์เอกสารแนบ (ปกติ)"
                    },
                    "submoduleAuthCode": ""
                },
                "linkId": 1,
                "authority": "1"
            },
            {
                "id": 817,
                "submoduleAuth": {
                    "id": 46,
                    "submodule": {
                        "id": 4,
                        "module": {
                            "id": 3,
                            "moduleCode": "",
                            "moduleName": "ระบบจัดเก็บเอกสาร",
                            "moduleNameEng": "dms",
                            "moduleIcon": "dms.png"
                        },
                        "submoduleCode": "dms",
                        "submoduleName": "จัดเก็บเอกสาร"
                    },
                    "auth": {
                        "id": 46,
                        "authName": "สิทธิ์เอกสารแนบ (ลับ)"
                    },
                    "submoduleAuthCode": ""
                },
                "linkId": 1,
                "authority": "1"
            },
            {
                "id": 818,
                "submoduleAuth": {
                    "id": 47,
                    "submodule": {
                        "id": 4,
                        "module": {
                            "id": 3,
                            "moduleCode": "",
                            "moduleName": "ระบบจัดเก็บเอกสาร",
                            "moduleNameEng": "dms",
                            "moduleIcon": "dms.png"
                        },
                        "submoduleCode": "dms",
                        "submoduleName": "จัดเก็บเอกสาร"
                    },
                    "auth": {
                        "id": 47,
                        "authName": "สิทธิ์เอกสารแนบ (ลับมาก)"
                    },
                    "submoduleAuthCode": ""
                },
                "linkId": 1,
                "authority": "1"
            },
            {
                "id": 819,
                "submoduleAuth": {
                    "id": 48,
                    "submodule": {
                        "id": 4,
                        "module": {
                            "id": 3,
                            "moduleCode": "",
                            "moduleName": "ระบบจัดเก็บเอกสาร",
                            "moduleNameEng": "dms",
                            "moduleIcon": "dms.png"
                        },
                        "submoduleCode": "dms",
                        "submoduleName": "จัดเก็บเอกสาร"
                    },
                    "auth": {
                        "id": 48,
                        "authName": "สิทธิ์เอกสารแนบ (ลับที่สุด)"
                    },
                    "submoduleAuthCode": ""
                },
                "linkId": 1,
                "authority": "1"
            },
            {
                "id": -1,
                "submoduleAuth": {
                    "id": 57,
                    "submodule": {
                        "id": 4,
                        "module": {
                            "id": 3,
                            "moduleCode": "",
                            "moduleName": "ระบบจัดเก็บเอกสาร",
                            "moduleNameEng": "dms",
                            "moduleIcon": "dms.png"
                        },
                        "submoduleCode": "dms",
                        "submoduleName": "จัดเก็บเอกสาร"
                    },
                    "auth": {
                        "id": 57,
                        "authName": "พิมพ์"
                    },
                    "submoduleAuthCode": ""
                },
                "linkId": 1,
                "authority": "2"
            }
        ]
    }
    ]



