import {merge, Observable, Subject} from "rxjs";
import {Item} from "./tableDataSource";

export class TableDataManager<T> {
  private data:Item[] =[];

  constructor() {

  }

  public getObserver(): Item[] {
    return this.data;
  }

  public reload(): void {
    this.source.subscribe(x => {
      this.push(x);
    });
  }

  public push(value: Item): void {
    this.manualSource.next(value);
  }
}
