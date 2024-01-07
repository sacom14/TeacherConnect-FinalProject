import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class TeacherValidationServiceService {

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


  //control de validaciones
  public isValidField(form: FormGroup, field: string) {
    return form.controls[field].errors && form.controls[field].touched;
  };

  //para comprobar si dos campos son iguales (pasword y password2)
  public isPasswordOneEqualPasswordTwo(password: string, password2: string) {
    //función que sirve para evaluar el formgroup
    return (formGroup: AbstractControl): ValidationErrors | null => {

      //cogemos el valor de la password y password2
      const passwordValue = formGroup.get(password)?.value;
      const passwordValue2 = formGroup.get(password2)?.value;

      //hacemos la comparación para ver si son iguales los password
      if (passwordValue !== passwordValue2) {
        formGroup.get(password2)?.setErrors({ notEqual: true });
        return { notEqual: true }
      }
      formGroup.get(password2)?.setErrors(null);
      return null;
    };
  }

}
