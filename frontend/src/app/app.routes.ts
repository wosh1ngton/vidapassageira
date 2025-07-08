import { Routes } from '@angular/router';
import { DestinoComponent } from './componentes/viagem/destino/listar-destino/destino.component';
import { HomeComponent } from './componentes/home/home.component';
import { ListarViagemComponent } from './componentes/viagem/listar-viagem/listar-viagem.component';
import { PlanejarViagemComponent } from './componentes/viagem/planejar-viagem/planejar-viagem.component';

export const routes: Routes = [
    {
        path: 'destinos',
        component: DestinoComponent
    },
    {
        path: 'home',
        component: HomeComponent    
    
    },
    {
        path: 'viagens',
        component: ListarViagemComponent,
        children: [
            {
                path: 'planejar/:id',
                component: PlanejarViagemComponent
            }
        ]
    },
     

];
