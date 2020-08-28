import { Component, Input, Output, EventEmitter } from '@angular/core';
import { EcoDeclaration, EcoDeclarationResolution } from 'src/app/services/environment/environment.service';
import { MatDialog } from '@angular/material/dialog';
import { EmissionDetailsDialogComponent } from '../../emission-details-dialog/emission-details-dialog/emission-details-dialog.component';


@Component({
  selector: 'app-emission-table',
  templateUrl: './emission-table.component.html',
  styleUrls: ['./emission-table.component.css']
})
export class EmissionTableComponent {


  @Input() individual: EcoDeclaration;
  @Input() general: EcoDeclaration;
  @Input() resolution: EcoDeclarationResolution;

  @Output() exportPdf: EventEmitter<any> = new EventEmitter();
  @Output() exportEmissionsCSV: EventEmitter<any> = new EventEmitter();
  @Output() exportTechnologiesCSV: EventEmitter<any> = new EventEmitter();


  emissions = {
    'CO2': {
      plain: 'CO2 (Kuldioxid - drivhusgas)',
      html: 'CO<sub>2</sub> (Kuldioxid - drivhusgas)',
    },
    'CH4': {
      plain: 'CH4 (Metan - drivhusgas)',
      html: 'CH<sub>4</sub> (Metan - drivhusgas)',
    },
    'N2O': {
      plain: 'N2O (Lattergas - drivhusgas)',
      html: 'N<sub>2</sub>O (Lattergas - drivhusgas)',
    },
    'SO2': {
      plain: 'SO2 (Svovldioxid)',
      html: 'SO<sub>2</sub> (Svovldioxid)',
    },
    'NOx': {
      plain: 'NOx (Kvælstofilte)',
      html: 'NO<sub>x</sub> (Kvælstofilte)',
    },
    'CO': {
      plain: 'CO (Kulilte)',
      html: 'CO (Kulilte)',
    },
    'NMVOC': {
      plain: 'NMVOC (Uforbrændt kulbrinter)',
      html: 'NMVOC (Uforbrændt kulbrinter)',
    },
    'particles': {
      plain: 'Partikler',
      html: 'Partikler',
    },
    'flyash': {
      plain: 'Kulflyveaske',
      html: 'Kulflyveaske',
    },
    'slag': {
      plain: 'Slagge',
      html: 'Slagge',
    },
    'desulphurisation': {
      plain: 'Afsvovlningsprodukter (Gips)',
      html: 'Afsvovlningsprodukter (Gips)',
    },
    'waste': {
      plain: 'Røggasaffald',
      html: 'Røggasaffald',
    },
  };

  emissions_in_air : string[] = [
    'CO2',
    'CH4',
    'N2O',
    'SO2',
    'NOx',
    'CO',
    'NMVOC',
    'particles',
  ]

  residues : string[] = [
    'flyash',
    'slag',
    'desulphurisation',
    'waste',
  ]


  constructor(private dialog: MatDialog) { }


  getPlainLabel(key: string) : string {
    if(key in this.emissions) {
      return this.emissions[key].plain;
    } else {
      return key;
    }
  }


  getHtmlLabel(key: string) : string {
    if(key in this.emissions) {
      return this.emissions[key].html;
    } else {
      return key;
    }
  }


  showEmissionDetailsPopup(emission: string) {
    let data = {
      declaration: this.individual,
      emission: emission,
      plainLabel: this.getPlainLabel(emission),
      htmlLabel: this.getHtmlLabel(emission),
      totalConsumedAmount: this.individual.totalConsumedAmount,
      totalEmission: this.individual.totalEmissions[emission] || 0,
      totalEmissionPerWh: this.individual.totalEmissionsPerWh[emission] || 0,
      emissions: this.emissions,
      resolution: this.resolution,
    };

    this.dialog.open(EmissionDetailsDialogComponent, { 
      data: data,
      width: '800px',
      panelClass: 'dialog',
      maxHeight: '90vh',
    });
  }


  emitExportPdf() {
    this.exportPdf.emit();
  }


  emitExportEmissionsCSV() {
    this.exportEmissionsCSV.emit();
  }


  emitExportTechnologiesCSV() {
    this.exportTechnologiesCSV.emit();
  }

}
