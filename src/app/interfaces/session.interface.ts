export interface SessionResponse {
  sessions: Session[];
}

export interface Session {
  id_session:            number;
  session_name:          string;
  session_objective:     string;
  session_start:         Date;
  session_end:           Date;
  session_tasks:         null | string;
  session_payed:         SessionPayed | null;
  fk_id_student_subject: number;
  create_at_session:     Date;
  update_at_session:     Date;
  id_student_subject:    number;
  fk_id_student:         number;
  fk_id_subject:         number;
}

export interface SessionPayed {
  type: string;
  data: number[];
}
