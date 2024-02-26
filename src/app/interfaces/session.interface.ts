export interface SessionResponse {
  sessions: Session[];
}

export interface SessionPost {
  session_name: string;
  session_objective: string;
  session_start: Date;
  session_end: Date;
  session_tasks: null | string;
  session_material: string | null;
}

export interface SessionPut {
  session_name: string;
  session_objective: string;
  session_start: Date;
  session_end: Date;
  session_tasks: null | string;
  session_material: string | null;
  session_payed: SessionPayed;
}

export interface Session {
  id_session: number;
  session_name: string;
  session_objective: string;
  session_start: Date;
  session_end: Date;
  session_tasks: string;
  session_material: string | null;
  session_payed: SessionPayed;
  fk_id_student_subject: number;
  create_at_session: Date;
  update_at_session: Date;
  student_name: string;
  id_student: number;
  subject_name: string;
  id_subject: number;
}

export interface SessionPayed {
  type: string;
  data: number[];
}

//Sessions from teacher Id
export interface SessionFromTeacherIDResponse {
  sessions: SessionFromTeacherId[];
}

export interface SessionFromTeacherId {
  id_session: number;
  session_name: string;
  session_objective: string;
  session_start: Date;
  session_end: Date;
  session_tasks: string;
  session_material: string | null;
  session_payed: SessionPayed | null;
  fk_id_student_subject: number;
  create_at_session: Date;
  update_at_session: Date;
  student_name: string;
  id_student: number;
  subject_name: string;
  id_subject: number;
}

export interface SessionPayed {
  type: string;
  data: number[];
}

export interface PayedSessionResponse {
  sessions: Session[];
}
