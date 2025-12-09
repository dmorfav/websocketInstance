import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';

interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private ws: WebSocket | null = null;
  private messageSubject = new Subject<WebSocketMessage>();
  private connectionAttempts = 0;
  private readonly WS_URL = 'wss://demo.piesocket.com/v3/channel_123?api_key=VCXCEuvhGcBDP7XhiJJUDvR1e1D3eiVjgZ9VRiaV&notify_self';
  
  // PAIN POINT TRACKING
  private connectionStartTime: number = 0;
  private isConnecting = false;

  constructor() {
    console.log('🔧 WebSocket Service Constructor - Service is Singleton');
  }

  /**
   * ⚠️ PAIN POINT #1: BLOQUEO SÍNCRONO EN GUARD
   * Este método es SÍNCRONO pero la conexión es ASÍNCRONA
   * El Guard NO ESPERA a que se complete la conexión
   */
  connectWebsocketSync(): void {
    console.log('🔴 [GUARD APPROACH] Iniciando conexión SÍNCRONA (fire-and-forget)');
    this.connectionStartTime = Date.now();
    
    try {
      this.ws = new WebSocket(this.WS_URL);
      
      this.ws.onopen = () => {
        const duration = Date.now() - this.connectionStartTime;
        console.log(`✅ [GUARD] WebSocket conectado después de ${duration}ms`);
        console.log('⚠️ PROBLEMA: El Guard ya pasó hace mucho tiempo. El componente puede renderizarse ANTES de tener conexión.');
      };

      this.ws.onerror = (error) => {
        console.error('❌ [GUARD] Error de WebSocket:', error);
        console.log('⚠️ PROBLEMA CRÍTICO: El Guard ya retornó true. El usuario ya está en la página pero SIN conexión.');
      };

      this.ws.onclose = () => {
        console.log('🔌 [GUARD] WebSocket cerrado');
      };
      
    } catch (error) {
      console.error('💥 [GUARD] Error al crear WebSocket:', error);
      console.log('⚠️ PROBLEMA: El Guard no puede manejar este error. Ya retornó true.');
    }
  }

  /**
   * ⚠️ PAIN POINT #2: RESOLVER BLOQUEA LA NAVEGACIÓN
   * Este método retorna una Promise que el Resolver DEBE esperar
   * Angular NO renderiza el componente hasta que esta Promise se resuelva
   */
  connectWebsocketAsync(): Promise<boolean> {
    console.log('🟡 [RESOLVER APPROACH] Iniciando conexión ASÍNCRONA (blocking)');
    this.connectionStartTime = Date.now();
    
    // SIMULAR ESCENARIO REAL: Timeout de 10 segundos
    const TIMEOUT = 10000;

    return new Promise((resolve, reject) => {
      console.log(`⏳ [RESOLVER] Navegación BLOQUEADA. Esperando conexión WebSocket (timeout: ${TIMEOUT}ms)...`);
      console.log('🚫 IMPACTO EN UX: El usuario ve pantalla en blanco o spinner. LCP se degrada.');
      
      const timeoutId = setTimeout(() => {
        console.error(`⏰ [RESOLVER] TIMEOUT después de ${TIMEOUT}ms`);
        console.log('💀 PROBLEMA CRÍTICO: Si el servidor está caído, el usuario NUNCA accede a la página');
        console.log('💀 El usuario se queda ATRAPADO en la página anterior');
        
        if (this.ws) {
          this.ws.close();
        }
        reject(new Error('WebSocket connection timeout'));
      }, TIMEOUT);

      try {
        this.ws = new WebSocket(this.WS_URL);
        
        this.ws.onopen = () => {
          clearTimeout(timeoutId);
          const duration = Date.now() - this.connectionStartTime;
          console.log(`✅ [RESOLVER] WebSocket conectado después de ${duration}ms`);
          console.log(`📊 IMPACTO EN CORE WEB VITALS:`);
          console.log(`   - LCP aumentado en ${duration}ms`);
          console.log(`   - FCP retrasado (usuario ve spinner)`);
          console.log(`   - TBT incrementado (navegación bloqueada)`);
          resolve(true);
        };

        this.ws.onerror = (error) => {
          clearTimeout(timeoutId);
          console.error('❌ [RESOLVER] Error de WebSocket:', error);
          console.log('💀 NAVEGACIÓN FALLIDA: El usuario NO puede acceder a la página');
          reject(error);
        };

        this.ws.onclose = () => {
          console.log('🔌 [RESOLVER] WebSocket cerrado');
        };
        
      } catch (error) {
        clearTimeout(timeoutId);
        console.error('💥 [RESOLVER] Error al crear WebSocket:', error);
        reject(error);
      }
    });
  }

  /**
   * ✅ OPCIÓN 3 (CORRECTA): CONEXIÓN NO BLOQUEANTE
   * El componente se renderiza INMEDIATAMENTE
   * La conexión se establece en BACKGROUND
   * El usuario puede interactuar con la UI mientras se conecta
   */
  connectWebsocketNonBlocking(): Observable<WebSocketMessage> {
    console.log('🟢 [SERVICE APPROACH] Iniciando conexión NO BLOQUEANTE');
    console.log('✅ BENEFICIO: El componente se renderiza INMEDIATAMENTE');
    console.log('✅ BENEFICIO: LCP no se ve afectado por el WebSocket');
    
    this.connectionStartTime = Date.now();
    
    if (this.isConnecting || (this.ws && this.ws.readyState === WebSocket.OPEN)) {
      console.log('♻️ [SERVICE] Reutilizando conexión existente (singleton pattern)');
      return this.messageSubject.asObservable();
    }

    this.isConnecting = true;
    this.connectionAttempts++;

    try {
      this.ws = new WebSocket(this.WS_URL);
      
      this.ws.onopen = () => {
        const duration = Date.now() - this.connectionStartTime;
        this.isConnecting = false;
        console.log(`✅ [SERVICE] WebSocket conectado después de ${duration}ms`);
        console.log(`📊 IMPACTO EN CORE WEB VITALS: NINGUNO`);
        console.log(`   - LCP: No afectado (componente ya renderizado)`);
        console.log(`   - FCP: No afectado (contenido inicial ya visible)`);
        console.log(`   - TBT: No afectado (navegación no bloqueada)`);
        
        // El componente puede mostrar un estado "Conectando..." y luego "Conectado"
        this.messageSubject.next({
          type: 'connection',
          data: { status: 'connected' },
          timestamp: Date.now()
        });
      };

      this.ws.onmessage = (event) => {
        this.messageSubject.next({
          type: 'message',
          data: JSON.parse(event.data),
          timestamp: Date.now()
        });
      };

      this.ws.onerror = (error) => {
        this.isConnecting = false;
        console.error('❌ [SERVICE] Error de WebSocket:', error);
        console.log('✅ RESILIENCIA: El componente ya está renderizado. Puede mostrar error gracefully.');
        console.log('✅ El usuario NO está atrapado. Puede navegar libremente.');
        
        this.messageSubject.next({
          type: 'error',
          data: { error: 'Connection failed', attempts: this.connectionAttempts },
          timestamp: Date.now()
        });
      };

      this.ws.onclose = () => {
        this.isConnecting = false;
        console.log('🔌 [SERVICE] WebSocket cerrado');
        this.messageSubject.next({
          type: 'connection',
          data: { status: 'disconnected' },
          timestamp: Date.now()
        });
      };
      
    } catch (error) {
      this.isConnecting = false;
      console.error('💥 [SERVICE] Error al crear WebSocket:', error);
    }

    return this.messageSubject.asObservable();
  }

  /**
   * ⚠️ PAIN POINT #3: MEMORY LEAKS Y CONEXIONES FANTASMA
   * Si el usuario navega rápidamente, pueden quedar conexiones abiertas
   */
  disconnect(): void {
    console.log('🔌 Cerrando conexión WebSocket...');
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isConnecting = false;
  }

  /**
   * Verificar estado de conexión
   */
  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }

  /**
   * Enviar mensaje
   */
  sendMessage(message: any): void {
    if (this.isConnected() && this.ws) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('⚠️ No se puede enviar mensaje: WebSocket no conectado');
    }
  }
}
