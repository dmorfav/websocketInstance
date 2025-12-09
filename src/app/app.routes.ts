import { Routes } from '@angular/router';
import { websocketHandleGuard } from './websocket-handle.guard';
import { webSockeHandleResolver } from './web-socke-handle.resolver';

export const routes: Routes = [
    {
        path: 'socket_guard',
        loadComponent: () => import('./page-with-guard/page-with-guard.component').then(m => m.PageWithGuardComponent),
        canActivate: [websocketHandleGuard]
    },
    {
        path: 'socket_resolver',
        loadComponent: () => import('./page-with-resolver/page-with-resolver.component').then(m => m.PageWithResolverComponent),
        resolve: { websocketData: webSockeHandleResolver }
    },
    {
        path: 'socket_service_a',
        loadComponent: () => import('./page-with-service-a/page-with-service-a.component').then(m => m.PageWithServiceAComponent)
    },
    {
        path: 'socket_service_b',
        loadComponent: () => import('./page-with-service-b/page-with-service-b.component').then(m => m.PageWithServiceBComponent)   
    }
];
