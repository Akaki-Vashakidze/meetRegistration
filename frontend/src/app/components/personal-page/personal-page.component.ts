import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-personal-page',
  templateUrl: './personal-page.component.html',
  styleUrls: ['./personal-page.component.scss']
})
export class PersonalPageComponent implements OnInit {
userInfo:any;
personalInfoForm:FormGroup
edit : boolean = false;
info = localStorage.getItem('user').split('/')

constructor(private _dialog:MatDialog){}

ngOnInit(): void {

  this.userInfo = {
    name:this.info[0],
    lastname:this.info[1],
    email:this.info[2],
    mobile:this.info[3],
    userID:this.info[4]
  }

  this.personalInfoForm = new FormGroup({
    'email': new FormControl(null, [Validators.required, Validators.email]),
    'name': new FormControl(null, [Validators.required]),
    'lastname': new FormControl(null, [Validators.required]),
    'mobile': new FormControl(null, [Validators.required,Validators.minLength(9), Validators.maxLength(9),]),
    'password': new FormControl(null, [Validators.required,Validators.minLength(8)])
  })
}

editMode(){
 this.edit = true;
 this.personalInfoForm.patchValue({
  'name':this.info[0],
  'lastname':this.info[1],
  'email':this.info[2],
  'mobile':this.info[3],
  'userID':this.info[4]
 })
}

onSubmit(){
  if (this.personalInfoForm.status == 'INVALID') {
    this._dialog.open(AlertDialogComponent,{data:{content:'გთხოვთ შეავსოთ ყველა საჭირო გრაფა'}})
  } else {
    console.log(this.personalInfoForm.value)
    alert('ეს ფუნქცია მალე დაემატება')
  }
}
}
