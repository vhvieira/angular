import { NgModule } from '@angular/core';
import { DataTableModule } from 'primeng/components/datatable/datatable';
import { CalendarModule } from 'primeng/components/calendar/calendar';
import { CustomerSupportService } from './customer-support.service';
import { SharedModule } from '../shared/shared.module';
import { CsTransactionsComponent } from './cs-transactions/cs-transactions.component';
import { CsListsComponent } from './cs-lists/cs-lists.component';
import { CustomerSupportRoutingModule } from './customer-support.routing';
import { CustomerSupportComponent } from './customer-support.component';

@NgModule({
  imports: [
    SharedModule,
    DataTableModule,
    CalendarModule,
    CustomerSupportRoutingModule
  ],
  exports: [],
  declarations: [
    CustomerSupportComponent,
    CsTransactionsComponent,
    CsListsComponent,
  ],
  providers: [
    CustomerSupportService
  ],
})
export class CustomerSupportModule { }
