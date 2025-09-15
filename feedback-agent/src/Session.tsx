import React, { useState } from "react";
import rawFeedback from "./encounters.json";

const feedback = rawFeedback as AllTasks;

interface AllTasks {
  [key: string]: TaskNumProps;
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
  [sessionCode: string]: StudentTasks;
}

interface SessionProps {
  session_code: string;
  current_session: StudentTasks;
  setSessions: React.Dispatch<React.SetStateAction<SessionStudentTasks>>;
}

const Session: React.FC<SessionProps> = ({
  session_code,
  current_session,
  setSessions,
}) => {
  const [encounter_num] = useState(() => {
    const match = session_code.match(/^([^-\s]+)/);
    return match ? match[1] : "";
  });
  const [responseData, setResponseData] = useState<string>("");
  const [newName, setNewName] = useState<string>("");

  const handleGetFeedBack = async () => {
    const objPost = {
      lesson: encounter_num,
      code: session_code,
      comments: current_session,
    };
    try {
      const response = await fetch("http://127.0.0.1:5000/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(objPost),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log("666666666666666666677777777777", data.feedback.feedback);
      setResponseData(data.feedback.feedback);
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  const AddStudent = () => {
    if (newName != "" && encounter_num) {
      const tasks = feedback[encounter_num];
      const studentTasks: TaskNumProps = JSON.parse(JSON.stringify(tasks));
      setSessions((prev) => ({
        ...prev,
        [session_code]: { ...prev[session_code], [newName]: studentTasks },
      }));
      setNewName("");
    }
  };

  const Update_Success_Notes = (
    value: string | boolean,
    person: string,
    task_num: string,
    type: string
  ) => {
    setSessions((prev) => ({
      ...prev,
      [session_code]: {
        ...prev[session_code],
        [person]: {
          ...prev[session_code][person],
          [task_num]: {
            ...prev[session_code][person][task_num],
            [type]: value,
          },
        },
      },
    }));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(responseData);
  };

  return (
    <>
      <div>This Session</div>
      <div>Encounter: {encounter_num}</div> Name :{" "}
      <input
        id='new-name'
        type='text'
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
        style={{ width: "60px" }} // small input box
      />
      <button onClick={AddStudent}>Add</button>
      <button onClick={() => handleGetFeedBack()}>Get FeedBack</button>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {Object.keys(current_session).length > 0 &&
          Object.keys(current_session).map((person) => (
            <div key={`student-${person}`}>
              <h3>{person}</h3>
              {Object.keys(current_session[person]).map((task_num) => {
                return (
                  <div key={`name-${person}-${task_num}`}>
                    {task_num}
                    <input
                      id={`${person}-${task_num}-success`}
                      type='checkbox'
                      checked={current_session[person][task_num]["success"]}
                      onChange={(e) =>
                        Update_Success_Notes(
                          e.target.checked,
                          person,
                          task_num,
                          "success"
                        )
                      }
                    />
                    <input
                      id={`notes-${person}-${task_num}`}
                      type='text'
                      value={current_session[person][task_num]["notes"]}
                      onChange={(e) =>
                        Update_Success_Notes(
                          e.target.value,
                          person,
                          task_num,
                          "notes"
                        )
                      }
                    />
                  </div>
                );
              })}
            </div>
          ))}
        {responseData && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              border: "1px solid #ccc",
              padding: "5px 10px",
              borderRadius: "6px",
              backgroundColor: "#f9f9f9",
              maxWidth: "50%", // 🚨 limits width to half of page
              wordWrap: "break-word", // wraps long words
              whiteSpace: "pre-wrap", // preserves line breaks
              overflowWrap: "break-word",
            }}
          >
            <span style={{ flex: 1 }}>{responseData}</span>
            <button onClick={copyToClipboard}>Copy</button>
          </div>
        )}
      </div>
    </>
  );
};
export default Session;
