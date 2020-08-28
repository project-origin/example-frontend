import { Component, OnInit, Input } from '@angular/core';
import { Agreement } from 'src/app/services/agreements/models';

@Component({
  selector: 'app-agreement-details-table',
  templateUrl: './agreement-details-table.component.html',
  styleUrls: ['./agreement-details-table.component.css']
})
export class AgreementDetailsTableComponent implements OnInit {


  @Input() agreement: Agreement;
  @Input() showTechnology: boolean = true;


  constructor() { }

  
  ngOnInit(): void {
  }

}
