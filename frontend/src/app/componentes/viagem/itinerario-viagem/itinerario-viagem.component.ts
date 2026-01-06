import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, Input } from "@angular/core";
import { ItinerarioResponseDto } from "../../../model/atividade-itinerario";
import { FormsModule } from "@angular/forms";
import { PrimeNgModule } from "../../../shared/prime.module";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { ItinerarioFormComponent } from "./form-itinerario-viagem/form-itinerario-viagem.component";

@Component({
    selector: 'app-itinerario-viagem',
    templateUrl: './itinerario-viagem.component.html',
    standalone: true,
    imports: [CommonModule, FormsModule, PrimeNgModule]
})
export class ItinerarioViagemComponent {

    @Input() atividades: ItinerarioResponseDto[];
    ref: DynamicDialogRef | undefined;

    constructor(private dialogService: DialogService, private cdRef: ChangeDetectorRef) {

    }

    editarItemItinerario(item: ItinerarioResponseDto) {
        
        this.ref = this.dialogService.open(ItinerarioFormComponent, {
            header: 'Edição do Itinerário',
            width: '50vw',
            modal:true,
            data: item,
            breakpoints: {
                '960px': '75vw',
                '640px': '90vw'
            },
        });
        this.ref.onClose.subscribe(() => this.cdRef.detectChanges());
        
    }
}