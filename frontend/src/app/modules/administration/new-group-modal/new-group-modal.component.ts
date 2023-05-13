import { Component, OnInit } from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {UserService} from '../services/user.service';
import {checkCircleIcon, ClarityIcons, exclamationCircleIcon} from '@cds/core/icon';
import {WebResult} from '../../auth/auth.service';
import {GroupService} from '../services/group.service';

@Component({
  selector: 'app-new-group-modal',
  templateUrl: './new-group-modal.component.html',
  styleUrls: ['./new-group-modal.component.scss']
})
export class NewGroupModalComponent implements OnInit {


  form: UntypedFormGroup;
  error: undefined|string;
  spinner = false;
  showSucces = false;
  open = true;


  constructor( private router: Router, private formBuilder: UntypedFormBuilder, private groupService: GroupService) {
    this.form = this.formBuilder.group({
      groupname: ['', [Validators.required]],
    });
    ClarityIcons.addIcons(exclamationCircleIcon);
    ClarityIcons.addIcons(checkCircleIcon);
  }

  ngOnInit(): void {
  }


  onOk() {
    if (this.form.valid) {
      this.spinner = true;
      this.groupService.addGroup(this.form.value.groupname).subscribe((result: WebResult) => {
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
