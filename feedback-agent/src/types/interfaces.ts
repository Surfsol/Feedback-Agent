interface TaskObj {
  task: string;
  success: boolean;
  correct: string;
  incorrect: string;
}

interface StudentRecord {
  student_name: {name: string};
  notes: { teacher_notes: string };
  pass: { success: boolean };
  tasks: Record<string, TaskObj>; // task numbers like "2.1.a", "3.1"
}

// {   "student_name": {"name": ""},
//     "notes": {"teacher_notes": ""},
//     "pass": {"success": true},
//     "tasks": {
//       "2.1.a": {
//         "task": "Can say their name",
//         "success": true,
//         "correct": "",
//         "incorrect": ""
//       },
//       "2.1.b": {
//         "task": "Can ask someone for their name",
//         "success": true,
//         "correct": "",
//         "incorrect": ""
//       }
//     }

type StudentNames = Record<string, StudentRecord>; // keyed by student id

//{'lesson': '30', 'code': '30-13:58:23', 'comments': {'Claudia': { "notes": {"teacher_notes": ""},
//                                                                   "pass": {"success": true}, 
//                                                                    "tasks": {'2.1': {'task': 'Can use general language related to a job', 'success': True, 'correct': "I'm in charge of ,  I have to , I manage, My duties are ...., I am responsible for reporting ....",
//                                                       'Monique': {"notes": .....}}

type ActiveSessions = Record<string, Record<string, StudentRecord>>;

interface SessionRecord {
  lesson: string;
  session_code: string;
  student_codes?: StudentNames; 
  // { "Claudia": StudentRecord, "Paola": StudentRecord }
}

export type { TaskObj, StudentRecord, StudentNames, SessionRecord, ActiveSessions };