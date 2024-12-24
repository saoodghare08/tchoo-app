import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Environment } from '../_common/Environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnInit {
  Url: string;
  token: string | undefined;
  header: any;
  username = "";
  password = "";
  constructor(
    private http: HttpClient,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private enviroment: Environment
  ) {
     this.Url = 'https://villiyantapi.cxengine.net/api/login/';
    //this.Url = 'http://localhost:5114/api/login/';
    const headerSettings: { [name: string]: string | string[]; } = {};
    this.header = new HttpHeaders(headerSettings);
  }
  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.username = params['email'];
      this.password = params['pass'];
      this.token = params['token'];
    });
  }
  userlanguage(created: any) {
    return this.http.get(this.enviroment.AccountBaseUrl + 'GetUserByUserId?userId=' + created).subscribe((data: any) => {
      var userdetails = data;
      // console.log(userdetails.language);
    });
  }
  paramasLogin(username: any, password: any, token: any) {
    return this.http.get(this.Url + username + '&' + password + '&' + token);
  }
  /* LOGIN FUNCTIONALITY */
  Login(model: any) {
    var a = this.Url + 'UserLogin';
    return this.http.post<any>(this.Url, model, { headers: this.header }).subscribe({
      next:(data) => {
        if (data.Status == "Success") {
          this.router.navigate(['/Dashboard']);
        }
      },error: (err) => {
        console.log(err);
      }
    });
  }
}
