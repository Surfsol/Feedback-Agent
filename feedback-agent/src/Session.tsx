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

interface StudentTaskNumProps {
  [studentName: string]: TaskNumProps;
}

const Session: React.FC<SessionProps> = ({ encounter_num }) => {
  const [names, setNames] = useState<StudentTaskNumProps[]>([]);
  const [newName, setNewName] = useState<string>('')
  const [tasks, setTasks] = useState<TaskNumProps>(feedback[encounter_num]);
  const [tasksArray] = useState<string[]>(Object.keys(feedback[encounter_num]));
  const [taskNum, settaskNum] = useState<number>(0);
  console.log({ feedback });

  console.log("in sessions", { names });

  const AddStudent = () => {
    if (newName == ""){
        // alert add new name
    }
    const studentTasks: TaskNumProps = JSON.parse(JSON.stringify(tasks));
    setNames((prev) => [...prev, { [newName]: studentTasks }]);
    setNewName("")
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
        {tasksArray &&
          tasksArray.map((item) => {
            return (
              <div key={`name-${item}`}>
                {" "}
                {item}
                <input
                  id={`feed-${item}`}
                  type='text'
                  value={tasks[item]["notes"]}
                  onChange={(e) =>
                    setTasks({
                      ...tasks,
                      [item]: { ...tasks["item"], ["notes"]: e.target.value },
                    })
                  }
                  style={{ width: "60px" }} // small input box
                />
              </div>
            );
          })}
      </div>
    </>
  );
};
export default Session;
