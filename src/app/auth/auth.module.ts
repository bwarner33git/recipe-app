import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
//import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { AuthComponent } from './auth.component';

const appRoutes = [
    { path: '', component: AuthComponent }
];

@NgModule({
    declarations: [AuthComponent],
    imports: [
        FormsModule,
        RouterModule.forChild(appRoutes),
      //  CommonModule,
        SharedModule
    ],
    exports: []
})
export class AuthModule {

}