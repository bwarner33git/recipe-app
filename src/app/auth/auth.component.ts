import { Component, OnInit, ComponentFactoryResolver } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { AuthResponseData } from './auth.service';
import { AlertComponent } from '../shared/alert/alert.component';
import { Router, Route } from '@angular/router';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  passwordValid: boolean = true;
  isLoginMode = true;
  isLoading = false;
  error = null;
  authReqSuccess: boolean = false;
  constructor(
    private AuthService: AuthService, 
    private componentFactoryResolver: ComponentFactoryResolver,
    private router: Router 
  ) { }

  ngOnInit() {
    this.AuthService.user.subscribe(res => console.log(res));
  }

  checkPassword(event) {
    const value = event.target.value;
    if(value.length < 6) {
      this.passwordValid = false;
    } else {
      this.passwordValid = true;
    }

    console.log(event.target.value);
  }

  handleClose() {
    this.error = null;
    this.authReqSuccess = false;
    this.router.navigate(['/recipes']);
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {

    console.log(form.controls.password.valid);
    console.log(form.controls.password.touched);
    const email = form.value.email;
    const password = form.value.password;
    this.isLoading = true;
    let authObs: Observable<AuthResponseData>;

    if(!form.valid) {
      return;
    }

    if(this.isLoginMode) {
      
      authObs = this.AuthService.signIn(email, password);

    } else {

      authObs = this.AuthService.signUp(email, password);
  
    }

    authObs.subscribe(response => {
      console.log(response);
      this.isLoading = false;
      this.authReqSuccess = true;
      this.error = "Your authentication request has been successfull";
      setTimeout(() => {
        this.error = null;
        this.router.navigate(['/recipes']);
      }, 5000);
    },
    error => {
      console.log(error);
      this.isLoading = false;
      this.error = 'An Error Occured! Error Message: ' + error;
    });
    form.reset();
  }

  private showErrorAlert(message: string) {
    const alertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
  }
}
