import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserProfileService } from '../../core/services/UserProfile/user-profile.service';
import { UserProfile } from '../../core/interfaces/userprofile';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-my-profile',
  imports: [RouterLink],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.css'
})
export class MyProfileComponent implements OnInit , OnDestroy {
  userProfile!: UserProfile;
  userName!:string ;
  isLoading = true;
  userRole!:string ;
  callingApi:Subscription | null = null ;
  constructor(private userProfileService: UserProfileService) {}
  ngOnInit(): void {
    const userId = sessionStorage.getItem('userId');
    if (userId) {
      this.callingApi = this.userProfileService.getUserProfile(userId).subscribe({
        next: (response) => {
          this.userProfile = response.user;
          this.userRole = response.user.role ;
          this.userName = response.user.firstName ;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('API Error:', error);
          this.isLoading = false;
        }

      }) ?? null;
    }
  }
  ngOnDestroy(): void {

    if(this.callingApi) {
      this.callingApi.unsubscribe() ;
      this.callingApi = null
    }
  }
}
