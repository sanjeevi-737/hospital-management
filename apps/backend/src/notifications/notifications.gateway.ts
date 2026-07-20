import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
  namespace: '/notifications',
})
export class NotificationsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationsGateway.name);
  private connectedUsers = new Map<string, string>();

  constructor(private readonly jwtService: JwtService) { }

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway initialized');
  }

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token || client.handshake.query.token;
      if (!token) {
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token as string);
      const userId = payload.sub;
      this.connectedUsers.set(userId, client.id);
      client.join(`user:${userId}`);

      this.logger.log(`Client connected: ${client.id} (User: ${userId})`);
    } catch (error) {
      this.logger.error('Connection error:', (error as Error).message);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    for (const [userId, socketId] of this.connectedUsers.entries()) {
      if (socketId === client.id) {
        this.connectedUsers.delete(userId);
        break;
      }
    }
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join')
  handleJoin(@ConnectedSocket() client: Socket, @MessageBody() data: { userId: string }) {
    const token = client.handshake.auth.token || client.handshake.query.token;
    if (!token) {
      return { event: 'error', data: 'Authentication required' };
    }

    try {
      const payload = this.jwtService.verify(token as string);
      const authenticatedUserId = payload.sub;

      if (data.userId !== authenticatedUserId) {
        return { event: 'error', data: 'Cannot join another user\'s room' };
      }

      client.join(`user:${data.userId}`);
      return { event: 'joined', data: `Joined room for user ${data.userId}` };
    } catch {
      return { event: 'error', data: 'Invalid token' };
    }
  }

  sendNotification(userId: string, notification: any) {
    this.server.to(`user:${userId}`).emit('notification', notification);
  }

  sendToHospital(hospitalId: string, event: string, data: any) {
    this.server.to(`hospital:${hospitalId}`).emit(event, data);
  }

  broadcastAppointmentUpdate(hospitalId: string, appointment: any) {
    this.server.to(`hospital:${hospitalId}`).emit('appointment:update', appointment);
  }

  broadcastLabResult(userId: string, labResult: any) {
    this.server.to(`user:${userId}`).emit('lab:result', labResult);
  }

  broadcastBillingUpdate(userId: string, billingUpdate: any) {
    this.server.to(`user:${userId}`).emit('billing:update', billingUpdate);
  }

  getConnectedUsers(): string[] {
    return Array.from(this.connectedUsers.keys());
  }

  isUserConnected(userId: string): boolean {
    return this.connectedUsers.has(userId);
  }
}
