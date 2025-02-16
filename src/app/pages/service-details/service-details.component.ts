import { ServicesCallServiceService } from './../../core/services/servicesCallService/services-call-service.service';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { EmployessService } from '../../core/services/employees/employess.service';
import { IEmployee } from '../../core/interfaces/iemployee';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
// import { console } from 'inspector';


@Component({
  selector: 'app-service-details',
  imports: [RouterLink],
  templateUrl: './service-details.component.html',
  styleUrl: './service-details.component.css'
})
export class ServiceDetailsComponent implements OnInit , OnDestroy{
  private readonly _ActivatedRoute = inject (ActivatedRoute)
  constructor(private _ServicesCallServiceService: ServicesCallServiceService) {}
  private _EmployessService = inject(EmployessService) ;
  employeesData!:IEmployee[] ;
  callingApi:Subscription | null = null;;
  jobId!:string ;
  jobTitle!:string ;
  isLoading:boolean = true ;
  showNoChatsDiv = false;
  ngOnInit(): void {
    this._ActivatedRoute.paramMap.subscribe( {
      next : (param) => {
        this.jobId = param.get('jobId') ! ;

      }
    })
    this.callingApi = this._EmployessService.getEmployess(this.jobId).subscribe({
      next : (res) => {
        this.jobTitle = res.employees.job ;
        this.employeesData = res.employees ;
        this.isLoading = false ;
        if (this.employeesData.length === 0) {
          this.showNoChatsDiv = true;
        }
      } ,
      error: (err) => {
        this.isLoading = false;
        if (err?.error?.message === 'No employees found for this service') {
          this.showNoChatsDiv = true;
        }
      }
    }) ?? null
  }
  ngOnDestroy(): void {
    if(this.callingApi) {
      this.callingApi.unsubscribe() ;
      this.callingApi = null ;
    }
  }
}
