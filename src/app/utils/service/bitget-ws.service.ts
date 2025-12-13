import { Injectable, signal } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { environment } from '../../../environments/environment';

export interface BitgetKline {
  symbol: string;
  interval: string;
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface BitgetOrderBook {
  symbol: string;
  bids: [number, number][];  // [price, quantity]
  asks: [number, number][];
  timestamp: number;
}

interface BitgetSubscription {
  instType: string;
  channel: string;
  instId: string;
}

@Injectable({
  providedIn: 'root'
})
export class BitgetWebSocketService {
  private ws$: WebSocketSubject<any> | null = null;
  public connected = signal<boolean>(false);

  // Map of subscription keys to subjects
  private subscriptions = new Map<string, Subject<any>>();

  // Track active subscriptions for reconnection
  private activeSubscriptions = new Set<string>();

  constructor() {
    if (environment.features.enableBitgetDirectWS) {
      this.connect();
    }
  }

  /**
   * Connect to Bitget WebSocket
   */
  public connect(): void {
    if (this.ws$ && !this.ws$.closed) {
      this.log('Bitget WebSocket already connected');
      return;
    }

    this.log('Connecting to Bitget WebSocket...', environment.bitgetWsUrl);

    this.ws$ = webSocket({
      url: environment.bitgetWsUrl,
      openObserver: {
        next: () => {
          this.log('✅ Bitget WebSocket connected');
          this.connected.set(true);
          this.resubscribeAll();
        }
      },
      closeObserver: {
        next: () => {
          this.log('Bitget WebSocket disconnected');
          this.connected.set(false);
        }
      }
    });

    this.ws$.subscribe({
      next: (message) => this.handleMessage(message),
      error: (err) => this.error('Bitget WebSocket error:', err)
    });
  }

  /**
   * Disconnect from Bitget WebSocket
   */
  public disconnect(): void {
    this.log('Disconnecting from Bitget WebSocket...');

    if (this.ws$) {
      this.ws$.complete();
      this.ws$ = null;
    }

    this.connected.set(false);
    this.activeSubscriptions.clear();
  }

  /**
   * Subscribe to kline (candlestick) data
   * @param symbol - e.g., 'BTCUSDT'
   * @param interval - e.g., '1h', '4h', '30m'
   */
  public subscribeKline(symbol: string, interval: string): Observable<BitgetKline> {
    const normalizedInterval = this.normalizeInterval(interval);
    const channel = `candle${normalizedInterval}`;
    const subKey = `${channel}:${symbol}`;

    if (!this.subscriptions.has(subKey)) {
      this.subscriptions.set(subKey, new Subject<BitgetKline>());

      const subscription: BitgetSubscription = {
        instType: 'USDT-FUTURES',
        channel: channel,
        instId: symbol
      };

      this.subscribe(subscription, subKey);
    }

    return this.subscriptions.get(subKey)!.asObservable();
  }

  /**
   * Subscribe to order book data
   * @param symbol - e.g., 'BTCUSDT'
   * @param depth - Order book depth (5, 15, 50)
   */
  public subscribeOrderBook(symbol: string, depth: number = 15): Observable<BitgetOrderBook> {
    const channel = `books${depth}`;
    const subKey = `${channel}:${symbol}`;

    if (!this.subscriptions.has(subKey)) {
      this.subscriptions.set(subKey, new Subject<BitgetOrderBook>());

      const subscription: BitgetSubscription = {
        instType: 'USDT-FUTURES',
        channel: channel,
        instId: symbol
      };

      this.subscribe(subscription, subKey);
    }

    return this.subscriptions.get(subKey)!.asObservable();
  }

  /**
   * Unsubscribe from a channel
   */
  public unsubscribe(symbol: string, channel: string): void {
    const subKey = `${channel}:${symbol}`;

    if (this.subscriptions.has(subKey)) {
      this.subscriptions.get(subKey)!.complete();
      this.subscriptions.delete(subKey);
      this.activeSubscriptions.delete(subKey);

      this.send({
        op: 'unsubscribe',
        args: [{
          instType: 'USDT-FUTURES',
          channel: channel,
          instId: symbol
        }]
      });

      this.log(`Unsubscribed from ${subKey}`);
    }
  }

