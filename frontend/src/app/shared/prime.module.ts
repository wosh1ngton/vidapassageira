import { Input, NgModule } from "@angular/core";
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { PasswordModule } from 'primeng/password';
import { PanelModule } from 'primeng/panel';
import { PaginatorModule } from 'primeng/paginator';
import { ImageModule } from 'primeng/image';
import { FileUploadModule } from 'primeng/fileupload';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from "primeng/dropdown";
import { ConfirmDialogModule } from 'primeng/confirmdialog';


@NgModule({
    imports: [],
    declarations: [],
    exports: [
        ButtonModule, 
        DataViewModule,
        InputTextModule,
        TextareaModule,
        DialogModule,
        ToastModule,
        CardModule,
        PasswordModule,
        PanelModule,
        PaginatorModule,
        ImageModule,
        FileUploadModule,
        CalendarModule,
        DropdownModule,
        ConfirmDialogModule
    ],
})
export class PrimeNgModule {

}