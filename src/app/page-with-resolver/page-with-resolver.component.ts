import { Component, OnInit } from '@angular/core';
import { WebsocketService } from '../websocket.service';

/**
 * ❌❌ OPCIÓN 2: COMPONENTE CON RESOLVER
 * 
 * DEMOSTRACIÓN DE PAIN POINTS:
 * - El usuario tuvo que ESPERAR antes de ver este componente
 * - Si el WebSocket tardó 5 segundos, el usuario vio NADA durante 5 segundos
 * - Core Web Vitals completamente destruidos
 * - Si hubiera fallado, el usuario NUNCA vería esta página
 */
@Component({
  selector: 'app-page-with-resolver',
  imports: [],
  template: `
    <div class="container">
      <h1>🟡 Opción 2: Resolver (MALA PRÁCTICA)</h1>
      
      <div class="alert alert-danger">
        <h3>💀 Pain Points Críticos:</h3>
        <ul>
          <li><strong>Navegación Bloqueada:</strong> Tuviste que esperar a que el WebSocket conectara ANTES de ver esto</li>
          <li><strong>UX Horrible:</strong> Pantalla en blanco mientras se conectaba</li>
          <li><strong>Core Web Vitals Destruidos:</strong> LCP, FCP, TBT todos aumentados dramáticamente</li>
          <li><strong>Sin Resiliencia:</strong> Si el servidor estuviera caído, NUNCA hubieras llegado aquí</li>
          <li><strong>Usuario Atrapado:</strong> En caso de fallo, te quedarías en la página anterior sin poder avanzar</li>
        </ul>
      </div>

      <div class="status-card success">
        <h3>🎉 ¡Finalmente Llegaste!</h3>
        <p>Pero ¿a qué costo?</p>
        <p class="highlight">
          <span class="status-connected">✅ WebSocket Conectado</span>
        </p>
        <p class="detail">
          Tiempo que esperaste antes de ver esta página: {{ navigationTime }}ms
        </p>
      </div>

      <div class="test-section">
        <h3>✅ Funcionalidad Disponible:</h3>
        <button (click)="sendTestMessage()">
          Enviar Mensaje de Prueba
        </button>
        <p class="info">
          Sí, el WebSocket está garantizado. Pero el precio fue muy alto.
        </p>
      </div>

      <div class="comparison">
        <h3>📊 Impacto Medido:</h3>
        <div class="metrics">
          <div class="metric bad">
            <strong>LCP (Largest Contentful Paint):</strong>
            <span>+{{ navigationTime }}ms ❌</span>
            <small>El contenido más grande se renderizó MUY tarde</small>
          </div>
          <div class="metric bad">
            <strong>FCP (First Contentful Paint):</strong>
            <span>+{{ navigationTime }}ms ❌</span>
            <small>El usuario vio pantalla en blanco</small>
          </div>
          <div class="metric bad">
            <strong>TBT (Total Blocking Time):</strong>
            <span>+{{ navigationTime }}ms ❌</span>
            <small>La navegación estuvo completamente bloqueada</small>
          </div>
          <div class="metric bad">
            <strong>Bounce Rate:</strong>
            <span>📈 Incrementado</span>
            <small>Usuarios abandonan si tarda >3 segundos</small>
          </div>
        </div>
      </div>

      <div class="disaster-scenario">
        <h3>💀 Escenario de Desastre:</h3>
        <p><strong>¿Qué pasaría si el servidor WebSocket estuviera caído?</strong></p>
        <ul>
          <li>❌ Timeout de 10 segundos esperando</li>
          <li>❌ Usuario viendo spinner infinito</li>
          <li>❌ Navegación CANCELADA al fallar el Resolver</li>
          <li>❌ Usuario ATRAPADO en la página anterior</li>
          <li>❌ NO puede acceder a esta página aunque el contenido esté disponible</li>
          <li>❌ Frustración total → Usuario cierra la app</li>
        </ul>
      </div>

      <div class="console-hint">
        <strong>💡 Revisa la consola</strong> para ver cuánto tiempo pasó entre la navegación y el render
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
      color: #ffc107;
      border-bottom: 3px solid #ffc107;
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
      line-height: 1.8;
    }

    .alert li {
      margin: 0.5rem 0;
    }

    .status-card {
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 2rem;
      border: 2px solid #dee2e6;
    }

    .status-card.success {
      background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
      border-color: #28a745;
    }

    .highlight {
      font-size: 1.2rem;
      margin: 1rem 0;
    }

    .status-connected {
      color: #28a745;
      font-weight: bold;
    }

    .detail {
      color: #721c24;
      font-weight: bold;
      font-size: 1.1rem;
      background: #fff3cd;
      padding: 1rem;
      border-radius: 4px;
      margin-top: 1rem;
      border: 2px solid #ffc107;
    }

    .test-section {
      background: #e7f3ff;
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 2rem;
      border: 2px solid #007bff;
    }

    button {
      background: #28a745;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      transition: background 0.3s;
    }

    button:hover {
      background: #218838;
    }

    .info {
      color: #004085;
      margin-top: 1rem;
      font-style: italic;
    }

    .comparison {
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 2rem;
      border: 2px solid #6c757d;
    }

    .metrics {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-top: 1rem;
    }

    .metric {
      padding: 1rem;
      border-radius: 4px;
      background: white;
    }

    .metric.bad {
      border-left: 4px solid #dc3545;
    }

    .metric strong {
      display: block;
      color: #dc3545;
      margin-bottom: 0.25rem;
    }

    .metric span {
      font-size: 1.2rem;
      font-weight: bold;
    }

    .metric small {
      display: block;
      color: #6c757d;
      margin-top: 0.25rem;
      font-size: 0.85rem;
    }

    .disaster-scenario {
      background: #343a40;
      color: white;
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 2rem;
      border: 3px solid #dc3545;
    }

    .disaster-scenario h3 {
      color: #ff6b6b;
      margin-top: 0;
    }

    .disaster-scenario ul {
      line-height: 2;
    }

    .disaster-scenario li {
      margin: 0.75rem 0;
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
export class PageWithResolverComponent implements OnInit {
  wsConnected = true; // Garantizado por el Resolver
  navigationTime = 0;
  private navigationStartTime = performance.now();

  constructor(private websocketService: WebsocketService) {
    console.log('🟡 [RESOLVER COMPONENT] Constructor llamado');
    console.log('✅ [RESOLVER COMPONENT] WebSocket está garantizado (el Resolver esperó)');
  }

  ngOnInit() {
    this.navigationTime = Math.round(performance.now() - this.navigationStartTime);
    console.log(`🟡 [RESOLVER COMPONENT] ngOnInit - Navegación completada en ${this.navigationTime}ms`);
    console.log(`📊 [RESOLVER COMPONENT] Impacto en Core Web Vitals:`);
    console.log(`   - LCP aumentado: +${this.navigationTime}ms ❌`);
    console.log(`   - FCP aumentado: +${this.navigationTime}ms ❌`);
    console.log(`   - TBT aumentado: +${this.navigationTime}ms ❌`);
    console.log(`💰 [RESOLVER COMPONENT] Precio pagado: Usuario esperó ${(this.navigationTime / 1000).toFixed(2)} segundos extra`);
  }

  sendTestMessage() {
    console.log('🟡 [RESOLVER COMPONENT] Enviando mensaje (garantizado funcionar)...');
    this.websocketService.sendMessage({
      type: 'test',
      from: 'resolver-component',
      message: 'Hola desde el Resolver Component'
    });
  }
}

