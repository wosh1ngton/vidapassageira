import { Routes } from '@angular/router';
import { DestinoComponent } from './componentes/viagem/destino/listar-destino/destino.component';
import { HomeComponent } from './componentes/home/home.component';
import { ListarViagemComponent } from './componentes/viagem/listar-viagem/listar-viagem.component';
import { PlanejarViagemComponent } from './componentes/viagem/planejar-viagem/planejar-viagem.component';
import { RegistroComponent } from './componentes/registro/registro.component';
import { PageNotFoundComponent } from './componentes/shared/page-not-found/page-not-found.component';
import { TermosComponent } from './componentes/legal/termos/termos.component';
import { PrivacidadeComponent } from './componentes/legal/privacidade/privacidade.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
    },
    {
        path: 'home',
        component: HomeComponent
    },
    {
        path: 'registro',
        component: RegistroComponent
    },
    {
        path: 'viagens',
        component: ListarViagemComponent,
    },
    {
        path: 'destinos',
        component: DestinoComponent
    },
    {
        path: 'planejar/:id',
        component: PlanejarViagemComponent,
    },
    {
        path: 'termos',
        component: TermosComponent
    },
    {
        path: 'privacidade',
        component: PrivacidadeComponent
    },
    {
        path: '**',
        component: PageNotFoundComponent
    }
];
