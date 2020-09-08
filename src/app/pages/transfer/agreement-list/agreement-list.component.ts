import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Agreement } from 'src/app/services/agreements/models';


@Component({
  selector: 'app-agreement-list-new',
  templateUrl: './agreement-list.component.html',
  styleUrls: ['./agreement-list.component.css']
})
export class AgreementListComponentNEW {


  @Input() icon: string;
  @Input() iconColor: string;
  @Input() headline: string;
  @Input() emptyHeadline: string;
  @Input() emptyText: string;
  @Input() agreements: Agreement[] = [];
  @Input() sortable: boolean = false;

  @Output() clicked: EventEmitter<Agreement> = new EventEmitter<Agreement>();
  @Output() priorityChanged: EventEmitter<Agreement[]> = new EventEmitter<Agreement[]>();


  getPriority(agreement: Agreement) : number {
    let index = this.agreements.indexOf(agreement);
    if(index !== -1) {
      return index;
    }
  }


  select(agreement: Agreement) {
    this.clicked.emit(agreement);
  }


  drop(event: CdkDragDrop<Agreement[]>) {
    if(this.sortable) {
      moveItemInArray(event.container.data,
        event.previousIndex,
        event.currentIndex);

      this.priorityChanged.emit(this.agreements);
    }
  }

}
