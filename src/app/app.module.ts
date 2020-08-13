import "reflect-metadata";

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChartsModule } from 'ng2-charts';
import { RouterModule, Routes } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { SatDatepickerModule, SatNativeDateModule, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from 'saturn-datepicker';
import { MomentDateAdapter } from '@angular/material-moment-adapter'

// Angular Material Design
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatRippleModule } from '@angular/material/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatBadgeModule } from '@angular/material/badge';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatTooltipModule } from '@angular/material/tooltip'; 
import { MatDividerModule } from '@angular/material/divider';
import { MatStepperModule } from '@angular/material/stepper'; 


// Origin
import { AppComponent } from './app.component';
import { MainComponent } from './pages/main/main.component';
import { GgoDoughnotChartComponent } from './widgets/ggo-doughnot-chart/ggo-doughnot-chart.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { RetireComponent } from './pages/retire/retire.component';
import { PageNotFoundComponent } from './pages/errors/page-not-found/page-not-found.component';
import { ToolbarComponent } from './pages/main/toolbar/toolbar.component';
import { LoadingButtonComponent } from './widgets/loading-button/loading-button.component';
import { CommodityPlotComponent } from './widgets/commodity-plot/commodity-plot.component';
import { SigninComponent } from './pages/signin/signin.component';
import { GgoSummaryComponent } from './pages/dashboard/ggo-summary/ggo-summary.component';
import { FacilitiesComponent } from './pages/facilities/facilities.component';
import { DisclosureComponent } from './pages/disclosure/disclosure.component';
import { TradingPlotComponent } from './widgets/trading-plot/trading-plot.component';
import { LoadingViewComponent } from './widgets/loading-view/loading-view/loading-view.component';
import { SpinnerTextComponent } from './widgets/spinner-text/spinner-text.component';
import { SelectUserDialogComponent } from './widgets/select-user-dialog/select-user-dialog.component';
import { EditFacilityDialogComponent } from './pages/facilities/edit-facility-dialog/edit-facility-dialog.component';
import { CommoditiesComponent } from './pages/commodities/commodities.component';
import { CommoditiesFiltersComponent } from './pages/commodities/commodities-filters/commodities-filters.component';
import { formatAmountTransformer } from './pipes/unitamount';
import { CreateDisclosureDialogComponent } from './pages/disclosure/create-disclosure/create-disclosure-dialog/create-disclosure-dialog.component';
import { ViewDisclosureComponent } from './pages/disclosure/view-disclosure/view-disclosure.component';
import { DisclosureChartComponent } from './pages/disclosure/view-disclosure/disclosure-chart/disclosure-chart/disclosure-chart.component';
import { ErrorPopupComponent } from './pages/errors/error-popup/error-popup.component';
import { SupportComponent } from './pages/support/support.component';
import { OnboardingDialogComponent } from './pages/main/onboarding-dialog/onboarding-dialog.component';

// Locale
import { registerLocaleData } from '@angular/common';
import localeDa from '@angular/common/locales/da';
import { GgoSummaryPlotComponent } from './widgets/ggo-summary-plot/ggo-summary-plot.component';
import { FacilityTypeBadgeComponent } from './widgets/facility-type-badge/facility-type-badge.component';
import { AccountDetailsDialogComponent } from './pages/account/account-details-dialog/account-details-dialog.component';
import { EnergyPlotComponent } from './widgets/energy-plot/energy-plot/energy-plot.component';
import { ForecastComponent } from './pages/forecast/forecast.component';
import { ForecastDetailsComponent } from './pages/forecast/forecast-details/forecast-details/forecast-details.component';
import { ZoomNavigateBarComponent } from './widgets/zoom-navigate-bar/zoom-navigate-bar/zoom-navigate-bar.component';
import { ForecastHistoryComponent } from './pages/forecast/forecast-history/forecast-history/forecast-history.component';
import { TransferComponent } from './pages/transfer/transfer.component';
import { AgreementListComponentNEW } from './pages/transfer/agreement-list/agreement-list.component';
import { ProposeAgreementComponent } from './pages/transfer/propose-agreement/propose-agreement.component';
import { AgreementDetailsComponent } from './pages/transfer/agreement-details/agreement-details.component';
import { ShowProposedAgreementComponent } from './pages/transfer/show-proposed-agreement/show-proposed-agreement.component';
import { ResponseToProposedAgreementComponent } from './pages/transfer/response-to-proposed-agreement/response-to-proposed-agreement.component';
import { AgreementDetailsTableComponent } from './pages/transfer/agreement-details-table/agreement-details-table.component';
import { CreateAgreementComponent } from './pages/transfer/create-agreement/create-agreement/create-agreement.component';
import { CounterpartDropdownDialogComponent } from './pages/transfer/create-agreement/counterpart-dropdown-dialog/counterpart-dropdown-dialog.component';
import { CounterpartListDialogComponent } from './pages/transfer/create-agreement/counterpart-list-dialog/counterpart-list-dialog.component';
import { ShowPeakMeasurementDialogComponent } from './pages/transfer/create-agreement/show-peak-measurement-dialog/show-peak-measurement-dialog/show-peak-measurement-dialog.component';

