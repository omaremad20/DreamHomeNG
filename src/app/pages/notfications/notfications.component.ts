import { Notfications } from './../../core/interfaces/notfications';
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { NotficationsService } from '../../core/services/notfications/notfications.service';
import { AuthService } from '../../core/services/Auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notfications',
  templateUrl: './notfications.component.html',
  styleUrl: './notfications.component.css'
})
export class NotficationsComponent implements OnInit, OnDestroy {
  private _NotficationsService = inject(NotficationsService);
  private _AuthService = inject(AuthService);
  callingAllNotfications: Subscription = new Subscription();
  userId!: string;
  NotficationsRes!: Notfications[]
  isNotfaied:boolean = true ;
  ngOnInit(): void {
    this.userId = this._AuthService.getUserId()!;
    const subscription = this._NotficationsService.getUserNotifications(this.userId).subscribe({
      next: (res) => {
        this.NotficationsRes = res.notifications;
        console.log(this.NotficationsRes) ;
      },
      error: (err) => {
        this.isNotfaied = false ;
        console.error('Error fetching notifications:', err);
      }
    });
    this.callingAllNotfications.add(subscription);
  }

  deleteNotification(notificationId: string): void {
    this._NotficationsService.deleteNotification(notificationId).subscribe({
      next: () => {
        this.NotficationsRes = this.NotficationsRes.filter(n => n._id !== notificationId);
      },
      error: (err) => {
        console.error('Failed to delete notification:', err);
      }
    });
  }

  ngOnDestroy(): void {
    this.callingAllNotfications.unsubscribe();
  }
}
