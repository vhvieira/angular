import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerSupportComponent } from './customer-support.component';
import { CsTransactionsComponent } from './cs-transactions/cs-transactions.component';
import { CsListsComponent } from './cs-lists/cs-lists.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerSupportComponent,
    children: [
      { path: 'transactions',
        component: CsTransactionsComponent,
        resolve: {
        },
      },
      { path: 'lists',
        component: CsListsComponent,
        resolve: {
        },
      },
    ],
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    // provide guards here
  ]
})
export class CustomerSupportRoutingModule { }