registerLocaleData(localeDa, 'da');

const DEBUG = false;


// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}


const appRoutes: Routes = [
  { path: '', redirectTo: '/app/dashboard', pathMatch: 'full' },
  { path: 'signin', component: SigninComponent },
  { path: 'disclosure/:disclosureId', component: ViewDisclosureComponent },
  { 
    path: 'app',
    component: MainComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'commodities', component: CommoditiesComponent },
      { path: 'transfer', component: TransferComponent },
      { path: 'transfer/propose', component: CreateAgreementComponent },
      { path: 'transfer/:agreementId', component: AgreementDetailsComponent },
      { path: 'retire', component: RetireComponent },
      { path: 'facilities', component: FacilitiesComponent },
      { path: 'disclosure', component: DisclosureComponent },
      { path: 'forecast', component: ForecastComponent },
      { path: 'support', component: SupportComponent },
    ]
  },
  { path: '**', component: PageNotFoundComponent },
];


@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    ToolbarComponent,
    DashboardComponent,
    RetireComponent,
    GgoDoughnotChartComponent,
    LoadingButtonComponent,
    CommodityPlotComponent,
    SigninComponent,
    GgoSummaryComponent,
    FacilitiesComponent,
    DisclosureComponent,
    TradingPlotComponent,
    LoadingViewComponent,
    SpinnerTextComponent,
    SelectUserDialogComponent,
    EditFacilityDialogComponent,
    CommoditiesComponent,
    CommoditiesFiltersComponent,
    formatAmountTransformer,
    CreateDisclosureDialogComponent,
    ViewDisclosureComponent,
    DisclosureChartComponent,
    ErrorPopupComponent,
    SupportComponent,
    OnboardingDialogComponent,
    GgoSummaryPlotComponent,
    FacilityTypeBadgeComponent,
    AccountDetailsDialogComponent,
    EnergyPlotComponent,
    ForecastComponent,
    ForecastDetailsComponent,
    ZoomNavigateBarComponent,
    ForecastHistoryComponent,
    TransferComponent,
    ProposeAgreementComponent,
    AgreementDetailsComponent,
    ShowProposedAgreementComponent,
    AgreementListComponentNEW,
    ResponseToProposedAgreementComponent,
    AgreementDetailsTableComponent,
    CreateAgreementComponent,
    CounterpartDropdownDialogComponent,
    CounterpartListDialogComponent,
    ShowPeakMeasurementDialogComponent,
  ],
  imports: [
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),

    RouterModule.forRoot(
      appRoutes,
      { enableTracing: DEBUG }
    ),

    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ChartsModule,
    MatCardModule,
    MatInputModule,
    MatListModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatIconModule,
    MatGridListModule,
    MatMenuModule,
    MatDialogModule,
    MatButtonToggleModule,
    MatSelectModule,
    MatChipsModule,
    MatRippleModule,
    DragDropModule,
    MatBadgeModule,
    FormsModule,
    ReactiveFormsModule,
    SatDatepickerModule,
    SatNativeDateModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatRadioModule,
    MatTooltipModule,
    MatDividerModule,
    MatStepperModule,
  ],
  exports: [ RouterModule ],
  bootstrap: [ AppComponent ],
  providers: [ 
    CookieService,
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: {
          dateInput: ['l', 'LL'],
        },
        display: {
          dateInput: 'll',
          monthYearLabel: 'MMM YYYY',
          dateA11yLabel: 'LL',
          monthYearA11yLabel: 'YYYY',
        },
      },
    },
    // { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
})
export class AppModule { }
