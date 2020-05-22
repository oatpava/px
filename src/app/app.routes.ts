import { Routes, RouterModule } from '@angular/router'
import { AuthGuard } from './main/auth-guard.service'

import {
    LoginComponent,
    MainComponent,
    FolderComponent,
    SettingComponent,
    ListFolderComponent,
    AddFolderComponent,
    UserProfileComponent,
    ListDocumentComponent,
    AddDocumentComponent,
    MwpComponent,
    InboxComponent,
    OutboxComponent,
    RecycleBinComponent,
    ListMwpComponent,
    HistoryLogComponent,
    AddUserProfileComponent,
    HolidayComponent,
    HolidayAddComponent,
    LookupComponent,
    EditLookupComponent,
    SarabanComponent,
    ListSarabanFolderComponent,
    AddSarabanFolderComponent,
    DeleteDialogComponent,
    DmsDocumentTypeComponent,
    DmsDocumentTypeDetailComponent,
    ListSarabanContentComponent,
    AddSarabanContentComponent,
    SendSarabanContentComponent,
    SendEmailComponent,
    FinishSarabanContentComponent,
    RegisterSarabanContentComponent,
    EmailComponent,
    ListReserveSarabanContentComponent,
    ReserveSarabanContentComponent,
    ReserveSarabanContentCancelComponent,
    AuthComponent,
    SearchAllComponent,
    SearchComponent,
    StructureComponent,
    KeepSarabanContentComponent,
    SarabanFileAttachComponent,
    UserComponent,
    AuthSarabanContentComponent,
    ViewDocumentComponent,
    ReportSarabanComponent,
    ReportComponent,
    ListContentComponent,
    AssignContentComponent,
    PermissionInputComponent,
    ListStructureComponent,
    AssignContentStructureComponent,
    ListDepartmentComponent,
    DetailDepartmentComponent,
    ListUserComponent,
    DetailUserComponent,
    ListTypeComponent,
    EditTypeComponent,
    ListContentPermissionInputComponent,
    ListStructurePermissionInputComponent,
    PermissionInputStructureComponent,
    PermissionInputUpdateComponent,
    DialogWarningComponent,
    ForgotPasswordComponent,
    FolderAuthComponent,
    InboxAuthComponent,
    DialogWorkflowTextComponent,
    DialogWorkflowComponent,
    DialogListReserveComponent,
    ReOrderComponent,
    ListUserDmsComponent,
    DialogGropUserComponent,
    GropComponent,
    ErrorPasswordComponent,
    ListBorrowComponent,
    BorrowDetailComponent,
    BorrowComponent,
    ListDocumentTypeComponent,
    EditDocumentTypeComponent,
    AddStructureComponent,
    ListDocByDoctypeComponent,
    ListFolderByDoctypeComponent,
    DialogListWfTypeComponent,
    ListFolderAndDocComponent,
    ListFolderAndDocumentComponent,
    DialogListFolderComponent,
    ListBorrowAllComponent,
    DialogMoveComponent,
    ParamSarabanComponent,
    ChangePasswordComponent,
    AlertMessageComponent,
    DialogReportOptionComponent,
    MoveProfileComponent,
    MoveStructureComponent,
    OrderStructureComponent,
    SettingDefultProfileComponent,
    SettingSearchComponent,
    MergeStructureComponent,
    MergeUserComponent,
    PrivateGroupComponent,
    AddPrivateGroupComponent,
    DialogCancelSendComponent,
    LockUserComponent,
    HrsComponent,
    HrsUserComponent,
    ListMergeStructureComponent,
    ListMergeUsersComponent,
    ReportLogComponent,
    ListHisttoryUserComponent,
    ConfirmDialogComponent,
    OrganizeExternalComponent,
    OrganizeComponent,
    AddOrganizeComponent,
    ListDocExpComponent,
    MyWorkComponent,
    AddMyWorkComponent,
    UpdatePasswordComponent,
    DialogSearchOutsiderComponent,
    ParamComponent,
    DialogParamComponent,
    DmsFolderAuthComponent,
    WfFolderAuthComponent,
    DmsFolderUserAuthComponent,
    WfFolderUserAuthComponent,
    DialogInstructionComponent,
    DialogSettingSearchFilterComponent,
    CircularNoticeComponent,
    DialogCircularNoticeComponent,
    ListCircularNoticeComponent,
    AddCircularNoticeComponent,
    AuthAdminComponent,
    DialogViewComponent,
    DialogMoveFolderComponent,
    DialogRecordComponent,
    StatusEcmsComponent,
    CheckStatusEcmsComponent,
    SendEcmsComponent,
    ReceiveEcmsComponent,
    FileEcmsComponent,
    ListMenuEcmsComponent,
    DialogsShowThEGifComponent,
    SarabanFolderGroupAuthComponent
} from './shared'

