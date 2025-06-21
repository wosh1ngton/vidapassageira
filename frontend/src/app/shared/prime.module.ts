import { Input, NgModule } from "@angular/core";
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { DialogModule } from 'primeng/dialog';

@NgModule({
    imports: [],
    declarations: [],
    exports: [
        ButtonModule, 
        DataViewModule,
        InputTextModule,
        TextareaModule,
        DialogModule
    ],
})
export class PrimeNgModule {

}