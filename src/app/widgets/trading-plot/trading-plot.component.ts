import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MeasurementDataSet } from 'src/app/services/commodities/models';
import { AgreementDirection } from 'src/app/services/agreements/models';
import { AgreementService, GetAgreementSummaryRequest, GetAgreementSummaryResponse } from 'src/app/services/agreements/agreement.service';


export enum TradingPlotComponentDisplay {
  lines = 'lines',
  bars = 'bars',
}


@Component({
  selector: 'app-trading-plot',
  templateUrl: './trading-plot.component.html',
  styleUrls: ['./trading-plot.component.css']
})
export class TradingPlotComponent implements OnChanges {

  @Input() dateFrom: Date;
  @Input() dateTo: Date;
  @Input() agreementId: string;
  @Input() direction: AgreementDirection;
  @Input() display: TradingPlotComponentDisplay = TradingPlotComponentDisplay.bars;

  // Loading state
  loading: boolean = false;
  error: boolean = false;

  // Graph data
  labels: string[] = [];
  lines: MeasurementDataSet[] = [];
  bars: MeasurementDataSet[] = [];


  constructor(private agreementService: AgreementService) { }


  ngOnChanges(changes: SimpleChanges) {
    this.loadData();
  }


  loadData() {
    let request = new GetAgreementSummaryRequest({
      dateRange: {
        begin: this.dateFrom,
        end: this.dateTo,
      },
    });

    if(this.agreementId) {
      request.id = this.agreementId;
    }

    if(this.direction) {
      request.direction = this.direction;
    }

    this.loading = true;
    this.error = false;
    this.agreementService
        .getAgreementSummary(request)
        .subscribe(this.onLoadComplete.bind(this));
  }


  onLoadComplete(response: GetAgreementSummaryResponse) {
    this.loading = false;
    this.error = !response.success;
    if(response.success) {
      this.labels = response.labels;
      if(this.display == TradingPlotComponentDisplay.lines) {
        this.lines = response.ggos;
        this.bars = [];
      } else if(this.display == TradingPlotComponentDisplay.bars) {
        this.bars = response.ggos;
        this.lines = [];
      }
    }
  }

}
