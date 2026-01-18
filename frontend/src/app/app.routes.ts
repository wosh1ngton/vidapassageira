import { Routes } from '@angular/router';
import { DestinoComponent } from './componentes/viagem/destino/listar-destino/destino.component';
import { HomeComponent } from './componentes/home/home.component';
import { ListarViagemComponent } from './componentes/viagem/listar-viagem/listar-viagem.component';
import { PlanejarViagemComponent } from './componentes/viagem/planejar-viagem/planejar-viagem.component';
import { PageNotFoundComponent } from './componentes/shared/page-not-found/page-not-found.component';

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
        path: '',
        component: ListarViagemComponent,        
        
    },
    {
        path: 'viagens',
        component: ListarViagemComponent,        
        
    },
    {
        path: 'planejar/:id',
        component: PlanejarViagemComponent,        
    },
    {
        path: '**',
        component: PageNotFoundComponent
    }
     

];
