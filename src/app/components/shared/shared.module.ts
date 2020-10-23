import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {MatCardModule} from '@angular/material/card';

import { FlexLayoutModule } from '@angular/flex-layout';

const materialModules = [
  MatCardModule
]

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    materialModules
  ],
  exports :[
    CommonModule,
    FlexLayoutModule,
    materialModules
  ]
})
export class SharedModule { }
