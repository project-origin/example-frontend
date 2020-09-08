import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AgreementService, FindSuppliersRequest, FindSuppliersResponse } from 'src/app/services/agreements/agreement.service';
import { GgoSupplier } from 'src/app/services/agreements/models';
import { DateRange } from 'src/app/services/common';


@Component({
  selector: 'app-counterpart-list-dialog',
  templateUrl: './counterpart-list-dialog.component.html',
  styleUrls: ['./counterpart-list-dialog.component.css']
})
export class CounterpartListDialogComponent implements OnInit {

  dateRange: DateRange;
  minAmount: number;

  suppliers: GgoSupplier[] = [];
  loading: boolean;
  error: boolean;


  constructor(
    private dialogRef: MatDialogRef<CounterpartListDialogComponent>,
    private agreementService: AgreementService,
    @Inject(MAT_DIALOG_DATA) data: {
      dateRange: DateRange,
      minAmount: number,
    }
  ) {
    this.dateRange = data.dateRange;
    this.minAmount = data.minAmount;
  }


  ngOnInit() {
    this.loadSuppliers();
  }


  closeDialog() {
    this.dialogRef.close();
  }


  selectSupplier(supplier: GgoSupplier) {
    this.dialogRef.close({
      counterpartId: supplier.id,
      counterpart: supplier.company,
    });
  }


  loadSuppliers() {
    let request = new FindSuppliersRequest({
      dateRange: this.dateRange,
      minAmount: this.minAmount,
    });

    this.agreementService
      .findSuppliers(request)
      .subscribe(this.onLoadSuppliersComplete.bind(this));
  }


  onLoadSuppliersComplete(response: FindSuppliersResponse) {
    this.loading = false;
    this.error = !response.success;
    if(response.success) {
      this.suppliers = response.suppliers;
    }
  }

}
