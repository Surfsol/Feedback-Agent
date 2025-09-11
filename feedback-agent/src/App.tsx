import { useState } from "react";
import Session from "./Session";

function App() {
  const [sessions, setSessions] = useState<string[]>([]);
  const [createNew, setCreateNew] = useState<string>('');
//  const [encounter, setEncounter] = useState<number | undefined>();

  const handleNew = () => {
    // add a new session for encounter number
    if (createNew) {
      setSessions((prev) => [...prev, createNew]);
      setCreateNew('');
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
      </div>
      <button onClick={handleNew}>Create New Session</button>
      <div>Sessions</div>
      {sessions.length > 0 &&
        sessions.map((item) => (
           <div key={item} id={`session-${item}`}>
            {" "}
            <Session encounter_num={item} />{" "}
          </div>
        ))}
    </>
  );
}

export default App;
