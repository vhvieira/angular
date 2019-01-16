import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatProgressSpinnerModule, MatCardModule, MatFormFieldModule, MatInputModule } from '@angular/material';

@NgModule({
  imports: [MatButtonModule, MatProgressSpinnerModule, MatCardModule, MatFormFieldModule, MatInputModule],
  exports: [MatButtonModule, MatProgressSpinnerModule, MatCardModule, MatFormFieldModule, MatInputModule],
})
export class MaterialModule { }
