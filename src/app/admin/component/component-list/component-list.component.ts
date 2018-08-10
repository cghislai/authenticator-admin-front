import {Component, OnInit} from '@angular/core';
import {WsComponentFilter, WsPagination, WsResultList, WsApplicationComponent} from '@charlyghislain/core-web-api';
import {BehaviorSubject, combineLatest, Observable} from 'rxjs';
import {ComponentColumns} from '../component-column/component-columns';
import {LazyLoadEvent} from 'primeng/api';
import {debounceTime, delay, map, publishReplay, refCount, switchMap, tap} from 'rxjs/operators';
import {ComponentService} from '../component.service';
import {myThrottleTime} from '../../../utils/throttle-time';

@Component({
  selector: 'auth-component-list',
  templateUrl: './component-list.component.html',
  styleUrls: ['./component-list.component.scss'],
})
export class ComponentListComponent implements OnInit {

  filter = new BehaviorSubject<WsComponentFilter>(this.createInitialFilter());
  wsPagination = new BehaviorSubject<WsPagination>(this.crateInitialWsPagination());
  columns = new BehaviorSubject<ComponentColumns.Column[]>(this.createInitialColumns());

  values: Observable<WsApplicationComponent[]>;
  totalCount: Observable<number>;
  loading: boolean;

  editingComponent: WsApplicationComponent;

  constructor(private componentService: ComponentService) {
  }

  ngOnInit() {
    const WsResultLists: Observable<WsResultList<WsApplicationComponent>> = combineLatest(this.filter, this.wsPagination).pipe(
      debounceTime(0),
      myThrottleTime(1000),
      switchMap(results => this.loadvalues(results[0], results[1])),
      publishReplay(1), refCount(),
    );
    this.values = WsResultLists.pipe(map(results => results.results));
    this.totalCount = WsResultLists.pipe(map(results => results.totalCount));
  }

  onFilterChange(value: WsComponentFilter) {
    this.filter.next(value);
  }

  onWsPaginationChanged(event: LazyLoadEvent) {
    const newWsPagination: WsPagination = {
      offset: event.first,
      length: event.rows,
    };
    this.wsPagination.next(newWsPagination);
  }

  onNewComponentClick() {
    this.editingComponent = this.componentService.createEmptyComponent();
  }

  onComponentEdited(component: WsApplicationComponent) {
    this.componentService.saveComponent(component)
      .subscribe(() => {
        this.editingComponent = null;
        this.reload();
      });
  }

  onComponentEditCancel() {
    this.editingComponent = null;
  }

  onComponentSelected(value: WsApplicationComponent) {
    this.editingComponent = value;
  }

  private createInitialFilter(): WsComponentFilter {
    return {};
  }

  private crateInitialWsPagination(): WsPagination {
    return {
      offset: 0,
      length: 50,
    };
  }

  private createInitialColumns(): ComponentColumns.Column[] {
    return [
      ComponentColumns.ID,
      ComponentColumns.NAME,
      ComponentColumns.ENDPOINT_URL,
      ComponentColumns.ACTIVE,
    ];
  }

  private loadvalues(filter: WsComponentFilter, WsPagination: WsPagination) {
    this.loading = true;
    return this.componentService.listComponents(filter, WsPagination).pipe(
      delay(0),
      tap(() => this.loading = false),
    );
  }

  private reload() {
    this.filter.next(this.filter.getValue());
  }
}
