import { Document} from './document.model'

export class Borrow {
    id: number
    userLentId: number
    lendDate: any
    userReturnId: number
    returnDate: any 
    retuenDateNum: number
    //dmsDocument: Document
    dmsDocument: {
        id: number
        documentName: string
    }
    userHandlerId: number
    userProfileReturn: {
        id: number
        fullName: string
    }
    userProfileLent: {
        id: number
        fullName: string
    }
    userProfileHandler: {
        id: number
        fullName: string
    }
    
    statusId: number
    returnName: string
    lendName: string

    toReturnDate: any
}

// "id": 6,
//       "userLentId": 1,
//       "lendDate": "10/08/2560 11:22:21",
//       "userReturnId": 0,
//       "retuenDate": "",
//       "retuenDateNum": 1,
//       "dmsDocument": {
//         "id": 5,
//         "createdDate": "09/08/2560 13:22:27",
//         "createdBy": 1,
//         "removedDate": "",
//         "removedBy": 0,
//         "updatedDate": "",
//         "updatedBy": 0,
//         "documentPublicDate": "",
//         "documentExpireDate": "",
//         "dmsDocumentPreExpireDate": null,
//         "documentDate01": "",
//         "documentDate02": "",
//         "documentDate03": "",
//         "documentDate04": "",
//         "documentTypeId": 2,
//         "documentName": "ฟกฟกฟกฟก",
//         "documentPublicStatus": null,
//         "documentFolderId": 6,
//         "documentFloat01": 0,
//         "documentFloat02": 0,
//         "documentVarchar01": null,
//         "documentVarchar02": null,
//         "documentVarchar03": null,
//         "documentVarchar04": null,
//         "documentVarchar05": null,
//         "documentVarchar06": null,
//         "documentVarchar07": null,
//         "documentVarchar08": null,
//         "documentVarchar09": null,
//         "documentVarchar10": null,
//         "documentText01": null,
//         "documentText02": null,
//         "documentText03": null,
//         "documentText04": null,
//         "documentText05": null,
//         "documentText06": null,
//         "documentText07": null,
//         "documentText08": null,
//         "documentText09": null,
//         "documentText10": null,
//         "documentText11": null,
//         "documentText12": null,
//         "documentText13": null,
//         "documentText14": null,
//         "documentText15": null,
//         "documentInt01": 0,
//         "documentInt02": 0,
//         "documentInt03": 0,
//         "documentInt04": 0,
//         "dmsDocumentIntComma": 0,
//         "documentInt06": 0,
//         "dmsDocumentSec": 0,
//         "expType": null,
//         "expNumber": 0,
//         "userProfileCreate": null,
//         "userProfileUpdate": null,
//         "userProfileDel": null,
//         "isExp": null,
//         "wfTypeId": 0,
//         "flowId": 0,
//         "resolutions": null,
//         "voice1": 0,
//         "voice2": 0
//       },
//       "userHandlerId": 1,
//       "userProfileReturn": null,
//       "userProfileLent": null,
//       "userProfileHandler": null,
//       "statusId": 1
//     }