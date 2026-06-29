import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from "@angular/router";
import { InitialScreen } from './initial';
import { SharedModule } from 'src/app/shared/shared.module';

export const routes: Routes = [
    { path: '', component: InitialScreen },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    RouterModule.forChild(routes),
  ],
  declarations: [InitialScreen],
  exports: [RouterModule],
})
export class initialModule {}
