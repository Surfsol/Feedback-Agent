import { useState } from "react";
import Session from "./Session";
import rawFeedback from "./encounters.json";

const feedback = rawFeedback as AllTasks;

interface AllTasks {
  [key: string] : TaskNumProps
}

interface TaskObj {
  task: string;
  success: boolean; // or boolean if you want
  notes: string;
}

interface TaskNumProps {
  [key: string]: TaskObj;
}

// students keyed by name
type StudentTasks = Record<string, TaskNumProps>;

interface SessionStudentTasks {
    [sessionCode: string] : StudentTasks
}   

function App() {
  const [sessions, setSessions] = useState<SessionStudentTasks>({});
  const [createNew, setCreateNew] = useState<string>('');
  const [newName, setNewName] = useState('')
//  const [encounter, setEncounter] = useState<number | undefined>();

  const handleNew = () => {
    const now = new Date().toString();
    const match = now.match(/\b\d{2}:\d{2}:\d{2}\b/);
    // add a new session for encounter number
    if (createNew) {
      const taskObj = feedback[createNew]
      const studentTasks: TaskNumProps = JSON.parse(JSON.stringify(taskObj));
      const objKey = `${createNew}-${match}`
      setSessions((prev) => ({...prev, [objKey] : {...prev[objKey], [newName] : studentTasks}}));
      setCreateNew('');
      setNewName('')
    }
  };
  console.log({sessions})

  return (
    <>
      <h1>WSE Feedback</h1>
      <div>
        <label htmlFor='encounter-num'>Encounter</label>
        <br />
        <input
          id='createNew-num'
          type='text'
          value={createNew}
          onChange={(e) => setCreateNew(e.target.value)}
          style={{ width: "60px" }} // small input box
        />
        <br />
        <input
          id='createNew-name'
          type='text'
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          style={{ width: "60px" }} // small input box
        />
        <br />
      </div>
      <button onClick={handleNew}>Create New Session</button>
      <div>Sessions</div>
      {Object.keys(sessions).length > 0 &&
        Object.keys(sessions).map((code) => (
           <div key={code} id={`session-${code}`}>
            {" "}
            <Session session_code={code} current_session = {sessions[code]} setSessions={setSessions} />{" "}
          </div>
        ))}
    </>
  );
}

export default App;
