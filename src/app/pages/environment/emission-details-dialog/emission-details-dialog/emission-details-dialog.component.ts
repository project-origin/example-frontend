import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


type InjectData = {
  key: string,
  plainLabel: string,
  htmlLabel: string,
  totalConsumedAmount: number,
  totalEmission: number,
  totalEmissionPerWh: number,
};


@Component({
  selector: 'app-emission-details-dialog',
  templateUrl: './emission-details-dialog.component.html',
  styleUrls: ['./emission-details-dialog.component.css']
})
export class EmissionDetailsDialogComponent implements OnInit {


  key: string;
  plainLabel: string;
  htmlLabel: string;
  totalConsumedAmount: number;
  totalEmission: number;
  totalEmissionPerWh: number;


  constructor(
    private dialogRef: MatDialogRef<EmissionDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: InjectData,
  ) {
    this.key = data.key;
    this.plainLabel = data.plainLabel;
    this.htmlLabel = data.htmlLabel;
    this.totalConsumedAmount = data.totalConsumedAmount;
    this.totalEmission = data.totalEmission;
    this.totalEmissionPerWh = data.totalEmissionPerWh;
  }

  ngOnInit(): void {
  }


  get totalEmissionPerkWh() : number {
    return this.totalEmissionPerWh * 1000;
  }

}
