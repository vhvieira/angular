import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MCErrorComponent } from './core/error-page/error-page.component';

const appRoutes: Routes = [
  {
    path: 'error',
    component: MCErrorComponent
  },
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
