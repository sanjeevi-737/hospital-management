import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditService } from './audit.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AuditInterceptor.name);
  private readonly trackedMethods = ['POST', 'PATCH', 'PUT', 'DELETE'];

  constructor(private readonly auditService: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, user, ip, headers } = request;

    if (!this.trackedMethods.includes(method)) {
      return next.handle();
    }

    const action = this.mapMethodToAction(method);
    const entity = this.extractEntityFromUrl(url);

    return next.handle().pipe(
      tap(async (response) => {
        try {
          const entityId = response?.id || response?.data?.id || null;

          await this.auditService.log({
            userId: user?.sub || user?.id,
            action,
            entity,
            entityId,
            newValues: method === 'DELETE' ? undefined : body,
            ipAddress: ip,
            userAgent: headers['user-agent'],
          });
        } catch (error) {
          this.logger.error('Audit logging failed:', (error as Error).message);
        }
      }),
    );
  }

  private mapMethodToAction(method: string): string {
    switch (method) {
      case 'POST':
        return 'CREATE';
      case 'PATCH':
      case 'PUT':
        return 'UPDATE';
      case 'DELETE':
        return 'DELETE';
      default:
        return method;
    }
  }

  private extractEntityFromUrl(url: string): string {
    const segments = url.split('/').filter(Boolean);
    const apiIndex = segments.indexOf('api');
    if (apiIndex !== -1 && segments[apiIndex + 2]) {
      return segments[apiIndex + 2];
    }
    return segments[segments.length - 1] || 'unknown';
  }
}
