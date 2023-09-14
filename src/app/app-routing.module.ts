import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NodeMapComponent } from './node-map/node-map.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
