import {Component, OnInit} from '@angular/core';
import {ComponentFilter, Pagination, WsApplicationComponent} from '@charlyghislain/core-web-api';
import {BehaviorSubject, combineLatest, Observable} from 'rxjs';
import {ComponentColumns} from '../component-column/component-columns';
import {LazyLoadEvent} from 'primeng/api';
import {delay, map, publishReplay, refCount, switchMap, tap} from 'rxjs/operators';
import {ListResult} from '../../../domain/list-result';
import {ComponentService} from '../component.service';
import {myThrottleTime} from '../../../utils/throttle-time';

@Component({
  selector: 'auth-component-list',
  templateUrl: './component-list.component.html',
  styleUrls: ['./component-list.component.scss'],
})
export class ComponentListComponent implements OnInit {

  filter = new BehaviorSubject<ComponentFilter>(this.createInitialFilter());
  pagination = new BehaviorSubject<Pagination>(this.crateInitialPagination());
  columns = new BehaviorSubject<ComponentColumns.Column[]>(this.createInitialColumns());

  values: Observable<WsApplicationComponent[]>;
  totalCount: Observable<number>;
  loading: boolean;

  editingComponent: WsApplicationComponent;

  constructor(private componentService: ComponentService) {
  }

  ngOnInit() {
    const listResults: Observable<ListResult<WsApplicationComponent>> = combineLatest(this.filter, this.pagination).pipe(
      myThrottleTime(1000),
      switchMap(results => this.loadvalues(results[0], results[1])),
      publishReplay(1), refCount(),
    );
    this.values = listResults.pipe(map(results => results.values));
    this.totalCount = listResults.pipe(map(results => results.totalCount));
  }

  onFilterChange(value: ComponentFilter) {
    this.filter.next(value);
  }

  onPaginationChanged(event: LazyLoadEvent) {
    const newPagination: Pagination = {
      offset: event.first,
      length: event.rows,
    };
    this.pagination.next(newPagination);
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

  private createInitialFilter(): ComponentFilter {
    return {};
  }

  private crateInitialPagination(): Pagination {
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

  private loadvalues(filter: ComponentFilter, pagination: Pagination) {
    this.loading = true;
    return this.componentService.listComponents(filter, pagination).pipe(
      delay(0),
      tap(() => this.loading = false),
    );
  }

  private reload() {
    this.filter.next(this.filter.getValue());
  }
}
