import { Injectable } from '@angular/core';
import { AbstractControl, FormArray, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  //name
  public namePattern: string = '^[a-zA-Z]{2,}(?: [a-zA-Z]+)*$';

  //surname
  public surnamePattern: string = '^[a-zA-Z]{2,}(?: [a-zA-Z]+)*$';

  //email
  public emailPattern: string = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";

  //phone
  public phonePattern: string = "^[0-9]{9}$";

  // birthdate
  public birthdatePattern: string = "^([1-2][0-9]{3})-(0[1-9]|1[0-2])-([0-2][0-9]|3[0-1])$";

  // password
  public passwordPattern: string = "^[a-zA-Z0-9]{6,}$";


  //validations control
  public isValidField(form: FormGroup, field: string) {
    return form.controls[field].errors && form.controls[field].touched;
  };

  //check if 2 items are equals (pasword y password2)
  public isPasswordOneEqualPasswordTwo(field1: string, field2: string) {
    //función que sirve para evaluar el formgroup
    return (formGroup: AbstractControl): ValidationErrors | null => {

      //cogemos el valor de la password y password2
      const fieldValue = formGroup.get(field1)?.value;
      const fieldValue2 = formGroup.get(field2)?.value;

      //hacemos la comparación para ver si son iguales los password
      if (fieldValue !== fieldValue2) {
        formGroup.get(field2)?.setErrors({ notEqual: true });
        return { notEqual: true }
      }
      formGroup.get(field2)?.setErrors(null);
      return null;
    };
  }

  public imageExtensionValidator(control: AbstractControl): ValidationErrors | null {
    const file = control.value;
    if (file) {
      const extension = file.name.split('.').pop().toLowerCase();
      const validExtensions = ['jpg', 'jpeg', 'png', 'webp'];
      if (!validExtensions.includes(extension)) {
        return { invalidExtension: true };
      }
    }
    return null;
  }

  //we want minium one item selected on checkbox
  public checkMinOneSelectedValidator(minRequired = 1): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      // Ensure the control is a FormArray
      if (control instanceof FormArray) {
        const totalSelected = control.controls
          // Filter the checked control values
          .filter(ctrl => ctrl.value).length;

        // Return null if the condition is met, or an error object if not
        return totalSelected >= minRequired ? null : { required: true };
      }
      // Return null if control is not a FormArray
      return null;
    };
  }
}
