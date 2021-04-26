import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService, WebResult} from '../../auth/auth.service';
import {checkCircleIcon, ClarityIcons, exclamationCircleIcon} from '@cds/core/icon';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  form: FormGroup;
  error: undefined|string;
  spinner = false;
  showSucces = false;


  constructor( private router: Router, private formBuilder: FormBuilder, private authService: AuthService) {
    this.form = this.formBuilder.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', Validators.required],
      newPasswordRepeat: ['', Validators.required]
    });
    ClarityIcons.addIcons(exclamationCircleIcon);
    ClarityIcons.addIcons(checkCircleIcon);
  }

  submit() {
    if (this.form.valid) {
      this.spinner = true;
      if (this.form.value.newPassword != this.form.value.newPasswordRepeat) {
        this.error = 'The new password and the new password repetition must be the same';
        this.spinner = false;
      } else {
        this.authService.changeUserPassword(this.form.value.oldPassword, this.form.value.newPassword).subscribe((result: WebResult) => {
          this.spinner = false;
          if (result.success) {
            this.showSucces = true;
            this.error = undefined;
          } else {
            this.showSucces = false;
            this.error = result.error;
          }
          this.spinner = false;
        });
      }
    }
  }

}
