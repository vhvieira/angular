import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GoogleLoginProvider, SocialUser, SocialAuthService } from 'angularx-social-login';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  signinForm: FormGroup;
  user: SocialUser;
  loggedIn: boolean;  
  constructor(private fb: FormBuilder, private authService: SocialAuthService) { }  
  ngOnInit() {
    this.signinForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });    
    
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);
      console.log(this.user);
    });
  }  
  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }
  signOut(): void {
    this.authService.signOut();
  }
}
