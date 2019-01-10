import { NgModule } from '@angular/core';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { CustomerSupportModule } from './customer-support/customer-support.module';

/**
 * `AppModule` is the main entry point into Angular's bootstraping process
 */
@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
  ],
  imports: [
    CoreModule,
    SharedModule,

    // feature modules
    CustomerSupportModule,

    // AppRoutingModule must come AFTER feature modules
    AppRoutingModule,
  ]
})
export class AppModule {

}
