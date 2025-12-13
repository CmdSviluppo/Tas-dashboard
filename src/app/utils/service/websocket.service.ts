import { Injectable, signal } from '@angular/core';
import { Observable, Subject, timer, EMPTY } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { retry, tap, delayWhen, retryWhen } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export type ConnectionStatus = 'CONNECTED' | 'DISCONNECTED' | 'CONNECTING' | 'RECONNECTING';

interface WebSocketMessage<T = any> {
  topic: string;
  payload: T;
  timestamp?: string;
}

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private ws$: WebSocketSubject<any> | null = null;
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = environment.ws.maxReconnectAttempts;
  private readonly reconnectInterval = environment.ws.reconnectInterval;
  private pingIntervalId: any;

  // Reactive state with signals
  public connected = signal<boolean>(false);
  public connectionStatus = signal<ConnectionStatus>('DISCONNECTED');

  // Observable for connection status changes
  private connectionStatusSubject = new Subject<ConnectionStatus>();
  public connectionStatus$ = this.connectionStatusSubject.asObservable();

  // Topic subscriptions map
  private topicSubscriptions = new Map<string, Subject<any>>();

  constructor() {
    if (environment.features.enableWebSocket) {
      this.connect();
    }
  }

  /**
   * Establish WebSocket connection
   */
  public connect(): void {
    if (this.ws$ && !this.ws$.closed) {
      this.log('WebSocket already connected');
      return;
    }

    this.updateConnectionStatus('CONNECTING');
    this.log('Connecting to WebSocket...', environment.wsUrl);

    this.ws$ = webSocket({
      url: environment.wsUrl,
      openObserver: {
        next: () => {
          this.onConnectionOpen();
        }
      },
      closeObserver: {
        next: () => {
          this.onConnectionClose();
        }
      }
    });

    // Subscribe to incoming messages
    this.ws$.pipe(
      retryWhen(errors =>
        errors.pipe(
          delayWhen(() => {
            const delay = this.calculateReconnectDelay();
            this.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts + 1}/${this.maxReconnectAttempts})`);
            return timer(delay);
          }),
          tap(() => {
            this.reconnectAttempts++;
            if (this.reconnectAttempts >= this.maxReconnectAttempts) {
              this.error('Max reconnection attempts reached');
              this.updateConnectionStatus('DISCONNECTED');
              throw new Error('Max reconnection attempts reached');
            }
            this.updateConnectionStatus('RECONNECTING');
          })
        )
      )
    ).subscribe({
      next: (message) => this.handleIncomingMessage(message),
      error: (err) => this.error('WebSocket error:', err),
      complete: () => this.log('WebSocket connection closed')
    });
  }

  /**
   * Disconnect WebSocket
   */
  public disconnect(): void {
    this.log('Disconnecting WebSocket...');
    this.stopPingInterval();

    if (this.ws$) {
      this.ws$.complete();
      this.ws$ = null;
    }

    this.updateConnectionStatus('DISCONNECTED');
    this.connected.set(false);
  }

  /**
   * Subscribe to a specific topic
   */
  public subscribe<T>(topic: string): Observable<T> {
    if (!this.topicSubscriptions.has(topic)) {
      this.topicSubscriptions.set(topic, new Subject<T>());
      this.log(`Subscribed to topic: ${topic}`);

      // Send subscription message to backend
      this.send({
        type: 'SUBSCRIBE',
        topic: topic
      });
    }

    return this.topicSubscriptions.get(topic)!.asObservable();
  }

  /**
   * Unsubscribe from a topic
   */
  public unsubscribe(topic: string): void {
    if (this.topicSubscriptions.has(topic)) {
      this.topicSubscriptions.get(topic)!.complete();
      this.topicSubscriptions.delete(topic);
      this.log(`Unsubscribed from topic: ${topic}`);

      // Send unsubscribe message to backend
      this.send({
        type: 'UNSUBSCRIBE',
        topic: topic
      });
    }
  }

  /**
   * Send message to WebSocket server
   */
  public send(message: any): void {
    if (!this.isConnected()) {
      this.error('Cannot send message: WebSocket not connected');
      return;
    }

    this.log('Sending message:', message);
    this.ws$?.next(message);
  }

  /**
   * Check if WebSocket is connected
   */
  public isConnected(): boolean {
    return this.connected();
  }

  /**
   * Handle connection opened
   */
  private onConnectionOpen(): void {
    this.log('✅ WebSocket connected successfully');
    this.reconnectAttempts = 0;
    this.connected.set(true);
    this.updateConnectionStatus('CONNECTED');
    this.startPingInterval();

    // Resubscribe to all topics after reconnection
    this.resubscribeToTopics();
  }

  /**
   * Handle connection closed
   */
  private onConnectionClose(): void {
    this.log('WebSocket connection closed');
    this.connected.set(false);
    this.updateConnectionStatus('DISCONNECTED');
    this.stopPingInterval();
  }

  /**
   * Handle incoming WebSocket message
   */
  private handleIncomingMessage(message: WebSocketMessage): void {
    this.log('Received message:', message);

    // Handle pong response
    if (message.topic === 'pong') {
      this.log('Received pong');
      return;
    }

    // Route message to appropriate topic subscription
    if (message.topic && this.topicSubscriptions.has(message.topic)) {
      this.topicSubscriptions.get(message.topic)!.next(message.payload);
    }
  }

  /**
   * Resubscribe to all topics after reconnection
   */
  private resubscribeToTopics(): void {
    this.topicSubscriptions.forEach((_, topic) => {
      this.send({
        type: 'SUBSCRIBE',
        topic: topic
      });
      this.log(`Resubscribed to topic: ${topic}`);
    });
  }

  /**
   * Start ping interval for keep-alive
   */
  private startPingInterval(): void {
    this.stopPingInterval();

    this.pingIntervalId = setInterval(() => {
      if (this.isConnected()) {
        this.send({ type: 'ping' });
        this.log('Sent ping');
      }
    }, environment.ws.pingInterval);
  }

  /**
   * Stop ping interval
   */
  private stopPingInterval(): void {
    if (this.pingIntervalId) {
      clearInterval(this.pingIntervalId);
      this.pingIntervalId = null;
    }
  }

  /**
   * Calculate reconnect delay with exponential backoff
   */
  private calculateReconnectDelay(): number {
    const baseDelay = this.reconnectInterval;
    const backoffMultiplier = 1.5;
    return Math.min(baseDelay * Math.pow(backoffMultiplier, this.reconnectAttempts), 30000);
  }

  /**
   * Update connection status and notify observers
   */
  private updateConnectionStatus(status: ConnectionStatus): void {
    this.connectionStatus.set(status);
    this.connectionStatusSubject.next(status);
  }

  /**
   * Debug logging (only if enabled)
   */
  private log(...args: any[]): void {
    if (environment.features.enableDebugMode) {
      console.log('[WebSocketService]', ...args);
    }
  }

  /**
   * Error logging (always enabled)
   */
  private error(...args: any[]): void {
    console.error('[WebSocketService]', ...args);
  }
}
