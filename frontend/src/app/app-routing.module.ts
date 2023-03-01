import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddActCodesComponent } from './components/add-act-codes/add-act-codes.component';
import { CompetitionsListComponent } from './components/competitions-list/competitions-list.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { MeetEventResultsComponent } from './components/meet-event-results/meet-event-results.component';
import { MeetResultsComponent } from './components/meet-results/meet-results.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { ResultsComponent } from './components/results/results.component';
import { SwimmerRegisterComponent } from './components/swimmer-register/swimmer-register.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {path:'registration',component:RegistrationComponent},
  {path:'login',component:LoginComponent},
  {path:'competitionsRegistraton',component:CompetitionsListComponent},
  {path:'swimmerRegistraton/:compName/:compDate/:poolSize',component:SwimmerRegisterComponent},
  // {path:'addactcodes',component:AddActCodesComponent},
  {path:'meetResults/:meet',component:MeetResultsComponent,canActivate:[AuthGuard]},
  {path:'meetEventResults/:event/:meet/:gender',component:MeetEventResultsComponent,canActivate:[AuthGuard]},
  {path:'results',component:ResultsComponent,canActivate:[AuthGuard]},
  {path:'',component:HomeComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
