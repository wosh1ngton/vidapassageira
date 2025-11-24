import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { ItinerarioResponseDto } from "../../../model/atividade-itinerario";

@Component({
    selector: 'app-itinerario-viagem',
    templateUrl: './itinerario-viagem.component.html',
    standalone: true,
    imports: [CommonModule]
})
export class ItinerarioViagemComponent {

    @Input() atividades: ItinerarioResponseDto[]= [];
}