import { BrowserModule } from '@angular/platform-browser'
import { MdIconRegistry } from '@angular/material'
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { CommonModule, LocationStrategy } from '@angular/common';
import { HttpModule } from '@angular/http'
import { AuthGuard } from './main/auth-guard.service'
import { AuthService }      from './main/auth.service'
import { CovalentCoreModule, CovalentLoadingModule, CovalentStepsModule, CovalentPagingModule, } from '@covalent/core'
import { CovalentHttpModule } from '@covalent/http'
// import { CovalentDataTableModule } from '@covalent/data-table'
// import { RequestInterceptor } from '../config/interceptors/request.interceptor'
import { MyDatePickerModule } from 'mydatepicker'
import { FileUploadModule } from 'ng2-file-upload/ng2-file-upload'
import { DndModule } from 'ng2-dnd'
// import { TreeModule } from 'ng2-tree'
import {
    TreeModule, GrowlModule, AutoCompleteModule, OverlayPanelModule, DialogModule, ChartModule,
    ContextMenuModule, DataTableModule, DropdownModule, MultiSelectModule, TabViewModule, BlockUIModule, GalleriaModule
} from 'primeng/primeng'
//import { DataTableModule } from 'angular-2-data-table'
//import { CovalentChipsModule } from '@covalent/core'
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive'
import { AlertLogOffComponent } from './alert-log-off/alert-log-off.component'
import { PdfViewerModule } from 'ng2-pdf-viewer';

