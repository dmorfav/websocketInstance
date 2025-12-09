import { ResolveFn } from '@angular/router';
import { WebsocketService } from './websocket.service';
import { inject } from '@angular/core';

/**
 * ❌ OPCIÓN 2: RESOLVER (MALA PRÁCTICA PARA WEBSOCKETS)
 * 
 * PAIN POINTS:
 * 
 * 1. BLOQUEO TOTAL DE NAVEGACIÓN:
 *    - Angular NO renderiza el componente hasta que el Resolver complete
 *    - Si el WebSocket tarda 5 segundos, el usuario espera 5 segundos viendo NADA
 *    - Pantalla en blanco o spinner infinito
 * 
 * 2. IMPACTO DEVASTADOR EN CORE WEB VITALS:
 *    - LCP (Largest Contentful Paint): +N segundos de delay
 *    - FCP (First Contentful Paint): +N segundos de delay
 *    - TBT (Total Blocking Time): Incrementado dramáticamente
 *    - INP (Interaction to Next Paint): Usuario no puede interactuar
 * 
 * 3. FAILURE = NAVEGACIÓN CANCELADA:
 *    - Si el servidor WebSocket está caído (error 500, timeout, etc.)
 *    - La navegación FALLA completamente
 *    - El usuario queda ATRAPADO en la página anterior
 *    - No puede acceder a la página destino aunque el contenido esté disponible
 * 
 * 4. SIN RESILIENCIA:
 *    - No hay retry automático
 *    - No hay fallback
 *    - No hay degradación graceful
 *    - Todo o nada: funciona perfecto o explota
 * 
 * 5. EXPERIENCIA DE USUARIO HORRIBLE:
 *    - Usuario espera sin feedback
 *    - No sabe si la app se congeló o está cargando
 *    - Alta probabilidad de abandono (bounce rate ++)
 * 
 * VEREDICTO: ❌❌ DEFINITIVAMENTE NO USAR para WebSockets u operaciones de red lentas
 */
export const webSockeHandleResolver: ResolveFn<boolean> = async (route, state) => {
  console.log('═══════════════════════════════════════════════════════');
  console.log('🟡 EJECUTANDO RESOLVER (Opción 2 - MALA PRÁCTICA)');
  console.log('═══════════════════════════════════════════════════════');
  console.log('🚫 NAVEGACIÓN BLOQUEADA: Esperando WebSocket...');
  console.log('⏳ Usuario ve: Pantalla en blanco o spinner');
  console.log('📊 Core Web Vitals: DEGRADÁNDOSE en tiempo real...');
  console.log('═══════════════════════════════════════════════════════\n');
  
  const websocketService = inject(WebsocketService);
  
  try {
    // ⚠️ ESTO BLOQUEA LA NAVEGACIÓN
    // Angular espera a que esta Promise se resuelva
    const result = await websocketService.connectWebsocketAsync();
    
    console.log('═══════════════════════════════════════════════════════');
    console.log('✅ Resolver completado: Permitiendo navegación');
    console.log('⚠️ PERO el daño ya está hecho: Pérdida de tiempo considerable');
    console.log('═══════════════════════════════════════════════════════\n');
    
    return result;
    
  } catch (error) {
    console.log('═══════════════════════════════════════════════════════');
    console.error('💀 RESOLVER FALLÓ: NAVEGACIÓN CANCELADA');
    console.log('💀 Usuario NO puede acceder a la página');
    console.log('💀 Usuario atrapado en página anterior');
    console.log('💀 Experiencia de usuario: DESASTROSA');
    console.log('═══════════════════════════════════════════════════════\n');
    
    // Si retornamos false, Angular cancela la navegación
    // El usuario se queda en la página anterior
    return false;
  }
};

