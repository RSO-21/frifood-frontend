import { Injectable, inject } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface Notification {
  id: number;
  user_id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = environment.notificationServiceUrl;

  list(userId: string, unreadOnly = false) {
    return this.http.get<Notification[]>(`${this.API_URL}/notifications`, {
      params: {
        user_id: userId,
        unread_only: unreadOnly,
      },
    });
  }

  markRead(notificationId: number) {
    return this.http.post<Notification>(`${this.API_URL}/notifications/${notificationId}/read`, {});
  }
}