import { AppComponent } from './app.component'
import { appRoutes, appRoutingProviders } from './app.routes'
import {
    LoginComponent,
    MainComponent,
    FolderComponent,
    ListFolderComponent,
    AddFolderComponent,
    SettingComponent,
    UserProfileComponent,
    ListDocumentComponent,
    AddDocumentComponent,
    AddUserProfileComponent,
    DeleteDialogComponent,
    DmsDocumentTypeComponent,
    DmsDocumentTypeDetailComponent,
    MwpComponent,
    InboxComponent,
    OutboxComponent,
    RecycleBinComponent,
    ListMwpComponent,
    HistoryLogComponent,
    HolidayComponent,
    HolidayAddComponent,
    LookupComponent,
    LoggerService,
    PxService,
    ParamSarabanService,
    EditLookupComponent,
    SarabanComponent,
    ListSarabanFolderComponent,
    AddSarabanFolderComponent,
    ImagePreviewDirective,
    FileAttachComponent,
    ListSarabanContentComponent,
    AddSarabanContentComponent,
    SendSarabanContentComponent,
    SendEmailComponent,
    OnlyNumberDirective,
    ReOrderComponent,
    EmailComponent,
    AuthComponent,
    FinishSarabanContentComponent,
    RegisterSarabanContentComponent,
    ListReserveSarabanContentComponent,
    ReserveSarabanContentComponent,
    ReserveSarabanContentCancelComponent,
    DynamicWebTwainComponent,
    SearchAllComponent,
    StructureComponent,
    StructureComponent2,
    SearchComponent,
    KeepSarabanContentComponent,
    SarabanFileAttachComponent,
    UserComponent,
    AuthSarabanContentComponent,
    ViewDocumentComponent,
    FlowChartComponent,
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
    ListDocumentTypeComponent,
    EditDocumentTypeComponent,

    ErrorPasswordComponent,
    ForgotPasswordComponent,
    FolderAuthComponent,
    AddStructureComponent,
    InboxAuthComponent,
    DialogWorkflowTextComponent,
    UploadFileAttachComponent,
    DialogGropUserComponent,
    GropComponent,
    ListBorrowComponent,
    BorrowDetailComponent,
    BorrowComponent,
    ListUserDmsComponent,
    ListFolderByDoctypeComponent,
    ListDocByDoctypeComponent,
    DialogListWfTypeComponent,
    ListFolderAndDocComponent,
    ListFolderAndDocumentComponent,
    DmsMenuComponent,
    FileAttachSarabanComponent,
    DialogWorkflowComponent,
    DialogListFolderComponent,
    ListBorrowAllComponent,
    DialogListReserveComponent,
    DialogMoveComponent,
    ParamSarabanComponent,
    DialogReportOptionComponent,
    ChangePasswordComponent,
    AlertMessageComponent,
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
    ParamDmsService,
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
    LoadMoreComponent,
    CircularNoticeComponent,
    DialogCircularNoticeComponent,
    ListCircularNoticeComponent,
    AddCircularNoticeComponent,
    AuthAdminComponent,
    DialogViewComponent,
    //BarcodeComponent,
    DialogMoveFolderComponent,
    DialogRecordComponent,
    //LocationHistory,
    //AuthGuard
    StatusEcmsComponent,
    CheckStatusEcmsComponent,
    SendEcmsComponent,
    ReceiveEcmsComponent,
    FileEcmsComponent,
    ListMenuEcmsComponent,
    DialogsShowThEGifComponent,
    AuthTemplateComponent,
    DialogViewImageComponent,
    DialogFileAttachApproveComponent,
    DialogConfirmPasswordComponent,
    FileAttachTemplateComponent,
    DialogAddFileAttachTemplateComponent,
    DialogListFileAttachTemplateComponent
} from './shared';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        MainComponent,
        FolderComponent,
        SettingComponent,
        ListFolderComponent,
        AddFolderComponent,
        DeleteDialogComponent,
        MwpComponent,
        UserProfileComponent,
        InboxComponent,
        OutboxComponent,
        RecycleBinComponent,
        ListMwpComponent,
        ListDocumentComponent,
        AddUserProfileComponent,
        AddDocumentComponent,
        HistoryLogComponent,
        HolidayComponent,
        HolidayAddComponent,
        LookupComponent,
        EditLookupComponent,
        SarabanComponent,
        ListSarabanFolderComponent,
        AddSarabanFolderComponent,
        ImagePreviewDirective,
        DmsDocumentTypeDetailComponent,
        UploadFileAttachComponent,
        FileAttachComponent,
        ListSarabanContentComponent,
        AddSarabanContentComponent,
        SendSarabanContentComponent,
        SendEmailComponent,
        OnlyNumberDirective,
        ReOrderComponent,
        EmailComponent,
        AuthComponent,
        FinishSarabanContentComponent,
        RegisterSarabanContentComponent,
        ListReserveSarabanContentComponent,
        ReserveSarabanContentComponent,
        ReserveSarabanContentCancelComponent,
        DynamicWebTwainComponent,
        SearchAllComponent,
        StructureComponent,
        StructureComponent2,
        SearchComponent,
        KeepSarabanContentComponent,
        SarabanFileAttachComponent,
        UserComponent,
        AuthSarabanContentComponent,
        ViewDocumentComponent,
        FlowChartComponent,
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
        ListDocumentTypeComponent,
        EditDocumentTypeComponent,

        ErrorPasswordComponent,
        ForgotPasswordComponent,
        FolderAuthComponent,
        AddStructureComponent,
        InboxAuthComponent,
        DialogWorkflowTextComponent,
        FileAttachSarabanComponent,
        DialogWorkflowComponent,
        DialogGropUserComponent,
        GropComponent,
        ListFolderAndDocumentComponent,
        ListBorrowComponent,
        BorrowDetailComponent,
        BorrowComponent,
        ListUserDmsComponent,
        ListDocByDoctypeComponent,
        ListFolderByDoctypeComponent,
        DialogListWfTypeComponent,
        ListFolderAndDocComponent,
        ListFolderAndDocumentComponent,
        DmsMenuComponent,
        DialogListFolderComponent,
        ListBorrowAllComponent,
        DialogListReserveComponent,
        DialogMoveComponent,
        ParamSarabanComponent,
        ChangePasswordComponent,
        AlertMessageComponent,
        DialogReportOptionComponent,
        MoveProfileComponent,
        MoveStructureComponent,
        OrderStructureComponent,
        DmsDocumentTypeComponent,
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
        AlertLogOffComponent,
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
        LoadMoreComponent,
        CircularNoticeComponent,
        DialogCircularNoticeComponent,
        ListCircularNoticeComponent,
        AddCircularNoticeComponent,
        AuthAdminComponent,
        DialogViewComponent,
        //BarcodeComponent,
        DialogMoveFolderComponent,
        DialogRecordComponent,
        StatusEcmsComponent,
        CheckStatusEcmsComponent,
        SendEcmsComponent,
        ReceiveEcmsComponent,
        FileEcmsComponent,
        ListMenuEcmsComponent,
        DialogsShowThEGifComponent,
        AuthTemplateComponent,
        DialogViewImageComponent,
        DialogFileAttachApproveComponent,
        DialogConfirmPasswordComponent,
        FileAttachTemplateComponent,
        DialogAddFileAttachTemplateComponent,
        DialogListFileAttachTemplateComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        appRoutes,
        HttpModule,
        CovalentCoreModule.forRoot(),
        MyDatePickerModule,
        FileUploadModule,
        CommonModule,
        DndModule.forRoot(),
        TreeModule,
        AutoCompleteModule,
        OverlayPanelModule,
        DialogModule,
        ContextMenuModule,
        CovalentStepsModule.forRoot(),
        GrowlModule,
        ChartModule,
        DataTableModule,
        DropdownModule,
        MultiSelectModule,
        TabViewModule,
        BlockUIModule,
        NgIdleKeepaliveModule.forRoot(),
        GalleriaModule,
        PdfViewerModule
    ],
    entryComponents: [
        AlertLogOffComponent,
        DialogFileAttachApproveComponent,
        DialogConfirmPasswordComponent,
        DialogAddFileAttachTemplateComponent,
        DialogListFileAttachTemplateComponent
    ],
    providers: [
        appRoutingProviders,
        LoggerService,
        PxService,
        ParamSarabanService,
        ParamDmsService,
        AuthService
        //{ provide:LocationStrategy, useClass:LocationHistory },
    ],
    bootstrap: [AppComponent],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }
