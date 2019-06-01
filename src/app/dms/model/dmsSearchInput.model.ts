export class DmsSearchInPut {
     version: number
     form:Object[]
     fetchSource:Array<string>
     order:string
     from:number
     size:number
     defaultSymbolForSpace:string
     symbolAnd:string
     symbolOr:string
     symbolNot:string
     symbolWith:string
     preHighlightTag:string
     postHighlightTag:string

     constructor(data:any) {
        this.version = 1
        this.form = [{
            documentName: data.documentName,
            createdBy:data.createdBy,
            createdDateForm:data.createdDateForm,
            createdDateTo:data.createdDateTo,
            updatedDateForm:data.updatedDateForm,
            updatedDateTo:data.updatedDateTo,
            updatedBy:data.updatedBy,
       
            documentExpireDateForm:data.documentExpireDateForm,
            documentExpireDateTo:data.documentExpireDateTo,
       
            documentDate01Form:data.documentDate01Form,
            documentDate01To:data.documentDate01To,
            documentDate02Form:data.documentDate02Form,
            documentDate02To:data.documentDate02To,
            documentDate03Form:data.documentDate03Form,
            documentDate03To:data.documentDate03To,
            documentDate04Form:data.documentDate04Form,
            documentDate04To:data.documentDate04To,
            documentFolderId:data.folderId,
            documentFloat01:data.documentFloat01,
            documentFloat02:data.documentFloat02,
            documentVarchar01:data.documentVarchar01,
            documentVarchar02:data.documentVarchar02,
            documentVarchar03:data.documentVarchar03,
            documentVarchar04:data.documentVarchar04,
            documentVarchar05:data.documentVarchar05,
            documentVarchar06:data.documentVarchar06,
            documentVarchar07:data.documentVarchar07,
            documentVarchar08:data.documentVarchar08,
            documentVarchar09:data.documentVarchar09,
            documentVarchar10:data.documentVarchar10,
            documentText01:data.documentText01,
            documentText02:data.documentText02,
            documentText03:data.documentText03,
            documentText04:data.documentText04,
            documentText05:data.documentText05,
            documentInt01:data.documentInt01,
            documentInt02:data.documentInt02,
            documentInt03:data.documentInt03,
            documentInt04:data.documentInt04,
            dmsDocumentIntComma:data.documentIntComma,
            allField:data.allField,
            fileAttachName:data.fileAttachName,
            fullText:data.fullText,
            


        }]
        this.fetchSource=[
            'createName',
            'updateName',
            'documentInt01',
            'documentInt02',
            'documentInt03',
            'documentInt04',
            'dmsDocumentIntComma',
            'documentText01',
            'documentText02',
            'documentText03',
            'documentText04',
            'documentText05',
            'documentVarchar01',
            'documentVarchar02',
            'documentVarchar03',
            'documentVarchar04',
            'documentVarchar05',
            'documentVarchar06',
            'documentVarchar07',
            'documentVarchar08',
            'documentVarchar09',
            'documentVarchar10',
            'documentFloat01',
            'documentFloat02',
            'documentFolderId',
            'documentName',
            'documentTypeId',
            'id',
            'createdDate',
            // 'documentExpireDate',

            'updatedDate',
            // 'documentPublicDate',

            'documentExpireDate',
            'documentDate01',
            'documentDate02',
            'documentDate03',
            'documentDate04',
            'isExp',
            'wfTypeId',
            'fullPathName',
            ]
        this.order = 'asc'
        this.from =0
        this.size = 10000
        this.defaultSymbolForSpace='.หรือ.'
        this.symbolAnd = '.และ.'
        this.symbolOr = '.หรือ.'
        this.symbolNot = '.ไม่.'
        this.symbolWith = '.ตามด้วย.'
        this.preHighlightTag = '<mark>'
        this.postHighlightTag = '</mark>'

     }


}
