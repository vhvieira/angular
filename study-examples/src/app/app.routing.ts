import { NgModule } from '@angular/core';

// IMPORT THESE TWO FOR NAVIGATION
import { Routes, RouterModule } from '@angular/router';

// IMPORT USED MODULES
import { AppComponent } from './app.component';
import { EmployeesComponent } from './employees/employees.component';
import { TransactionHeaderComponent } from './transactionheader/transactionheader.component';

const appRoutes: Routes = [
    { path: '', component: AppComponent },
    { path: 'employees', component: EmployeesComponent },
    { path: 'transaction/:pan', component: TransactionHeaderComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
  providers: [
    // provide guards here
  ]
})
export class AppRoutingModule {

}
