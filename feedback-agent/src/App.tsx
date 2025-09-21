import { useState } from "react";
import Session from "./Session";

interface TaskObj {
  task: string;
  success: boolean; // or boolean if you want
  correct: string;
  incorrect: string;
}

interface TaskNumProps {
  [key: string]: TaskObj;
}

// students keyed by name
type StudentTasks = Record<string, TaskNumProps>;

interface SessionStudentTasks {
  [sessionCode: string]: StudentTasks;
}

function App() {
  const [sessions, setSessions] = useState<SessionStudentTasks>({});
  const [createNew, setCreateNew] = useState<string>("");

  const handleNew = () => {
    const now = new Date().toString();
    const match = now.match(/\b\d{2}:\d{2}:\d{2}\b/);
    // add a new session for encounter number
    if (createNew) {
      const objKey = `${createNew}-${match}`;
      setSessions((prev) => ({ ...prev, [objKey]: { ...prev[objKey] } }));
      setCreateNew("");
    }
  };
  console.log({ sessions });

  return (
    <>
      <h1>WSE Feedback</h1>
      <div>
        <label htmlFor='encounter-num'>Encounter</label>
        <br />
        <label htmlFor='createNew-num'>Encounter Num</label>
        <input
          id='createNew-num'
          type='text'
          value={createNew}
          onChange={(e) => setCreateNew(e.target.value)}
          style={{ width: "60px" }} // small input box
        />
        <br />
      </div>
      <button onClick={handleNew}>Create New Session</button>
      <div>Sessions</div>
      {Object.keys(sessions).length > 0 &&
        Object.keys(sessions).map((code) => (
          <div
            key={code}
            id={`session-${code}`}
            style={{
              border: "1px solid #ccc", // light gray border
              borderRadius: "8px", // rounded corners
              padding: "10px", // space inside the box
              marginBottom: "15px", // space between sections
            }}
          >
            {" "}
            <Session
              session_code={code}
              current_session={sessions[code]}
              setSessions={setSessions}
            />{" "}
          </div>
        ))}
    </>
  );
}

export default App;
