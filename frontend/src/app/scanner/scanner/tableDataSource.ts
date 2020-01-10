import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import {Observable} from "rxjs";

interface Item {
  id:string;
  name:string;
  status:string;
  round:string;
  station:string;
}
class TableDataSource extends DataSource<Item> {
  connect(collectionViewer: CollectionViewer): Observable<Item[] | ReadonlyArray<Item>> {
    return undefined;
  }

  disconnect(collectionViewer: CollectionViewer): void {
  }

}
