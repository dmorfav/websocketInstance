import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebsocketService } from '../websocket.service';

/**
 * ❌ OPCIÓN 1: COMPONENTE CON GUARD
 * 
 * DEMOSTRACIÓN DE PAIN POINTS:
 * - El componente se renderiza ANTES de que el WebSocket esté conectado
 * - Race condition: ¿WebSocket listo? ¿Quién sabe?
 * - Si intentamos enviar mensaje inmediatamente, puede fallar
 */
@Component({
  selector: 'app-page-with-guard',
  imports: [],
  template: `
    <div class="container">
      <h1>🔴 Opción 1: Guard (MALA PRÁCTICA)</h1>
      
      <div class="alert alert-danger">
        <h3>⚠️ Pain Points Detectados:</h3>
        <ul>
          <li><strong>Race Condition:</strong> Este componente se renderizó, pero ¿el WebSocket está listo?</li>
          <li><strong>Sin Garantías:</strong> El Guard no espera la conexión</li>
          <li><strong>Posible Fallo:</strong> Si intentamos usar el WebSocket ahora, puede no estar disponible</li>
        </ul>
      </div>

      <div class="status-card">
        <h3>Estado del WebSocket:</h3>
        <p>
          <span [class]="wsConnected ? 'status-connected' : 'status-disconnected'">
            {{ wsConnected ? '✅ Conectado' : '❌ Desconectado' }}
          </span>
        </p>
        <p class="detail">Tiempo de renderizado del componente: {{ renderTime }}ms</p>
      </div>

      <div class="test-section">
        <h3>🧪 Prueba de Funcionalidad:</h3>
        <button (click)="sendTestMessage()" [disabled]="!wsConnected">
          Enviar Mensaje de Prueba
        </button>
        @if (!wsConnected) {
          <p class="warning">
            ⚠️ No puedes enviar mensajes porque el WebSocket aún no está conectado.
            Esto demuestra el problema: el componente está listo, pero la funcionalidad NO.
          </p>
        }
      </div>

      <div class="explanation">
        <h3>📊 Análisis Técnico:</h3>
        <div class="metrics">
          <p><strong>LCP:</strong> ✅ No afectado (componente renderiza rápido)</p>
          <p><strong>Funcionalidad:</strong> ❌ No disponible inmediatamente</p>
          <p><strong>UX:</strong> ❌ Confuso - interfaz visible pero no funcional</p>
          <p><strong>Manejo de Errores:</strong> ❌ Imposible - Guard ya pasó</p>
        </div>
      </div>

      <div class="console-hint">
        <strong>💡 Abre la consola del navegador</strong> para ver el timeline completo de eventos
      </div>
    </div>
  `,
  styles: `
    .container {
      max-width: 800px;
      margin: 2rem auto;
      padding: 2rem;
      font-family: system-ui, -apple-system, sans-serif;
    }

    h1 {
      color: #dc3545;
      border-bottom: 3px solid #dc3545;
      padding-bottom: 1rem;
      margin-bottom: 2rem;
    }

    .alert {
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 2rem;
    }

    .alert-danger {
      background-color: #f8d7da;
      border: 2px solid #dc3545;
    }

    .alert h3 {
      margin-top: 0;
      color: #721c24;
    }

    .alert ul {
      margin-bottom: 0;
    }

    .alert li {
      margin: 0.5rem 0;
    }

    .status-card {
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 2rem;
      border: 2px solid #dee2e6;
    }

    .status-connected {
      color: #28a745;
      font-weight: bold;
      font-size: 1.2rem;
    }

    .status-disconnected {
      color: #dc3545;
      font-weight: bold;
      font-size: 1.2rem;
    }

    .detail {
      color: #6c757d;
      font-size: 0.9rem;
      margin-top: 0.5rem;
    }

    .test-section {
      background: #fff3cd;
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 2rem;
      border: 2px solid #ffc107;
    }

    button {
      background: #007bff;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      transition: background 0.3s;
    }

    button:hover:not(:disabled) {
      background: #0056b3;
    }

    button:disabled {
      background: #6c757d;
      cursor: not-allowed;
      opacity: 0.6;
    }

    .warning {
      color: #856404;
      background: #fff3cd;
      padding: 1rem;
      border-radius: 4px;
      margin-top: 1rem;
      border-left: 4px solid #ffc107;
    }

    .explanation {
      background: #e7f3ff;
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 2rem;
      border: 2px solid #007bff;
    }

    .metrics p {
      margin: 0.5rem 0;
      padding: 0.5rem;
      background: white;
      border-radius: 4px;
    }

    .console-hint {
      text-align: center;
      padding: 1rem;
      background: #d4edda;
      border-radius: 8px;
      border: 2px solid #28a745;
      color: #155724;
    }
  `
})
export class PageWithGuardComponent implements OnInit, OnDestroy {
  wsConnected = false;
  renderTime = 0;
  private renderStartTime = Date.now();
  private checkInterval: any;

  constructor(private websocketService: WebsocketService) {
    console.log('🔴 [GUARD COMPONENT] Constructor llamado');
  }

  ngOnInit() {
    this.renderTime = Date.now() - this.renderStartTime;
    console.log(`🔴 [GUARD COMPONENT] ngOnInit - Componente renderizado en ${this.renderTime}ms`);
    console.log('⚠️ [GUARD COMPONENT] ¿WebSocket está listo? Verificando...');
    
    // Verificar periódicamente si el WebSocket está conectado
    // Esto demuestra el problema: tenemos que POLLING para saber si está listo
    this.checkInterval = setInterval(() => {
      const connected = this.websocketService.isConnected();
      if (connected !== this.wsConnected) {
        this.wsConnected = connected;
        if (connected) {
          console.log('✅ [GUARD COMPONENT] WebSocket finalmente conectado (después del render)');
        }
      }
    }, 100);
  }

  ngOnDestroy() {
    console.log('🔴 [GUARD COMPONENT] Componente destruido');
    console.log('⚠️ [GUARD COMPONENT] ¿Quién cierra el WebSocket? ¿El Guard? No. ¿El componente? Tampoco está claro.');
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
    
    // ⚠️ PROBLEMA: No está claro quién debe cerrar la conexión
    // Si la cerramos aquí, puede afectar otras páginas que usen el mismo servicio
    // Si no la cerramos, memory leak potencial
  }

  sendTestMessage() {
    console.log('🔴 [GUARD COMPONENT] Intentando enviar mensaje...');
    this.websocketService.sendMessage({
      type: 'test',
      from: 'guard-component',
      message: 'Hola desde el Guard Component'
    });
  }
}

