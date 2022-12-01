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
          let emailControl = formGroup.controls[password];
          let emailMatchControl = formGroup.controls[matchingPass]
          if (emailControl.value !== emailMatchControl.value) {
            return {confirmpassword:true}
          }
          return null
        };
      }
}