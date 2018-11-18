import {Component, OnInit} from '@angular/core';
import {BehaviorSubject, combineLatest, Observable} from 'rxjs';
import {ApplicationColumns} from '../application-column/application-columns';
import {LazyLoadEvent} from 'primeng/api';
import {debounceTime, delay, map, publishReplay, refCount, switchMap, tap} from 'rxjs/operators';
import {ApplicationService} from '../application.service';
import {myThrottleTime} from '../../../utils/throttle-time';
import {WsApplication, WsApplicationFilter, WsPagination, WsResultList} from '@charlyghislain/authenticator-admin-api';

@Component({
  selector: 'auth-application-list',
  templateUrl: './application-list.component.html',
  styleUrls: ['./application-list.component.scss'],
})
export class ApplicationListComponent implements OnInit {

  filter = new BehaviorSubject<WsApplicationFilter>(this.createInitialFilter());
  wsPagination = new BehaviorSubject<WsPagination>(this.crateInitialWsPagination());
  columns = new BehaviorSubject<ApplicationColumns.Column[]>(this.createInitialColumns());

  values: Observable<WsApplication[]>;
  totalCount: Observable<number>;
  loading: boolean;

  editingComponent: WsApplication;

  constructor(private applicationService: ApplicationService) {
  }

  ngOnInit() {
    const wsResultList: Observable<WsResultList<WsApplication>> = combineLatest(this.filter, this.wsPagination).pipe(
      debounceTime(0),
      myThrottleTime(1000),
      switchMap(results => this.loadvalues(results[0], results[1])),
      publishReplay(1), refCount(),
    );
    this.values = wsResultList.pipe(map(results => results.results));
    this.totalCount = wsResultList.pipe(map(results => results.totalCount));
  }

  onFilterChange(value: WsApplicationFilter) {
    this.filter.next(value);
  }

  onWsPaginationChanged(event: LazyLoadEvent) {
    const newWsPagination: WsPagination = {
      offset: event.first,
      length: event.rows,
    };
    this.wsPagination.next(newWsPagination);
  }

  onNewApplicationClick() {
    this.editingComponent = this.applicationService.createEmptyApplication();
  }

  onApplicationEdited(application: WsApplication) {
    this.applicationService.saveApplication(application)
      .subscribe(() => {
        this.editingComponent = null;
        this.reload();
      });
  }

  onApplicationEditCancel() {
    this.editingComponent = null;
  }

  onApplicationSelected(value: WsApplication) {
    this.editingComponent = value;
  }

  private createInitialFilter(): WsApplicationFilter {
    return {};
  }

  private crateInitialWsPagination(): WsPagination {
    return {
      offset: 0,
      length: 50,
    };
  }

  private createInitialColumns(): ApplicationColumns.Column[] {
    return [
      ApplicationColumns.ID,
      ApplicationColumns.NAME,
      ApplicationColumns.ENDPOINT_URL,
      ApplicationColumns.ACTIVE,
      ApplicationColumns.CREATION_DATE_TIME,
    ];
  }

  private loadvalues(filter: WsApplicationFilter, wsPagination: WsPagination) {
    this.loading = true;
    return this.applicationService.listApplications(filter, wsPagination).pipe(
      delay(0),
      tap(() => this.loading = false),
    );
  }

  private reload() {
    this.filter.next(this.filter.getValue());
  }
}