  /**
   * Send subscription request to Bitget
   */
  private subscribe(subscription: BitgetSubscription, subKey: string): void {
    this.send({
      op: 'subscribe',
      args: [subscription]
    });

    this.activeSubscriptions.add(subKey);
    this.log(`Subscribed to ${subKey}`);
  }

  /**
   * Resubscribe to all active subscriptions after reconnection
   */
  private resubscribeAll(): void {
    this.activeSubscriptions.forEach(subKey => {
      const [channel, symbol] = subKey.split(':');

      const subscription: BitgetSubscription = {
        instType: 'USDT-FUTURES',
        channel: channel,
        instId: symbol
      };

      this.send({
        op: 'subscribe',
        args: [subscription]
      });

      this.log(`Resubscribed to ${subKey}`);
    });
  }

  /**
   * Handle incoming WebSocket message
   */
  private handleMessage(message: any): void {
    // Handle subscription confirmation
    if (message.event === 'subscribe') {
      this.log('Subscription confirmed:', message);
      return;
    }

    // Handle data messages
    if (message.action === 'snapshot' || message.action === 'update') {
      const channel = message.arg?.channel;
      const symbol = message.arg?.instId;

      if (!channel || !symbol) return;

      const subKey = `${channel}:${symbol}`;

      if (this.subscriptions.has(subKey)) {
        const data = this.parseData(message, channel);
        if (data) {
          this.subscriptions.get(subKey)!.next(data);
        }
      }
    }
  }

  /**
   * Parse Bitget data format to our format
   */
  private parseData(message: any, channel: string): BitgetKline | BitgetOrderBook | null {
    const data = message.data?.[0];
    if (!data) return null;

    // Parse kline data
    if (channel.startsWith('candle')) {
      return {
        symbol: message.arg.instId,
        interval: this.denormalizeInterval(channel.replace('candle', '')),
        timestamp: parseInt(data[0]),
        open: parseFloat(data[1]),
        high: parseFloat(data[2]),
        low: parseFloat(data[3]),
        close: parseFloat(data[4]),
        volume: parseFloat(data[5])
      };
    }

    // Parse order book data
    if (channel.startsWith('books')) {
      return {
        symbol: message.arg.instId,
        bids: data.bids?.map((b: string[]) => [parseFloat(b[0]), parseFloat(b[1])]) || [],
        asks: data.asks?.map((a: string[]) => [parseFloat(a[0]), parseFloat(a[1])]) || [],
        timestamp: parseInt(data.ts || Date.now())
      };
    }

    return null;
  }

  /**
   * Normalize interval format for Bitget API
   * '1h' -> '1H', '4h' -> '4H', '30m' -> '30m'
   */
  private normalizeInterval(interval: string): string {
    if (interval.endsWith('h')) {
      return interval.replace('h', 'H');
    }
    return interval;
  }

  /**
   * Denormalize interval back to our format
   * '1H' -> '1h', '30m' -> '30m'
   */
  private denormalizeInterval(interval: string): string {
    if (interval.endsWith('H')) {
      return interval.replace('H', 'h');
    }
    return interval;
  }

  /**
   * Send message to Bitget WebSocket
   */
  private send(message: any): void {
    if (!this.connected()) {
      this.error('Cannot send: Bitget WebSocket not connected');
      return;
    }

    this.log('Sending to Bitget:', message);
    this.ws$?.next(message);
  }

  /**
   * Debug logging
   */
  private log(...args: any[]): void {
    if (environment.features.enableDebugMode) {
      console.log('[BitgetWebSocketService]', ...args);
    }
  }

  /**
   * Error logging
   */
  private error(...args: any[]): void {
    console.error('[BitgetWebSocketService]', ...args);
  }
}
