import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { WebsocketService } from './websocket.service';

/**
 * ❌ OPCIÓN 1: GUARD (MALA PRÁCTICA)
 * 
 * PAIN POINTS:
 * 
 * 1. FIRE-AND-FORGET: El Guard llama a connectWebsocketSync() que NO espera la conexión
 *    - Retorna `true` INMEDIATAMENTE
 *    - La conexión se establece DESPUÉS (race condition)
 *    - El componente puede renderizarse SIN tener WebSocket disponible
 * 
 * 2. SIN MANEJO DE ERRORES:
 *    - Si el WebSocket falla, el Guard ya pasó
 *    - El usuario está en la página pero sin funcionalidad
 *    - No hay forma de revertir la navegación
 * 
 * 3. NO BLOQUEA NAVEGACIÓN (parece bueno, pero es malo):
 *    - El usuario ve contenido inmediatamente (✅ para LCP)
 *    - PERO el contenido puede estar roto o no funcional (❌ para UX)
 *    - PERO no hay garantía de que el WebSocket esté listo
 * 
 * 4. CONEXIONES MÚLTIPLES:
 *    - Si el usuario navega rápido (entra/sale/entra), se crean múltiples conexiones
 *    - No hay control sobre el ciclo de vida
 *    - Memory leaks potenciales
 * 
 * VEREDICTO: ❌ NO USAR para operaciones asíncronas críticas
 */
export const websocketHandleGuard: CanActivateFn = (route, state) => {
  console.log('═══════════════════════════════════════════════════════');
  console.log('🔴 EJECUTANDO GUARD (Opción 1 - MALA PRÁCTICA)');
  console.log('═══════════════════════════════════════════════════════');
  
  const websocketService = inject(WebsocketService);
  
  // ⚠️ PROBLEMA: Esto es FIRE-AND-FORGET
  websocketService.connectWebsocketSync();
  
  console.log('✓ Guard retorna TRUE INMEDIATAMENTE (no espera conexión)');
  console.log('⚠️ RIESGO: Componente se renderiza ANTES de que WebSocket esté listo');
  console.log('═══════════════════════════════════════════════════════\n');
  
  // El Guard siempre permite la navegación
  // Esto significa que el usuario verá la página aunque el WebSocket falle
  return true;
};

