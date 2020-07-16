import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-export-eco-declaration-pdf-dialog',
  templateUrl: './export-eco-declaration-pdf-dialog.component.html',
  styleUrls: ['./export-eco-declaration-pdf-dialog.component.css']
})
export class ExportEcoDeclarationPdfDialogComponent {

  constructor(private dialogRef: MatDialogRef<ExportEcoDeclarationPdfDialogComponent>) { }


  closeDialog() {
    this.dialogRef.close();
  }

}
