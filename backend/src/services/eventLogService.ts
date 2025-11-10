import { query } from '../database';

export interface EventLogInput {
  eventType: string;
  entityType?: string;
  entityId?: number;
  userId?: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  status?: 'success' | 'failed';
  errorMessage?: string;
}

export interface EventLog {
  id: number;
  event_type: string;
  entity_type?: string;
  entity_id?: number;
  user_id?: string;
  metadata?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  status: 'success' | 'failed';
  error_message?: string;
  created_at: string;
}

export class EventLogService {
  async logEvent(input: EventLogInput): Promise<EventLog> {
    const {
      eventType,
      entityType,
      entityId,
      userId,
      metadata,
      ipAddress,
      userAgent,
      status = 'success',
      errorMessage
    } = input;

    const result = await query(
      `INSERT INTO event_logs (
        event_type,
        entity_type,
        entity_id,
        user_id,
        metadata,
        ip_address,
        user_agent,
        status,
        error_message
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [
        eventType,
        entityType || null,
        entityId || null,
        userId || null,
        metadata ? JSON.stringify(metadata) : null,
        ipAddress || null,
        userAgent || null,
        status,
        errorMessage || null
      ]
    );

    return result.rows[0] as EventLog;
  }

  async getEventsByType(eventType: string, limit: number = 50, offset: number = 0): Promise<EventLog[]> {
    const result = await query(
      `SELECT * FROM event_logs
       WHERE event_type = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [eventType, limit, offset]
    );

    return result.rows as EventLog[];
  }

  async getEventsByEntity(entityType: string, entityId: number, limit: number = 50): Promise<EventLog[]> {
    const result = await query(
      `SELECT * FROM event_logs
       WHERE entity_type = $1 AND entity_id = $2
       ORDER BY created_at DESC
       LIMIT $3`,
      [entityType, entityId, limit]
    );

    return result.rows as EventLog[];
  }

  async getEventsByDateRange(startDate: Date, endDate: Date): Promise<EventLog[]> {
    const result = await query(
      `SELECT * FROM event_logs
       WHERE created_at >= $1 AND created_at <= $2
       ORDER BY created_at DESC`,
      [startDate.toISOString(), endDate.toISOString()]
    );

    return result.rows as EventLog[];
  }

  async getEventStats(eventType?: string): Promise<Record<string, any>> {
    let baseQuery = `SELECT event_type, status, COUNT(*) as count
       FROM event_logs`;

    const params: any[] = [];

    if (eventType) {
      baseQuery += ` WHERE event_type = $1`;
      params.push(eventType);
    }

    baseQuery += ` GROUP BY event_type, status ORDER BY event_type`;

    const result = await query(baseQuery, params);

    return result.rows;
  }

  async cleanOldEvents(daysOld: number = 30): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const result = await query(
      `DELETE FROM event_logs WHERE created_at < $1`,
      [cutoffDate.toISOString()]
    );

    return result.rowCount || 0;
  }
}

export const eventLogService = new EventLogService();
