import { useState } from "react";
import Session from "./Session";
import type {  SessionRecord } from "./types/interfaces";


function App() {
  const [sessions, setSessions] = useState<Record<string, SessionRecord>>({});
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

  return (
    <div style={{ backgroundColor: "#001f3f", minHeight: "100vh", color: "white", padding: "20px" }}>
      <h1>WSE Feedback</h1>
      <div>
        <br />
        <label htmlFor='createNew-num' style={{ marginRight: "8px" }}>Encounter #</label>
        <input
          id='createNew-num'
          type='text'
          value={createNew}
          onChange={(e) => setCreateNew(e.target.value)}
          style={{ width: "20px", marginBottom: "5px" }} // small input box
        />
        <br />
      </div>
      <button onClick={handleNew} style={{ marginBottom: "15px" }}>Create New Session</button>
      <br/>
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
    </div>
  );
}

export default App;
