import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/Auth/auth.service';
import { NotficationsService } from '../../core/services/notfications/notfications.service';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-messages-and-notfications',
  imports: [RouterLink],
  templateUrl: './messages-and-notfications.component.html',
  styleUrl: './messages-and-notfications.component.css'
})
export class MessagesAndNotficationsComponent implements OnInit , OnDestroy{
  userId!: string;
  userRole!: string;
  notificationCount: number = 0;
  callingNotfications!:Subscription ;
  private _AuthService = inject(AuthService);
  private _NotficationsService = inject(NotficationsService);

  ngOnInit(): void {
    this.userId = this._AuthService.getUserId()!;
    this.userRole = this._AuthService.getRole()!;
    this.getNotifications();
  }

  getNotifications() {
    this.callingNotfications = this._NotficationsService.getUserNotifications(this.userId).subscribe({
      next: (notifications) => {
        console.log(notifications);

        this.notificationCount = notifications.notifications.length;
        console.log(this.notificationCount);
      },
      error: (err) => {
        console.error('Failed to fetch notifications:', err);
      }
    });
  }
  ngOnDestroy(): void {
    this.callingNotfications.unsubscribe();
  }
}
