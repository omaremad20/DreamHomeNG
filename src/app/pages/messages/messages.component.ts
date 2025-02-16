import { AuthService } from './../../core/services/Auth/auth.service';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ChatService } from '../../core/services/chat/chat.service';
import { Chat } from '../../core/interfaces/chats';
import { Subscription } from 'rxjs';
import { RouterLink } from '@angular/router';
import { ReviewsService } from '../../core/services/reviews/reviews.service';
import { NotficationsService } from '../../core/services/notfications/notfications.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css',
  imports: [RouterLink]
})
export class MessagesComponent implements OnInit, OnDestroy {
  userId!: string;
  AllChats: Chat[] = [];
  showNoChatsDiv = false;
  callingApi: Subscription | null = null;
  userRole!: string;
  isLoading = true;
  hasPreviousRequest = false;

  private _ChatService = inject(ChatService);
  private _AuthService = inject(AuthService);
  private _ReviewsService = inject(ReviewsService);
  private __NotficationsService = inject(NotficationsService)
  ngOnInit(): void {
    this.userId = this._AuthService.getUserId()!;
    this.userRole = this._AuthService.getRole()!;

    this.callingApi = this._ChatService.getAllChats(this.userId).subscribe({
      next: (res) => {
        this.AllChats = res.chats;
        this.isLoading = false;

        if (this.AllChats.length === 0) {
          this.showNoChatsDiv = true;
        } else {
          this.checkPreviousRequests();
        }
      },
      error: (err) => {
        this.isLoading = false;
        if (err?.error?.message === 'No chats found for this user') {
          this.showNoChatsDiv = true;
        }
      }
    });
  }

  // التحقق من وجود طلب سابق
  checkPreviousRequests() {
    const chat = this.AllChats.find(chat => chat.user2._id === this.userId);
    if (chat) {
      const customerId = chat.user1._id;

      this._ReviewsService.getAllReviewsForUser(this.userId).subscribe({
        next: (reviews) => {
          this.hasPreviousRequest = reviews.some((review: any) =>
            review.customerId === customerId && review.employeeId === this.userId
          );
        },
        error: (err) => {
          console.error('Failed to fetch reviews:', err);
        }
      });
    }
  }

  sendReviewRequest() {
    const senderId = this.userId;
    const chat = this.AllChats.find(chat => chat.user2._id === senderId);

    if (chat) {
      const customerId = chat.user1._id;

      // 1️⃣ إرسال طلب المراجعة
      this._ReviewsService.sendRequestReview(senderId, customerId).subscribe({
        next: () => {
          console.log('Review request sent successfully!');
          this.hasPreviousRequest = true;

          // 2️⃣ إضافة إشعار للعميل
          const message = 'تم إرسال طلب مراجعة جديد من أحد العاملين.';
          this.__NotficationsService.addNotification(customerId, message).subscribe({
            next: () => {
              console.log('Notification added successfully!');
            },
            error: (err) => {
              console.error('Failed to add notification:', err);
            }
          });

        },
        error: (err) => {
          console.error('Failed to send review request:', err);
        }
      });
    } else {
      console.warn('No valid chat found to determine customer ID.');
    }
  }


  ngOnDestroy(): void {
    if (this.callingApi) {
      this.callingApi.unsubscribe();
      this.callingApi = null;
    }
  }
}
