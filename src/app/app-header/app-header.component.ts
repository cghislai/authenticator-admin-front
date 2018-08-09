import {Component, OnInit} from '@angular/core';
import {ProviderInfoService} from '../provider-info.service';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'auth-app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss'],
})
export class AppHeaderComponent implements OnInit {

  providerName: Observable<string>;

  constructor(private providerInfoService: ProviderInfoService) {
  }

  ngOnInit() {
    this.providerName = this.providerInfoService.fetchProviderInfo()
      .pipe(map(info => info.name));
  }

}
