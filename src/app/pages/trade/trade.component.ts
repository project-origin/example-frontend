import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-trade',
  templateUrl: './trade.component.html',
  styleUrls: ['./trade.component.css']
})
export class TradeComponent {

  agreementId: string;


  constructor(private route: ActivatedRoute) { }


  ngOnInit() {
    this.route.params.subscribe(params => {
      this.agreementId = params.agreementId || null;
    });
  }

}
