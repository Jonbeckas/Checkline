import {Component, OnInit, ViewChild} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import {Router, RouteReuseStrategy} from '@angular/router';
import {environment} from '../../../../environments/environment';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService, WebResult} from '../../auth/auth.service';
import {ClarityIcons, exclamationCircleIcon, windowCloseIcon} from '@cds/core/icon';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  error: undefined|string;
  spinner = false;



  constructor( private router: Router, private formBuilder: FormBuilder, private authService: AuthService) {
    this.form = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', Validators.required]
    });

    authService.isvalid().subscribe((next) => {
      if (next) {
        this.router.navigate(["welcome"]);
      }
    })
  }

  submit() {
    if (this.form.valid) {
      this.spinner = true;
      this.authService.login(this.form.value.username, this.form.value.password).subscribe((result: WebResult) => {
        this.spinner = false;
        if (result.success) {
          this.router.navigateByUrl('/welcome');
        } else {
          this.error = result.error;
        }
      });
    }
  }

  ngOnInit(): void {
    ClarityIcons.addIcons(exclamationCircleIcon);
  }
}


