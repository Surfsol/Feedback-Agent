import React, { useState } from "react";
import rawFeedback from "./encounters.json";

const feedback = rawFeedback as AllTasks;

interface SessionProps {
  encounter_num: string;
}

interface TaskObj {
  task: string;
  success: boolean; // or boolean if you want
  notes: string;
}

interface TaskNumProps {
  [key: string]: TaskObj;
}

interface AllTasks {
  [key: string]: TaskNumProps;
}

// students keyed by name
type StudentTasks = Record<string, TaskNumProps>;

const Session: React.FC<SessionProps> = ({ encounter_num }) => {
  const [names, setNames] = useState<StudentTasks>({});
  const [newName, setNewName] = useState<string>("");
  const [tasks] = useState<TaskNumProps>(feedback[encounter_num]);

  console.log("in sessions", { names });

  const AddStudent = () => {
    if (newName == "") {
      // alert add new name
    }
    const studentTasks: TaskNumProps = JSON.parse(JSON.stringify(tasks));
    setNames((prev) => ({ ...prev, [newName]: studentTasks }));
    setNewName("");
  };

  const Update_Success_Notes = (
    value: string | boolean,
    person: string,
    task_num: string,
    type: string
  ) => {
    console.log({ value, person, task_num, type });
    //setNames(prev => ...prev)
    setNames((prev) => ({
      ...prev,
      [person]: {
        ...prev[person],
        [task_num]: { ...prev[person][task_num], [type]: value },
      },
    }));
  };

  return (
    <>
      <div>This Session</div>
      <div>Encounter: {encounter_num}</div>
      <div>
        {" "}
        Name :{" "}
        <input
          id='new-name'
          type='text'
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          style={{ width: "60px" }} // small input box
        />
        <button onClick={AddStudent}>Add</button>
        {Object.keys(names).length > 0 &&
          Object.keys(names).map((person) => (
            <div key={`student-${person}`}>
              <h3>{person}</h3>
              {Object.keys(names[person]).map((task_num) => {
                return (
                  <div key={`name-${person}-${task_num}`}>
                    {task_num}
                    <input
                      id={`${person}-${task_num}-success`}
                      type='checkbox'
                      checked={names[person][task_num]["success"]}
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
                      value={names[person][task_num]["notes"]}
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
      </div>
    </>
  );
};
export default Session;
