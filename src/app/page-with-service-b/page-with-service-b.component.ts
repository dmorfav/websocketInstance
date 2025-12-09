import { Component, OnInit } from '@angular/core';
import { WebsocketService } from '../websocket.service';
import { DatePipe, JsonPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

/**
 * ✅ OPCIÓN 3B: SEGUNDO COMPONENTE CON SERVICE
 * 
 * DEMUESTRA:
 * - Reutilización de la conexión WebSocket (singleton)
 * - No se crea una segunda conexión
 * - Render inmediato sin esperar reconexión
 * - Gestión automática de suscripciones con takeUntilDestroyed()
 */
@Component({
  selector: 'app-page-with-service-b',
  imports: [DatePipe, JsonPipe],
  template: `
    <div class="container">
      <h1>🟢 Opción 3B: Service + Singleton Pattern</h1>
      
      <div class="alert alert-info">
        <h3>♻️ Ventaja del Singleton:</h3>
        <p>
          Llegaste a esta página desde <strong>Service A</strong>.
          <br>
          El WebSocket <strong>NO se reconectó</strong> - reutilizamos la conexión existente.
        </p>
        <ul>
          <li>✅ Sin delay adicional</li>
          <li>✅ Sin overhead de reconexión</li>
          <li>✅ Gestión eficiente de recursos</li>
          <li>✅ State compartido entre componentes</li>
        </ul>
      </div>

      <div class="status-card connected">
        <h3>Estado de Conexión:</h3>
        <div class="connection-status">
          <span class="icon">{{ wsConnected ? '✅' : '❌' }}</span>
          <div>
            <strong>{{ wsConnected ? 'Conexión Activa (Reutilizada)' : 'Conectando...' }}</strong>
            <p>La misma conexión WebSocket que en Service A</p>
          </div>
        </div>
      </div>

      <div class="demo-section">
        <h3>🧪 Prueba de Continuidad:</h3>
        <button (click)="sendTestMessage()" [disabled]="!wsConnected">
          Enviar Mensaje desde Service B
        </button>
        <button (click)="navigateToA()" class="secondary">
          Volver a Service A
        </button>
        
        <div class="explanation">
          <p>
            <strong>💡 Nota Técnica:</strong>
            Ambos componentes (A y B) comparten la misma instancia del WebSocket Service (singleton).
            Esto significa que:
          </p>
          <ul>
            <li>La conexión persiste entre navegaciones</li>
            <li>No hay pérdida de mensajes</li>
            <li>No hay overhead de reconexión</li>
            <li>Los mensajes se reciben en ambos componentes si están suscritos</li>
          </ul>
        </div>
      </div>

      @if (messages.length > 0) {
        <div class="messages-section">
          <h3>📨 Mensajes (desde que llegaste a esta página):</h3>
          @for (msg of messages; track msg.timestamp) {
            <div class="message">
              <span class="timestamp">{{ msg.timestamp | date:'HH:mm:ss.SSS' }}</span>
              <span class="type">{{ msg.type }}</span>
              <pre>{{ msg.data | json }}</pre>
            </div>
          }
        </div>
      }

      <div class="comparison-table">
        <h3>📊 Comparación: Guard vs Resolver vs Service</h3>
        <table>
          <thead>
            <tr>
              <th>Característica</th>
              <th class="bad">Guard 🔴</th>
              <th class="bad">Resolver 🟡</th>
              <th class="good">Service 🟢</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Render del Componente</td>
              <td>Inmediato ✅</td>
              <td>Bloqueado ❌</td>
              <td>Inmediato ✅</td>
            </tr>
            <tr>
              <td>Garantía de Conexión</td>
              <td>No ❌</td>
              <td>Sí ✅</td>
              <td>Parcial ⚠️</td>
            </tr>
            <tr>
              <td>Impacto en LCP</td>
              <td>Ninguno ✅</td>
              <td>+N segundos ❌</td>
              <td>Ninguno ✅</td>
            </tr>
            <tr>
              <td>Manejo de Errores</td>
              <td>Imposible ❌</td>
              <td>Cancela Nav ❌</td>
              <td>Graceful ✅</td>
            </tr>
            <tr>
              <td>Experiencia Usuario</td>
              <td>Confusa ❌</td>
              <td>Frustrante ❌</td>
              <td>Óptima ✅</td>
            </tr>
            <tr>
              <td>Memory Leaks</td>
              <td>Riesgo Alto ❌</td>
              <td>Riesgo Medio ⚠️</td>
              <td>Control Total ✅</td>
            </tr>
            <tr>
              <td>Progressive Enhancement</td>
              <td>No ❌</td>
              <td>No ❌</td>
              <td>Sí ✅</td>
            </tr>
            <tr>
              <td>Reuso de Conexión</td>
              <td>No ❌</td>
              <td>No ❌</td>
              <td>Sí ✅</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="verdict">
        <h2>🏆 Veredicto Final</h2>
        <div class="verdict-content">
          <h3>❌ NO USAR Guards para WebSockets:</h3>
          <ul>
            <li>Fire-and-forget sin garantías</li>
            <li>Race conditions inevitables</li>
            <li>Sin manejo de errores real</li>
          </ul>

          <h3>❌ NO USAR Resolvers para WebSockets:</h3>
          <ul>
            <li>Bloqueo total de navegación</li>
            <li>Core Web Vitals destruidos</li>
            <li>Fallas cancelan la navegación completa</li>
            <li>UX horrible (spinner infinito)</li>
          </ul>

          <h3>✅ USAR Services con Observables:</h3>
          <ul>
            <li>Render inmediato del componente</li>
            <li>Conexión en background (no bloqueante)</li>
            <li>Manejo de errores graceful</li>
            <li>Progressive enhancement</li>
            <li>Core Web Vitals optimizados</li>
            <li>Singleton pattern para reutilización</li>
            <li>Control total del ciclo de vida</li>
          </ul>
        </div>
      </div>

      <div class="console-hint">
        <strong>💡 Revisa la consola completa</strong> desde que iniciaste en Service A
      </div>
    </div>
  `,
  styles: `
    .container {
      max-width: 1000px;
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

    .alert-info {
      background-color: #d1ecf1;
      border: 2px solid #17a2b8;
    }

    .alert h3 {
      margin-top: 0;
      color: #0c5460;
    }

    .alert ul {
      margin: 1rem 0 0 0;
      line-height: 1.8;
    }

    .status-card {
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 2rem;
      border: 2px solid #dee2e6;
    }

    .status-card.connected {
      background: #d4edda;
      border-color: #28a745;
    }

    .connection-status {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .icon {
      font-size: 2rem;
    }

    .demo-section {
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

    .explanation {
      background: white;
      padding: 1rem;
      border-radius: 4px;
      margin-top: 1rem;
      border-left: 4px solid #17a2b8;
    }

    .explanation ul {
      margin: 0.5rem 0 0 1.5rem;
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

    .comparison-table {
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 2rem;
      border: 2px solid #6c757d;
      overflow-x: auto;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      background: white;
      border-radius: 4px;
      overflow: hidden;
    }

    th, td {
      padding: 0.75rem;
      text-align: left;
      border-bottom: 1px solid #dee2e6;
    }

    th {
      background: #343a40;
      color: white;
      font-weight: bold;
    }

    th.bad {
      background: #dc3545;
    }

    th.good {
      background: #28a745;
    }

    tr:last-child td {
      border-bottom: none;
    }

    tr:hover {
      background: #f8f9fa;
    }

    .verdict {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 2rem;
      border-radius: 8px;
      margin-bottom: 2rem;
    }

    .verdict h2 {
      margin-top: 0;
      font-size: 2rem;
      text-align: center;
    }

    .verdict-content {
      background: rgba(255, 255, 255, 0.1);
      padding: 1.5rem;
      border-radius: 4px;
      backdrop-filter: blur(10px);
    }

    .verdict-content h3 {
      margin-top: 1.5rem;
      font-size: 1.3rem;
    }

    .verdict-content h3:first-child {
      margin-top: 0;
    }

    .verdict-content ul {
      line-height: 1.8;
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
export class PageWithServiceBComponent implements OnInit {
  wsConnected = false;
  messages: any[] = [];

  constructor(private websocketService: WebsocketService) {
    console.log('🟢 [SERVICE B] Constructor llamado');
  }

  ngOnInit() {
    console.log('🟢 [SERVICE B] ngOnInit - Componente renderizado inmediatamente');
    
    // Verificar si ya hay conexión existente
    this.wsConnected = this.websocketService.isConnected();
    
    if (this.wsConnected) {
      console.log('♻️ [SERVICE B] Reutilizando conexión WebSocket existente (singleton)');
      console.log('✅ [SERVICE B] Sin overhead de reconexión');
    } else {
      console.log('🔄 [SERVICE B] Iniciando nueva conexión...');
    }
    
    // Suscribirse a los mensajes
    // takeUntilDestroyed() limpia automáticamente la suscripción cuando el componente se destruye
    this.websocketService.connectWebsocketNonBlocking()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (message) => {
          this.messages.push(message);
          
          if (message.type === 'connection' && message.data.status === 'connected') {
            this.wsConnected = true;
            console.log('✅ [SERVICE B] WebSocket conectado');
          }
        },
        error: (error) => {
          console.error('❌ [SERVICE B] Error en WebSocket:', error);
        }
      });
  }

  sendTestMessage() {
    console.log('🟢 [SERVICE B] Enviando mensaje...');
    this.websocketService.sendMessage({
      type: 'test',
      from: 'service-b-component',
      message: 'Hola desde Service B Component',
      timestamp: new Date().toISOString()
    });
  }

  navigateToA() {
    window.location.href = '/socket_service_a';
  }
}

