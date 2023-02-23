import { Component ,OnInit} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-add-act-codes',
  templateUrl: './add-act-codes.component.html',
  styleUrls: ['./add-act-codes.component.scss']
})
export class AddActCodesComponent {

  actCodeForm: FormGroup;
  constructor(private _authService: AuthService,private router:Router) { }

  ngOnInit(): void {
    this.actCodeForm = new FormGroup({
      'actCode': new FormControl(null, [Validators.required]),
    })
  }

  onSubmit() {
    if (this.actCodeForm.status == 'INVALID') {
      alert('გთხოვთ შეავსოთ ყველა საჭირო გრაფა')
    } else {
    this._authService.addActCode(this.actCodeForm.value)
    .subscribe(
      err=>{console.log(err)},
      res => {console.log(res)}
    )
    }
  }
}
