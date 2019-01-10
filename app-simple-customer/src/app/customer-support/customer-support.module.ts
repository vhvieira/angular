import { NgModule } from '@angular/core';
import { DataTableModule } from 'primeng/components/datatable/datatable';
import { CalendarModule } from 'primeng/components/calendar/calendar';
import { TableModule } from 'primeng/table';
import { SharedModule } from '../shared/shared.module';
import { CsTransactionsComponent } from './cs-transactions/cs-transactions.component';
import { CsListsComponent } from './cs-lists/cs-lists.component';
import { CustomerSupportRoutingModule } from './customer-support.routing';
import { CustomerSupportComponent } from './customer-support.component';
import { CsTransactionsFormComponent } from './form/cs-transactions-form.component';
import { AddPanModalComponent } from './cs-lists/add-pan-modal/add-pan-modal.component';
import {
  AddPanConfirmationModalComponent
 } from './cs-lists/add-pan-modal/add-pan-confirmation-modal/add-pan-confirmation-modal.component';
import { RemovePanModalComponent } from './cs-lists/rem-pan-modal/rem-pan-modal.component';
import { CSListService } from './cs-lists/cs-lists.service';
import { CsTransactionsService } from './cs-transactions/cs-transactions.service';
import { CsTransactionsFormService } from './form/cs-transactions-form.service';
import { ListSummaryComponent } from './cs-lists/list-summary/list-summary.component';
import { ListHistoryDetailComponent } from './cs-lists/list-summary/list-history/list-history-summary.component';

@NgModule({
  imports: [
    SharedModule,
    DataTableModule,
    TableModule,
    CalendarModule,
    CustomerSupportRoutingModule
  ],
  exports: [],
  declarations: [
    CustomerSupportComponent,
    CsTransactionsComponent,
    CsListsComponent,
    ListSummaryComponent,
    CsTransactionsFormComponent,
    ListHistoryDetailComponent,
    AddPanModalComponent,
    AddPanConfirmationModalComponent,
    RemovePanModalComponent
  ],
  providers: [
    CsTransactionsFormService,
    CSListService,
    CsTransactionsService
  ],
})
export class CustomerSupportModule { }
