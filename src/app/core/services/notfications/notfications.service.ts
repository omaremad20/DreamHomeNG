import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotficationsService {

  private baseUrl = 'https://grad-project-seven.vercel.app/api/notification';

  constructor(private http: HttpClient) {}

  // 1️⃣ إضافة إشعار جديد
  addNotification(userId: string, message: string): Observable<any> {
    const body = { userId, message };
    return this.http.post(`${this.baseUrl}/add`, body);
  }

  // 2️⃣ جلب إشعار واحد
  getNotification(notificationId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${notificationId}`);
  }

  // 3️⃣ جلب كل إشعارات مستخدم
  getUserNotifications(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/user/${userId}`);
  }

  // 4️⃣ حذف إشعار
  deleteNotification(notificationId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${notificationId}`);
  }
}
