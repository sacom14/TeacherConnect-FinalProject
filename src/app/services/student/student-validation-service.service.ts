import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class StudentValidationServiceService {

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


  //control de validaciones
  public isValidField(form: FormGroup, field: string) {
    return form.controls[field].errors && form.controls[field].touched;
  };
  
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

}
