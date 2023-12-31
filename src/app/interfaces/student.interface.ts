export interface StudentResponse {
  students: Student[];
}

export interface Student {
  id_student:           number;
  student_name:         string;
  student_surname:      string;
  student_email:        string;
  student_birthdate:    Date;
  student_phone:        string;
  student_photo:        string;
  fk_id_teacher:        number;
  fk_id_academic_year:  number;
  fk_id_payment_method: number;
  create_at_student:    Date;
  update_at_student:    Date;
}
