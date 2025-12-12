import { Injectable, signal } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface WebSocketMessage {
  topic: string;
  payload: any;
}

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket: WebSocket | null = null;
  private messageSubject = new Subject();
  public connected = signal(false);
  
  private reconnectAttempts = 0;
  private maxReconnectAttempts = environment.ws.maxReconnectAttempts;
  private reconnectInterval = environment.ws.reconnectInterval;

  connect(): void {
    if (!environment.features.enableWebSocket) {
      console.warn('WebSocket is disabled in environment');
      return;
    }

    if (this.socket?.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected');
      return;
    }

    try {
      this.socket = new WebSocket(environment.wsUrl);

      this.socket.onopen = () => {
        console.log('✅ WebSocket connected');
        this.connected.set(true);
        this.reconnectAttempts = 0;
      };

      this.socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          this.messageSubject.next(message);
        } catch (error) {
          console.error('Failed to parse WebSocket message', error);
        }
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.connected.set(false);
      };

      this.socket.onclose = () => {
        console.log('WebSocket closed');
        this.connected.set(false);
        this.attemptReconnect();
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection', error);
    }
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.connect();
      }, this.reconnectInterval);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  subscribe(topic: string): Observable<WebSocketMessage> {
    return new Observable(observer => {
        const subscription = this.messageSubject.subscribe((message: unknown) => {
          const wsMessage = message as WebSocketMessage;
          if (wsMessage.topic === topic) {
            observer.next(wsMessage.payload);
          }
        });

      return () => subscription.unsubscribe();
    });
  }

  send(message: any): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected');
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
      this.connected.set(false);
    }
  }
}
