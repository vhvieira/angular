import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from './shared/shared.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/app.home';
import { EmployeesComponent } from './employees/employees.component';
import { TransactionHeaderComponent } from './transactionheader/transactionheader.component';
import { SimpleComponent } from './simple/app.simple';
import { UnderlineDirective } from './simple/mydirective';
import { AppRoutingModule } from './app.routing';
// import { EmployeeFilterPipe } from './app.pipe';

import {MatButtonModule, MatCheckboxModule, MatInputModule, MatProgressSpinnerModule, MatCardModule} from '@angular/material';
// Imports from https://coursetro.com/posts/code/113/How-to-Build-an-Angular-5-Material-App
import { MaterialModule } from './material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {MatFormFieldModule} from '@angular/material/form-field';
import {FormBuilder, FormGroup, Validators, FormControl, NgForm, FormControlDirective, FormGroupDirective } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent, EmployeesComponent, UnderlineDirective, EmployeesComponent, TransactionHeaderComponent, SimpleComponent, HomeComponent
  ],
  imports: [
    BrowserModule, FormsModule, SharedModule, BrowserAnimationsModule, AppRoutingModule, MaterialModule
    // commented, not used in this component but in Header component
    // FormBuilder, FormGroup, Validators, FormControl, NgForm, FormControlDirective, FormGroupDirective,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