const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'load', component: ParamSarabanComponent },
    { path: 'changePassword', component: UpdatePasswordComponent },
    {
        path: 'main', component: MainComponent,
        children: [
            { path: 'DialogInstruction', component: DialogInstructionComponent },
            {
                path: 'mwps', component: MwpComponent, outlet: 'center',
                children: [
                    { path: '', component: ListMwpComponent, outlet: 'contentCenter' },
                    { path: 'inbox', component: InboxComponent, outlet: 'contentCenter' },
                    { path: 'outbox', component: OutboxComponent, outlet: 'contentCenter' },
                    { path: 'recycleBin', component: RecycleBinComponent, outlet: 'contentCenter' },
                    { path: 'toSaraban', component: ListSarabanContentComponent, outlet: 'contentCenter' },
                    { path: 'addContent', component: AddSarabanContentComponent, outlet: 'contentCenter' },
                    { path: 'addContent_s', component: AddSarabanContentComponent, outlet: 'contentCenter' },
                    { path: 'sendContent', component: SendSarabanContentComponent, outlet: 'contentCenter' },
                    { path: 'sendEmail', component: SendEmailComponent, outlet: 'contentCenter' },
                    { path: 'listReserveContent', component: ListReserveSarabanContentComponent, outlet: 'contentCenter' },
                    { path: 'fileAttachContent', component: SarabanFileAttachComponent, outlet: 'contentCenter' },
                    { path: 'authSaraban', component: AuthSarabanContentComponent, outlet: 'contentCenter' },
                    { path: 'toDms/:id', component: AddDocumentComponent, outlet: 'contentCenter' },
                    { path: 'privateGroup', component: PrivateGroupComponent, outlet: 'contentCenter' },
                    { path: 'add-group', component: AddPrivateGroupComponent, outlet: 'contentCenter' },
                    { path: 'search-outsider', component: DialogSearchOutsiderComponent, outlet: 'contentCenter' },
                    { path: 'myWork', component: MyWorkComponent, outlet: 'contentCenter' },
                    { path: 'addMyWork', component: AddMyWorkComponent, outlet: 'contentCenter' },
                ]
            },
            {
                path: 'sarabans', component: SarabanComponent, outlet: 'center',
                children: [
                    { path: '', component: ListSarabanFolderComponent, outlet: 'contentCenter' },
                    { path: 'sarabanFolder', component: ListSarabanFolderComponent, outlet: 'contentCenter' },
                    { path: 'add', component: AddSarabanFolderComponent, outlet: 'contentCenter' },
                    { path: 'content', component: ListSarabanContentComponent, outlet: 'contentCenter' },
                    { path: 'addContent_s', component: AddSarabanContentComponent, outlet: 'contentCenter' },
                    { path: 'fileAttachContent', component: SarabanFileAttachComponent, outlet: 'contentCenter' },
                    { path: 'sendContent', component: SendSarabanContentComponent, outlet: 'contentCenter' },
                    { path: 'sendEmail', component: SendEmailComponent, outlet: 'contentCenter' },
                    { path: 'listReserveContent', component: ListReserveSarabanContentComponent, outlet: 'contentCenter' },
                    { path: 'authSaraban', component: AuthSarabanContentComponent, outlet: 'contentCenter' },
                    { path: 'searchFilter', component: DialogSettingSearchFilterComponent, outlet: 'contentCenter' },
                    { path: 'circularNotice', component: CircularNoticeComponent, outlet: 'contentCenter' },
                    { path: 'dialogCN', component: DialogCircularNoticeComponent, outlet: 'contentCenter' },
                    { path: 'listCN', component: ListCircularNoticeComponent, outlet: 'contentCenter' },
                    { path: 'addCN', component: AddCircularNoticeComponent, outlet: 'contentCenter' },
                ]
            },
            { path: 'sarabanFolders/:id', component: AddSarabanFolderComponent, outlet: 'center' },
            { path: 'finishContent', component: FinishSarabanContentComponent, outlet: 'center' },
            { path: 'registerContent', component: RegisterSarabanContentComponent, outlet: 'center' },
            { path: 'reserveContentCancel', component: ReserveSarabanContentCancelComponent, outlet: 'center' },
            { path: 'reserveContent', component: ReserveSarabanContentComponent, outlet: 'center' },
            { path: 'keepContent', component: KeepSarabanContentComponent, outlet: 'center' },
            { path: 'reportSaraban', component: ReportSarabanComponent, outlet: 'center' },
            { path: 'report', component: ReportComponent, outlet: 'center' },
            { path: 'dialogWarning', component: DialogWarningComponent, outlet: 'center' },
            { path: 'dialogWorkflowText', component: DialogWorkflowTextComponent, outlet: 'center' },
            { path: 'dialogWorkflow', component: DialogWorkflowComponent, outlet: 'center' },
            { path: 'dialogListreserve', component: DialogListReserveComponent, outlet: 'center' },
            { path: 'deleteDialog', component: DeleteDialogComponent, outlet: 'center' },
            { path: 'cancelSendDialog', component: DialogCancelSendComponent, outlet: 'center' },
            { path: 'DialogView', component: DialogViewComponent, outlet: 'center' },
            { path: 'MoveFolder', component: DialogMoveFolderComponent, outlet: 'center' },
            { path: 'record', component: DialogRecordComponent, outlet: 'center' },
            { path: 'ecmsStatus', component: StatusEcmsComponent, outlet: 'center', },
            { path: 'ecmsCheckStatus', component: CheckStatusEcmsComponent, outlet: 'center', },
            { path: 'ecmsSend', component: SendEcmsComponent, outlet: 'center', },
            { path: 'ecmsReceive', component: ReceiveEcmsComponent, outlet: 'center', }, 
            { path: 'ecmsFile', component: FileEcmsComponent, outlet: 'center' },  
            { path: 'ecmsListMenu', component: ListMenuEcmsComponent, outlet: 'center' },
            { path: 'ecmsDialogShow', component: DialogsShowThEGifComponent, outlet: 'center' },
            {
                path: 'folders', component: FolderComponent, outlet: 'center',
                children: [
                    { path: '', component: ListFolderAndDocumentComponent, outlet: 'contentCenter' },
                    { path: 'add', component: AddFolderComponent, outlet: 'contentCenter' },
                    { path: 'documents', component: ListDocumentComponent, outlet: 'contentCenter' },
                    { path: 'createDoc', component: AddDocumentComponent, outlet: 'contentCenter' },
                    { path: 'documents/:id', component: AddDocumentComponent, outlet: 'contentCenter' },
                    { path: 'deleteDialog', component: DeleteDialogComponent, outlet: 'center' },
                    { path: 'reOrder', component: ReOrderComponent, outlet: 'contentCenter' },
                    { path: 'email', component: EmailComponent, outlet: 'contentCenter' },
                    { path: 'auth', component: AuthComponent, outlet: 'contentCenter' },
                    { path: 'searchFolder', component: ViewDocumentComponent, outlet: 'contentCenter' },
                    { path: 'listBorrow', component: ListBorrowComponent, outlet: 'contentCenter' },
                    { path: 'detailBorrow', component: BorrowDetailComponent, outlet: 'contentCenter' },
                    { path: 'borrow', component: BorrowComponent, outlet: 'contentCenter' },
                    { path: 'ListUserDmsComponent', component: ListUserDmsComponent, outlet: 'center' },
                    { path: 'ListDocByDoctypeComponent', component: ListDocByDoctypeComponent, outlet: 'contentCenter' },
                    { path: 'ListFolderByDoctypeComponent', component: ListFolderByDoctypeComponent, outlet: 'contentCenter' },
                    { path: 'DialogListWfTypeComponent', component: DialogListWfTypeComponent, outlet: 'center' },
                    { path: 'DialogListFolderComponent', component: DialogListFolderComponent, outlet: 'center' },
                    { path: 'DialogMoveComponent', component: DialogMoveComponent, outlet: 'center' },
                    { path: 'DialogReportOptionComponent', component: DialogReportOptionComponent, outlet: 'center' },
                    { path: 'ListDocExpComponent', component: ListDocExpComponent, outlet: 'contentCenter' },
                ]
            },
            { path: 'email', component: EmailComponent, outlet: 'center' },
            { path: 'ListFolderByDoctypeComponent', component: ListFolderByDoctypeComponent, outlet: 'center' },
            { path: 'ListDocByDoctypeComponent', component: ListDocByDoctypeComponent, outlet: 'center' },
            { path: 'borrow', component: BorrowComponent, outlet: 'center' },
            { path: 'listBorrow', component: ListBorrowComponent, outlet: 'center' },
            { path: 'listBorrowAll', component: ListBorrowAllComponent, outlet: 'center' },
            { path: 'createDoc', component: AddDocumentComponent, outlet: 'center' },
            { path: 'searchFolder', component: ViewDocumentComponent, outlet: 'center' },
            { path: 'documents', component: ListDocumentComponent, outlet: 'center' },
            {
                path: 'search', component: SearchComponent, outlet: 'center',
                children: [
                    { path: '', component: SearchAllComponent, outlet: 'contentCenter' },
                    { path: 'createDoc2', component: AddDocumentComponent, outlet: 'contentCenter' },
                    { path: 'createDoc3/:id', component: AddDocumentComponent, outlet: 'contentCenter' },
                ]
            },
            { path: 'folders/:id', component: AddFolderComponent, outlet: 'center' },
            { path: 'settings', component: SettingComponent, canActivate: [AuthGuard], outlet: 'center' },
            //{ path: 'settings', component: SettingComponent, outlet: 'center' },
            { path: 'user-profile', component: UserProfileComponent, canActivate: [AuthGuard], outlet: 'center' },
            { path: 'outing', component: OrganizeComponent, canActivate: [AuthGuard], outlet: 'center' },
            { path: 'add-outing', component: AddOrganizeComponent, canActivate: [AuthGuard], outlet: 'center' },
            { path: 'user', component: UserComponent, canActivate: [AuthGuard], outlet: 'center' },
            { path: 'add-structure', component: AddStructureComponent, canActivate: [AuthGuard], outlet: 'center' },
            { path: 'edit-user/:userProfileId', component: UserComponent, canActivate: [AuthGuard], outlet: 'center' },
            { path: 'history-log', component: HistoryLogComponent, canActivate: [AuthGuard], outlet: 'center' },
            { path: 'holiday', component: HolidayComponent, canActivate: [AuthGuard], outlet: 'center' },
            { path: 'holiday-edit', component: HolidayAddComponent, canActivate: [AuthGuard], outlet: 'center' },
            { path: 'lookup', component: LookupComponent, canActivate: [AuthGuard], outlet: 'center' },
            { path: 'edit-lookup', component: EditLookupComponent, canActivate: [AuthGuard], outlet: 'center' },
            { path: 'search-setting', component: SettingSearchComponent, canActivate: [AuthGuard], outlet: 'center' },
            { path: 'document-type', component: DmsDocumentTypeComponent, canActivate: [AuthGuard], outlet: 'center' },
            { path: 'document-type-detail', component: DmsDocumentTypeDetailComponent, canActivate: [AuthGuard], outlet: 'center' },
            { path: 'list-document-type', component: ListDocumentTypeComponent, canActivate: [AuthGuard], outlet: 'center' },
            { path: 'edit-document-type', component: EditDocumentTypeComponent, canActivate: [AuthGuard], outlet: 'center' },
            { path: 'setting-assign-content', component: AssignContentComponent, canActivate: [AuthGuard], outlet: 'center' },
            { path: 'setting-permission-input', component: PermissionInputComponent, canActivate: [AuthGuard], outlet: 'center' },
            { path: 'setting-assign-content-structure', component: AssignContentStructureComponent, canActivate: [AuthGuard], outlet: 'center' },
            { path: 'department', component: ListDepartmentComponent, canActivate: [AuthGuard], outlet: 'center' },
            { path: 'department-detail', component: DetailDepartmentComponent, canActivate: [AuthGuard], outlet: 'center' },
            { path: 'user-list', component: ListUserComponent, canActivate: [AuthGuard], outlet: 'center' },
            { path: 'user-detail', component: DetailUserComponent, canActivate: [AuthGuard], outlet: 'center' },
            { path: 'list-type', component: ListTypeComponent, canActivate: [AuthGuard], outlet: 'center' },
            { path: 'edit-type', component: EditTypeComponent, canActivate: [AuthGuard], outlet: 'center' },
            { path: 'setting-permission-input-structure', component: InboxAuthComponent, canActivate: [AuthGuard], outlet: 'center' },
            { path: 'setting-permission-input-update', component: PermissionInputUpdateComponent, canActivate: [AuthGuard], outlet: 'center' },
            { path: 'list-document-type', component: ListDocumentTypeComponent, canActivate: [AuthGuard], outlet: 'center' },
            { path: 'edit-document-type', component: EditDocumentTypeComponent, canActivate: [AuthGuard], outlet: 'center' },
            { path: 'folder-auth', component: FolderAuthComponent, canActivate: [AuthGuard], outlet: 'center' },
            { path: 'DialogGropUserComponent', component: DialogGropUserComponent, canActivate: [AuthGuard], outlet: 'center' },
            { path: 'grop', component: GropComponent, canActivate: [AuthGuard], outlet: 'center' },
            { path: 'MoveProfileComponent', component: MoveProfileComponent, canActivate: [AuthGuard], outlet: 'center' },
            { path: 'MoveStructureComponent', component: MoveStructureComponent, canActivate: [AuthGuard], outlet: 'center' },
            { path: 'OrderStrucComponent', component: OrderStructureComponent, canActivate: [AuthGuard], outlet: 'center' },
            { path: 'SettingDefultComponent', component: SettingDefultProfileComponent, canActivate: [AuthGuard], outlet: 'center' },
            { path: 'MergeStructureComponent', component: MergeStructureComponent, canActivate: [AuthGuard], outlet: 'center' },
            { path: 'MergeUserComponent', component: MergeUserComponent, canActivate: [AuthGuard], outlet: 'center' },
            { path: 'LockUserComponent', component: LockUserComponent, canActivate: [AuthGuard], outlet: 'center' },
            { path: 'hrs-structure', component: HrsComponent, canActivate: [AuthGuard], outlet: 'center' },
            { path: 'hrs-user', component: HrsUserComponent, canActivate: [AuthGuard], outlet: 'center' },
            { path: 'up-structure', component: ListMergeStructureComponent, canActivate: [AuthGuard], outlet: 'center' },
            { path: 'up-user', component: ListMergeUsersComponent, canActivate: [AuthGuard], outlet: 'center' },
            { path: 'reportLog', component: ReportLogComponent, canActivate: [AuthGuard], outlet: 'center' },
            { path: 'ListHisttoryUser', component: ListHisttoryUserComponent, canActivate: [AuthGuard], outlet: 'center' },
            { path: 'ConfirmDialogComponent', component: ConfirmDialogComponent, canActivate: [AuthGuard], outlet: 'center' },
            { path: 'setting-param', component: ParamComponent, canActivate: [AuthGuard], outlet: 'center' },
            { path: 'dialog-param', component: DialogParamComponent, canActivate: [AuthGuard], outlet: 'center' },
            { path: 'dms-auth', component: DmsFolderAuthComponent, canActivate: [AuthGuard], outlet: 'center' },
            { path: 'wf-auth', component: WfFolderAuthComponent, canActivate: [AuthGuard], outlet: 'center' },
            { path: 'dms-user-auth', component: DmsFolderUserAuthComponent, canActivate: [AuthGuard], outlet: 'center' },
            { path: 'wf-user-auth', component: WfFolderUserAuthComponent, canActivate: [AuthGuard], outlet: 'center' },
            { path: 'auth-admin', component: AuthAdminComponent, canActivate: [AuthGuard], outlet: 'center' },
            { path: 'saraban-folder-group-auth', component: SarabanFolderGroupAuthComponent, canActivate: [AuthGuard], outlet: 'center' }
        ]
    },
    { path: '**', component: LoginComponent },
    { path: 'forgotPassword', component: ForgotPasswordComponent },
    { path: 'ErrorPasswordComponent', component: ErrorPasswordComponent },
    { path: 'change-password', component: ChangePasswordComponent },
    { path: 'AlertMessageComponent', component: AlertMessageComponent },
]

export const appRoutingProviders: any[] = [AuthGuard]
// export const appRoutingProviders: any[] = []
export const appRoutes: any = RouterModule.forRoot(routes, { useHash: true })
