import { AbstractControl, FormGroup } from "@angular/forms";

export class CustomValidation {

    static passwordPattern(email:AbstractControl) {
        const pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/
        if (!pattern.test(email.value)){
            return { passwordpattern: true } //Sí HAY ERROR
        }
        return null //null si NO hay error
    }

    static confirmPassword(password: string, matchingPass: string) {
        return (formGroup: FormGroup) => {
          let control = formGroup.controls[password];
          let matchingControl = formGroup.controls[matchingPass]
          if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ confirmpassword: true });
          } else {
            matchingControl.setErrors(null);
          }
        };
      }
}