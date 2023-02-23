import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddActCodesComponent } from './components/add-act-codes/add-act-codes.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { ResultsComponent } from './components/results/results.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {path:'registration',component:RegistrationComponent},
  {path:'login',component:LoginComponent},
  {path:'addactcodes',component:AddActCodesComponent},
  {path:'results',component:ResultsComponent,canActivate:[AuthGuard]},
  {path:'',component:HomeComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
