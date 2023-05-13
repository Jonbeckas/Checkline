import { Component, OnInit } from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService, WebResult} from '../../auth/auth.service';
import {checkCircleIcon, ClarityIcons, exclamationCircleIcon} from '@cds/core/icon';
import {UserService} from '../services/user.service';

@Component({
  selector: 'app-new-user-modal',
  templateUrl: './new-user-modal.component.html',
  styleUrls: ['./new-user-modal.component.scss']
})
export class NewUserModalComponent implements OnInit {

  form: UntypedFormGroup;
  error: undefined|string;
  spinner = false;
  showSucces = false;
  open = true;


  constructor( private router: Router, private formBuilder: UntypedFormBuilder, private userService: UserService) {
    this.form = this.formBuilder.group({
      username: ['', [Validators.required]],
      firstname: ['', Validators.required],
      name: ['', Validators.required],
      password: ['', Validators.required]
    });
    ClarityIcons.addIcons(exclamationCircleIcon);
    ClarityIcons.addIcons(checkCircleIcon);
  }

  ngOnInit(): void {
  }

  submit() {

  }

  onOk() {
    if (this.form.valid) {
      this.spinner = true;
      this.userService.addUser(this.form.value.username, this.form.value.firstname, this.form.value.name, this.form.value.password).subscribe((result: WebResult) => {
        if (result.success) {
          this.spinner = false;
          this.open = false;
        } else {
          this.spinner = false;
          this.error = result.error;
        }

      });
    }
  }
}
