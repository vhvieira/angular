import { NgModule } from '@angular/core';

// IMPORT THESE TWO FOR NAVIGATION
import { Routes, RouterModule } from '@angular/router';

// IMPORT USED MODULES
import { HomeComponent } from './home/app.home';
import { EmployeesComponent } from './employees/employees.component';
import { SimpleComponent } from './simple/app.simple';

const appRoutes: Routes = [
    { path: '', component: HomeComponent  },
    { path: 'employees', component: EmployeesComponent },
    { path: 'simple/:param', component: SimpleComponent }
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
