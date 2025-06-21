import { Routes } from '@angular/router';
import { DestinoComponent } from './componentes/viagem/destino/listar-destino/destino.component';
import { HomeComponent } from './componentes/home/home.component';

export const routes: Routes = [
    {
        path: 'destinos',
        component: DestinoComponent
    },
    {
        path: 'home',
        component: HomeComponent    
    
    }

];
