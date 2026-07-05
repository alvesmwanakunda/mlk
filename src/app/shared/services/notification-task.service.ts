// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class NotificationTaskService {

//   constructor() { }
// }

// notification-task.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';

export interface NotificationTask {
  _id: string;
  proprieteTache: any;
  personneAssignee: any;
  date: string;
  tache: any;
  isLire: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  message: T;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationTaskService {
  private socket?: Socket;
  private notificationsSubject = new BehaviorSubject<NotificationTask[]>([]);

  notifications$ = this.notificationsSubject.asObservable();

  constructor(private http: HttpClient) {}

  getUnreadNotifications(): Observable<ApiResponse<NotificationTask[]>> {
    return this.http.get<ApiResponse<NotificationTask[]>>(
      `${environment.BASE_API_URL}/notificationstask`
    );
  }

  markAsRead(id: string): Observable<ApiResponse<NotificationTask>> {
    return this.http.patch<ApiResponse<NotificationTask>>(
      `${environment.BASE_API_URL}/notificationstask/${id}/read`,
      {}
    );
  }

  loadNotifications(): void {
    this.getUnreadNotifications().subscribe({
      next: (res) => {
        if (res.success) {
          this.notificationsSubject.next(
            res.message.filter((notification) => !notification.isLire)
          );
        }
      }
    });
  }

  connectSocket(currentUserId: string): void {
    if (this.socket) return;

    this.socket = io(environment.BASE_SOCKET || environment.BASE_API_URL, {
      transports: ['websocket']
    });

    this.socket.on('new_notification_task', (notification: NotificationTask) => {
      if (!this.isForCurrentUser(notification, currentUserId)) return;

      this.upsertNotification(notification);
    });

    this.socket.on('update_notification_task', (notification: NotificationTask) => {
      if (!this.isForCurrentUser(notification, currentUserId)) return;

      this.upsertNotification(notification);
    });

    this.socket.on('notification_task_read', (notification: NotificationTask) => {
      const current = this.notificationsSubject.value;
      this.notificationsSubject.next(
        current.filter((item) => item._id !== notification._id)
      );
    });
  }

  read(notification: NotificationTask): void {
    this.markAsRead(notification._id).subscribe({
      next: (res) => {
        if (res.success) {
          const current = this.notificationsSubject.value;
          this.notificationsSubject.next(
            current.filter((item) => item._id !== notification._id)
          );
        }
      }
    });
  }

  private isForCurrentUser(notification: NotificationTask, currentUserId: string): boolean {
    const assignee = notification.personneAssignee;
    const assigneeId = typeof assignee === 'string' ? assignee : assignee?._id;

    return String(assigneeId) === String(currentUserId);
  }

  private upsertNotification(notification: NotificationTask): void {
    const current = this.notificationsSubject.value.filter(
      (item) => item._id !== notification._id
    );

    if (notification.isLire) {
      this.notificationsSubject.next(current);
      return;
    }

    this.notificationsSubject.next([notification, ...current]);
  }
}
