import "reflect-metadata";

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChartsModule } from 'ng2-charts';
import { RouterModule, Routes } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { SatDatepickerModule, SatNativeDateModule, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from 'saturn-datepicker';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter'

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


// Origin
import { AppComponent } from './app.component';
import { MainComponent } from './pages/main/main.component';
import { GgoDoughnotChartComponent } from './widgets/ggo-doughnot-chart/ggo-doughnot-chart.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { TradeComponent } from './pages/trade/trade.component';
import { RetireComponent } from './pages/retire/retire.component';
import { PageNotFoundComponent } from './pages/errors/page-not-found/page-not-found.component';
import { ToolbarComponent } from './pages/main/toolbar/toolbar.component';
import { LoadingButtonComponent } from './widgets/loading-button/loading-button.component';
import { CommodityPlotComponent } from './widgets/commodity-plot/commodity-plot.component';
import { AgreementListComponent } from './pages/trade/agreement-list/agreement-list.component';
import { CreateAgreementComponent } from './pages/trade/create-agreement/create-agreement.component';
import { SigninComponent } from './pages/signin/signin.component';
import { AgreementSummaryComponent } from './pages/trade/agreement-summary/agreement-summary.component';
import { GgoSummaryComponent } from './pages/dashboard/ggo-summary/ggo-summary.component';
import { FacilitiesComponent } from './pages/facilities/facilities.component';
import { DisclosureComponent } from './pages/disclosure/disclosure.component';
import { TradingPlotComponent } from './widgets/trading-plot/trading-plot.component';
import { LoadingViewComponent } from './widgets/loading-view/loading-view/loading-view.component';
import { SpinnerTextComponent } from './widgets/spinner-text/spinner-text.component';
import { SelectUserDialogComponent } from './widgets/select-user-dialog/select-user-dialog.component';
import { EditFacilityDialogComponent } from './pages/facilities/edit-facility-dialog/edit-facility-dialog.component';
import { ViewSentProposalComponent } from './pages/trade/view-sent-proposal/view-sent-proposal.component';
import { ViewReceivedProposalComponent } from './pages/trade/view-received-proposal/view-received-proposal.component';
import { CommoditiesComponent } from './pages/commodities/commodities.component';
import { CommoditiesFiltersComponent } from './pages/commodities/commodities-filters/commodities-filters.component';
import { formatAmountTransformer } from './pipes/unitamount';
import { CreateDisclosureDialogComponent } from './pages/disclosure/create-disclosure/create-disclosure-dialog/create-disclosure-dialog.component';
import { ViewDisclosureComponent } from './pages/disclosure/view-disclosure/view-disclosure.component';
import { DisclosureChartComponent } from './pages/disclosure/view-disclosure/disclosure-chart/disclosure-chart/disclosure-chart.component';
import { ErrorPopupComponent } from './pages/errors/error-popup/error-popup.component';
import { SupportComponent } from './pages/support/support.component';
import { OnboardingDialogComponent } from './pages/main/onboarding-dialog/onboarding-dialog.component';


const DEBUG = false;


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
      { path: 'transfer/:agreementId', component: TradeComponent },
      { path: 'transfer', component: TradeComponent },
      { path: 'retire', component: RetireComponent },
      { path: 'facilities', component: FacilitiesComponent },
      { path: 'disclosure', component: DisclosureComponent },
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
    TradeComponent,
    DashboardComponent,
    RetireComponent,
    GgoDoughnotChartComponent,
    LoadingButtonComponent,
    CommodityPlotComponent,
    AgreementListComponent,
    CreateAgreementComponent,
    SigninComponent,
    AgreementSummaryComponent,
    GgoSummaryComponent,
    FacilitiesComponent,
    DisclosureComponent,
    TradingPlotComponent,
    LoadingViewComponent,
    SpinnerTextComponent,
    SelectUserDialogComponent,
    EditFacilityDialogComponent,
    ViewSentProposalComponent,
    ViewReceivedProposalComponent,
    CommoditiesComponent,
    CommoditiesFiltersComponent,
    formatAmountTransformer,
    CreateDisclosureDialogComponent,
    ViewDisclosureComponent,
    DisclosureChartComponent,
    ErrorPopupComponent,
    SupportComponent,
    OnboardingDialogComponent,
  ],
  imports: [
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
