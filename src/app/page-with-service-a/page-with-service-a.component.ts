import { Component, OnInit } from '@angular/core';
import { WebsocketService } from '../websocket.service';
import { DatePipe, JsonPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

/**
 * ✅ OPCIÓN 3: COMPONENTE CON SERVICE (BUENA PRÁCTICA)
 * 
 * VENTAJAS:
 * - El componente se renderiza INMEDIATAMENTE (sin esperar WebSocket)
 * - La conexión se establece en BACKGROUND (no bloqueante)
 * - El usuario puede interactuar con la UI mientras se conecta
 * - Manejo de errores graceful (no rompe la navegación)
 * - Core Web Vitals optimizados
 * - Gestión automática de suscripciones con takeUntilDestroyed()
 */
@Component({
  selector: 'app-page-with-service-a',
  imports: [DatePipe, JsonPipe],
  template: `
    <div class="container">
      <h1>🟢 Opción 3A: Service + ngOnInit (BUENA PRÁCTICA)</h1>
      
      <div class="alert alert-success">
        <h3>✅ Ventajas de este Enfoque:</h3>
        <ul>
          <li><strong>Render Inmediato:</strong> Viste esta página INSTANTÁNEAMENTE</li>
          <li><strong>Conexión en Background:</strong> WebSocket se conecta mientras puedes interactuar</li>
          <li><strong>Core Web Vitals Óptimos:</strong> LCP, FCP no afectados por operaciones de red</li>
          <li><strong>Resiliente:</strong> Si el WebSocket falla, la página sigue funcionando</li>
          <li><strong>Progressive Enhancement:</strong> La UI se actualiza cuando hay conexión</li>
        </ul>
      </div>

      <div class="timeline">
        <h3>📊 Timeline de Eventos:</h3>
        <div class="timeline-item" [class]="renderCompleted ? 'timeline-item completed' : 'timeline-item'">
          <span class="badge">{{ renderTime }}ms</span>
          <strong>1. Componente Renderizado</strong>
          <small>Usuario ve contenido inmediatamente</small>
        </div>
        <div class="timeline-item" [class]="wsConnected ? 'timeline-item completed' : 'timeline-item'">
          <span class="badge">{{ wsConnectionTime }}ms</span>
          <strong>2. WebSocket Conectado</strong>
          <small>Conexión establecida en background</small>
        </div>
      </div>

      <div class="status-card" [class]="!wsConnected ? 'status-card connecting' : 'status-card connected'">
        <h3>Estado de Conexión:</h3>
        <div class="status-indicator">
          @if (!wsConnected) {
            <span class="pulse">🔄</span>
          }
          @if (wsConnected) {
            <span>✅</span>
          }
          <strong>{{ wsConnected ? 'Conectado' : 'Conectando...' }}</strong>
        </div>
        <p class="status-message">{{ statusMessage }}</p>
      </div>

      <div class="interaction-section">
        <h3>🎮 Interacción:</h3>
        <button (click)="sendTestMessage()" [disabled]="!wsConnected">
          {{ wsConnected ? 'Enviar Mensaje' : 'Esperando conexión...' }}
        </button>
        <button (click)="navigateToB()" class="secondary">
          Ir a Página B (probar singleton)
        </button>
        
        @if (!wsConnected) {
          <div class="info-box">
            <p>ℹ️ Puedes interactuar con la página mientras se conecta el WebSocket.</p>
            <p>Esto es <strong>Progressive Enhancement</strong> en acción.</p>
          </div>
        }
      </div>

      @if (messages.length > 0) {
        <div class="messages-section">
          <h3>📨 Mensajes Recibidos:</h3>
          @for (msg of messages; track msg.timestamp) {
            <div class="message">
              <span class="timestamp">{{ msg.timestamp | date:'HH:mm:ss.SSS' }}</span>
              <span class="type">{{ msg.type }}</span>
              <pre>{{ msg.data | json }}</pre>
            </div>
          }
        </div>
      }

      <div class="metrics-section">
        <h3>📈 Métricas de Rendimiento:</h3>
        <div class="metrics-grid">
          <div class="metric good">
            <div class="metric-label">LCP</div>
            <div class="metric-value">{{ renderTime }}ms</div>
            <div class="metric-status">✅ Óptimo</div>
            <small>No bloqueado por WebSocket</small>
          </div>
          <div class="metric good">
            <div class="metric-label">FCP</div>
            <div class="metric-value">{{ renderTime }}ms</div>
            <div class="metric-status">✅ Óptimo</div>
            <small>Contenido visible inmediatamente</small>
          </div>
          <div class="metric good">
            <div class="metric-label">TBT</div>
            <div class="metric-value">~0ms</div>
            <div class="metric-status">✅ Óptimo</div>
            <small>Navegación no bloqueada</small>
          </div>
          <div class="metric good">
            <div class="metric-label">INP</div>
            <div class="metric-value">Disponible</div>
            <div class="metric-status">✅ Óptimo</div>
            <small>Usuario puede interactuar</small>
          </div>
        </div>
      </div>

      <div class="console-hint">
        <strong>💡 Consola del navegador:</strong> Observa cómo el componente se renderiza ANTES de que el WebSocket conecte
      </div>
    </div>
  `,
  styles: `
    .container {
      max-width: 900px;
      margin: 2rem auto;
      padding: 2rem;
      font-family: system-ui, -apple-system, sans-serif;
    }

    h1 {
      color: #28a745;
      border-bottom: 3px solid #28a745;
      padding-bottom: 1rem;
      margin-bottom: 2rem;
    }

    .alert {
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 2rem;
    }

    .alert-success {
      background-color: #d4edda;
      border: 2px solid #28a745;
    }

    .alert h3 {
      margin-top: 0;
      color: #155724;
    }

    .alert ul {
      margin-bottom: 0;
      line-height: 1.8;
    }

    .timeline {
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 2rem;
      border: 2px solid #dee2e6;
    }

    .timeline-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      margin: 0.5rem 0;
      background: white;
      border-radius: 4px;
      opacity: 0.5;
      transition: opacity 0.3s;
    }

    .timeline-item.completed {
      opacity: 1;
      border-left: 4px solid #28a745;
    }

    .badge {
      background: #007bff;
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.85rem;
      font-weight: bold;
      min-width: 60px;
      text-align: center;
    }

    .timeline-item strong {
      flex: 1;
    }

    .timeline-item small {
      color: #6c757d;
      font-size: 0.85rem;
    }

    .status-card {
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 2rem;
      border: 2px solid #dee2e6;
      transition: all 0.3s;
    }

    .status-card.connecting {
      background: #fff3cd;
      border-color: #ffc107;
    }

    .status-card.connected {
      background: #d4edda;
      border-color: #28a745;
    }

    .status-indicator {
      display: flex;
      align-items: center;
      gap: 1rem;
      font-size: 1.5rem;
    }

    .pulse {
      animation: pulse 1.5s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .status-message {
      margin-top: 1rem;
      font-size: 0.95rem;
      color: #6c757d;
    }

    .interaction-section {
      background: #e7f3ff;
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 2rem;
      border: 2px solid #007bff;
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
      margin-right: 1rem;
      margin-bottom: 1rem;
    }

    button:hover:not(:disabled) {
      background: #0056b3;
    }

    button:disabled {
      background: #6c757d;
      cursor: not-allowed;
      opacity: 0.6;
    }

    button.secondary {
      background: #6c757d;
    }

    button.secondary:hover {
      background: #545b62;
    }

    .info-box {
      background: white;
      padding: 1rem;
      border-radius: 4px;
      margin-top: 1rem;
      border-left: 4px solid #17a2b8;
    }

    .messages-section {
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 2rem;
      border: 2px solid #6c757d;
      max-height: 300px;
      overflow-y: auto;
    }

    .message {
      background: white;
      padding: 0.75rem;
      border-radius: 4px;
      margin: 0.5rem 0;
      font-size: 0.9rem;
      border-left: 3px solid #007bff;
    }

    .timestamp {
      color: #6c757d;
      font-size: 0.8rem;
      margin-right: 1rem;
    }

    .type {
      background: #007bff;
      color: white;
      padding: 0.125rem 0.5rem;
      border-radius: 3px;
      font-size: 0.75rem;
      margin-right: 1rem;
    }

    pre {
      margin: 0.5rem 0 0 0;
      font-size: 0.85rem;
      color: #495057;
    }

    .metrics-section {
      background: #e7f3ff;
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 2rem;
      border: 2px solid #007bff;
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-top: 1rem;
    }

    .metric {
      background: white;
      padding: 1rem;
      border-radius: 4px;
      text-align: center;
    }

    .metric.good {
      border-top: 3px solid #28a745;
    }

    .metric-label {
      font-weight: bold;
      color: #495057;
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
    }

    .metric-value {
      font-size: 1.5rem;
      font-weight: bold;
      color: #28a745;
      margin: 0.5rem 0;
    }

    .metric-status {
      color: #28a745;
      font-weight: bold;
      margin-bottom: 0.25rem;
    }

    .metric small {
      display: block;
      color: #6c757d;
      font-size: 0.75rem;
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
export class PageWithServiceAComponent implements OnInit {
  wsConnected = false;
  renderCompleted = false;
  renderTime = 0;
  wsConnectionTime = 0;
  statusMessage = 'Iniciando conexión en background...';
  messages: any[] = [];
  
  private renderStartTime = performance.now();

  constructor(private websocketService: WebsocketService) {
    console.log('🟢 [SERVICE A] Constructor llamado');
  }

  ngOnInit() {
    this.renderTime = Math.round(performance.now() - this.renderStartTime);
    this.renderCompleted = true;
    
    console.log(`🟢 [SERVICE A] Componente renderizado en ${this.renderTime}ms`);
    console.log('✅ [SERVICE A] Usuario puede ver e interactuar con la UI INMEDIATAMENTE');
    console.log('🔄 [SERVICE A] Iniciando conexión WebSocket en background...');
    
    // Conectar WebSocket de forma NO BLOQUEANTE
    // takeUntilDestroyed() limpia automáticamente la suscripción cuando el componente se destruye
    this.websocketService.connectWebsocketNonBlocking()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (message) => {
          this.messages.push(message);
          
          if (message.type === 'connection') {
            if (message.data.status === 'connected') {
              this.wsConnected = true;
              this.wsConnectionTime = Math.round(performance.now() - this.renderStartTime);
              this.statusMessage = `Conexión establecida (${this.wsConnectionTime - this.renderTime}ms después del render)`;
              console.log(`✅ [SERVICE A] WebSocket conectado ${this.wsConnectionTime - this.renderTime}ms DESPUÉS del render`);
              console.log('✅ [SERVICE A] El usuario ya pudo interactuar durante ese tiempo');
            }
          }
        },
        error: (error) => {
          console.error('❌ [SERVICE A] Error en WebSocket:', error);
          this.statusMessage = 'Error de conexión. La página sigue funcional.';
          // ⚠️ RESILIENCIA: El componente sigue funcionando aunque el WebSocket falle
        }
      });
  }

  sendTestMessage() {
    console.log('🟢 [SERVICE A] Enviando mensaje...');
    this.websocketService.sendMessage({
      type: 'test',
      from: 'service-a-component',
      message: 'Hola desde Service A Component',
      timestamp: new Date().toISOString()
    });
  }

  navigateToB() {
    // Usar Router si está disponible, o simplemente window.location
    window.location.href = '/socket_service_b';
  }
}

