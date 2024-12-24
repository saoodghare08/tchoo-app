import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { UserRegisterDTOs } from 'src/app/_common/DTOs/AccountSetting/UserRegisterDTOs';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent {
  model: any = {};
  errorMessage!: string;
  user: any;
  UserReg: UserRegisterDTOs = {
    fullName: '',
    email: '',
    password: '',
    gender: ''
  };
  loggedIn: any;
  Url = 'https://villiyantapi.cxengine.net/api/Authenticate/login/';
   RegisterUrl = 'https://villiyantapi.cxengine.net/api/Authenticate/register-user';
  //Url = 'http://localhost:5114/api/Authenticate/login/';
  //RegisterUrl = 'http://localhost:5114/api/Authenticate/register-user';
  createdby: any;
  constructor(
    private http: HttpClient,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: SocialAuthService,
    private app: AppComponent
  ) { }
  ngOnInit() {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.UserReg = {
        fullName: '' + this.user.name,
        email: '' + this.user.email,
        password: 'Abteam@2023',
        gender: '-'
      }
      this.http.post(this.RegisterUrl, this.UserReg).subscribe(data => {
        this.createdby = data
        this.app.commonLoader = false;
        this.model = {
          username: this.user.email,
          password: 'Abteam@2023'
        };
        this.login();
      });
      this.loggedIn = (user != null);
    });
    sessionStorage.removeItem('UserName');
    sessionStorage.clear();
    this.activatedRoute.queryParams.subscribe(params => {
      const username = params['email'];
      const pass = params['pass'];
      const token = params['token'];
      if (username == undefined || pass == undefined || token == undefined) {
        this.app.commonLoader = false;
      } else {
        this.model = {
          username: username,
          password: pass
        };
        this.login();
        this.app.commonLoader = false;
      }
    })
  }
  login() {
    debugger
    this.app.commonLoader = true;
    this.http.post(this.Url, this.model).subscribe({
      next: (data) => {
        this.createdby = data
        this.app.commonLoader = false;
        this.router.navigateByUrl('/Home/' + this.createdby.userId);
      },
      error: (err) => {
        this.app.openSnackBar('Invalid Credentials');
        this.app.commonLoader = false;
      }
    });
  };
}
