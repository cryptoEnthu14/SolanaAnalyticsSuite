import WebSocket from 'ws';
import { Server } from 'http';
import { SolanaService } from './solanaService';

export class WebSocketService {
  private wss: WebSocket.Server;
  private solanaService: SolanaService;
  private updateInterval: NodeJS.Timeout | null = null;

  constructor(server: Server, solanaService: SolanaService) {
    this.wss = new WebSocket.Server({ server, path: '/ws' });
    this.solanaService = solanaService;
    this.initialize();
  }

  private initialize(): void {
    this.wss.on('connection', (ws: WebSocket) => {
      console.log('New WebSocket connection established');

      ws.on('message', (message: string) => {
        try {
          const data = JSON.parse(message.toString());
          this.handleMessage(ws, data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
          ws.send(
            JSON.stringify({
              type: 'error',
              message: 'Invalid message format',
            })
          );
        }
      });

      ws.on('close', () => {
        console.log('WebSocket connection closed');
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
      });

      // Send welcome message
      ws.send(
        JSON.stringify({
          type: 'connected',
          message: 'Connected to Solana Analytics WebSocket',
          timestamp: Date.now(),
        })
      );
    });

    // Start periodic updates
    this.startPeriodicUpdates();
  }

  private handleMessage(ws: WebSocket, data: any): void {
    const { type, payload } = data;

    switch (type) {
      case 'subscribe':
        this.handleSubscribe(ws, payload);
        break;
      case 'unsubscribe':
        this.handleUnsubscribe(ws, payload);
        break;
      case 'ping':
        ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
        break;
      default:
        ws.send(
          JSON.stringify({
            type: 'error',
            message: 'Unknown message type',
          })
        );
    }
  }

  private handleSubscribe(ws: WebSocket, payload: any): void {
    console.log('Subscribe request:', payload);
    ws.send(
      JSON.stringify({
        type: 'subscribed',
        channel: payload.channel,
        timestamp: Date.now(),
      })
    );
  }

  private handleUnsubscribe(ws: WebSocket, payload: any): void {
    console.log('Unsubscribe request:', payload);
    ws.send(
      JSON.stringify({
        type: 'unsubscribed',
        channel: payload.channel,
        timestamp: Date.now(),
      })
    );
  }

  private startPeriodicUpdates(): void {
    // Send updates every 10 seconds
    this.updateInterval = setInterval(() => {
      this.broadcastUpdate();
    }, 10000);
  }

  private async broadcastUpdate(): Promise<void> {
    try {
      // Example: broadcast recent blocks
      const blocks = await this.solanaService.getRecentBlocks(1);

      const message = JSON.stringify({
        type: 'update',
        channel: 'blocks',
        data: blocks[0],
        timestamp: Date.now(),
      });

      this.broadcast(message);
    } catch (error) {
      console.error('Error broadcasting update:', error);
    }
  }

  public broadcast(message: string): void {
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  public close(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    this.wss.close();
  }
}
