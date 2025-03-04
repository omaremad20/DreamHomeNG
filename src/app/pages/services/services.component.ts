import { Component, inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { IServices } from '../../core/interfaces/iservices';
import { RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { isPlatformBrowser } from '@angular/common';
import { SearchService } from '../../core/services/Search/search.service';
import { FilterServicesPipe } from '../../shared/pipes/FilterServices/filter-services.pipe';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-services',
  imports: [RouterLink , TranslatePipe ,FilterServicesPipe],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css'
})
export class ServicesComponent implements OnInit  {
  searchText = '';
  callingSearch!:Subscription ;
  servicesTS:string[] = [
    'PLUMBING' , 'PAINTING' , 'ELECTRICITY' , 'SATELLITE' , 'GYPSUM_BOARD' , 'CARPENTRY','INTERNET_NETWORKS'
    ,'ALUMETAL' , 'CURTAINS' , 'AIR_CONDITION' , 'HOME_APPLIANCES' , 'WOODEN_FLOORS'
  ];
  services: IServices[] = [
    { image: './images/plumbingDiv.webp', job: 'PLUMBING', jobId: 'plumbing' },
    { image: './images/painting.webp', job: 'PAINTING', jobId: 'painting' },
    { image: './images/Electricity.webp', job: 'ELECTRICITY', jobId: 'electricity' },
    { image: './images/sat.webp', job: 'SATELLITE', jobId: 'satellite' },
    { image: './images/gypsumbord.webp', job: 'GYPSUM_BOARD', jobId: 'gypsum-board' },
    { image: './images/Carpentry.webp', job: 'CARPENTRY', jobId: 'carpentry' },
    { image: './images/internet.webp', job: 'INTERNET_NETWORKS', jobId: 'internet-networks' },
    { image: './images/Alumetal.webp', job: 'ALUMETAL', jobId: 'alumetal' },
    { image: './images/curtains.webp', job: 'CURTAINS', jobId: 'curtains' },
    { image: './images/Air-Condition-Unit.webp', job: 'AIR_CONDITION', jobId: 'air-condition' },
    { image: './images/appliens.webp', job: 'HOME_APPLIANCES', jobId: 'home-appliances' },
    { image: './images/woodenFlooring.webp', job: 'WOODEN_FLOORS', jobId: 'wooden-floors' }
  ];
  currentLang: string = 'en';
  private translate = inject(TranslateService) ;
  private _PLATFORM_ID = inject (PLATFORM_ID) ;
  constructor(private searchService: SearchService){}
  ngOnInit(): void {
    this.searchService.searchText$.subscribe(text => {
      this.searchText = text;
    });

    if(isPlatformBrowser(this._PLATFORM_ID)) {
      this.currentLang = sessionStorage.getItem('language') || 'en' ;
      this.translate.setDefaultLang(this.currentLang) ;
      this.translate.use(this.currentLang) ;
    }
  }

}
