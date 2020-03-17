import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  repeatPassword: any;
  password: any;

  constructor() { }

  ngOnInit(): void {
  }

}


