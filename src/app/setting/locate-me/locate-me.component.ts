import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-locate-me',
  templateUrl: './locate-me.component.html',
  styleUrls: ['./locate-me.component.scss']
})
export class LocateMeComponent implements OnInit{
  constructor(
    private router:Router
  ){}
  ngOnInit(): void {
    var params = this.router.url;
  }
}