import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import {merge, Observable, of as observableOf} from "rxjs";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {TableItem} from "../table/table-datasource";
import {map} from "rxjs/operators";

export interface Item {
  id:string;
  name:string;
  status:string;
  round:string;
  station:string;
}

export class TableDataSource extends DataSource<Item> {

  data:Item[]=[];
  paginator: MatPaginator;
  sort: MatSort;

  constructor(datapre:Item[]) {
    super();
    this.data = datapre;
  }

  connect(collectionViewer: CollectionViewer): Observable<Item[] | ReadonlyArray<Item>> {
    const dataMutations = [
      observableOf(this.data),
      this.paginator.page,
      this.sort.sortChange
    ];
return merge(...dataMutations).pipe(map(() => {
      return this.getPagedData(this.getSortedData([...this.data]));
    }));
  }

  disconnect(collectionViewer: CollectionViewer): void {
  }

  public addItem(item:Item) {
    this.data = this.data.concat(item);
  }


  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: Item[]) {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.splice(startIndex, this.paginator.pageSize);
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: Item[]) {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort.direction === 'asc';
      switch (this.sort.active) {
        case 'name': return compare(a.name, b.name, isAsc);
        case 'id': return compare(+a.id, +b.id, isAsc);
        case 'status': return compare(+a.status, +b.status, isAsc);
        case 'station': return compare(+a.station, +b.station, isAsc);
        case 'round': return compare(+a.round, +b.round, isAsc);
        default: return 0;
      }
    });
  }
}
/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a, b, isAsc) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
