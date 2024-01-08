//https://app.quicktype.io/
export interface TeacherResponse {
  teachers: Teacher[];
}

export interface Teacher {
  teacher_name:      string;
  teacher_surname:   string;
  teacher_email:     string;
  teacher_password:  string;
  teacher_phone:     string;
  teacher_birthdate: Date;
  teacher_photo:     string;
}

export interface TeacherEmailCheckResponseMessage {
  message: string;
}
