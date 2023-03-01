import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { ToolbarComponent } from './components/header/toolbar/toolbar.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ResultsComponent } from './components/results/results.component';
import { TokenInterceptorService } from './services/token-interceptor.service';
import { AddActCodesComponent } from './components/add-act-codes/add-act-codes.component';
import { MeetResultsComponent } from './components/meet-results/meet-results.component';
import { MeetEventResultsComponent } from './components/meet-event-results/meet-event-results.component';
import { SwimmerRegisterComponent } from './components/swimmer-register/swimmer-register.component';
import { SwimmerCardComponent } from './components/swimmer-card/swimmer-card.component';
import { ClickedOutsideDirective } from './directives/clicked-outside.directive';
import { ErrorComponent } from './components/error/error.component';
import { CompetitionsListComponent } from './components/competitions-list/competitions-list.component';

@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    RegistrationComponent,
    LoginComponent,
    HomeComponent,
    ResultsComponent,
    AddActCodesComponent,
    MeetResultsComponent,
    MeetEventResultsComponent,
    SwimmerRegisterComponent,
    SwimmerCardComponent,
    ClickedOutsideDirective,
    ErrorComponent,
    CompetitionsListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [{
    provide:HTTP_INTERCEPTORS,
    useClass:TokenInterceptorService,
    multi:true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
