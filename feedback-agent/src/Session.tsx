import React, { useState } from "react";

interface SessionProps {
  encounter_num: string;
}

const Session: React.FC<SessionProps> = ({ encounter_num }) => {
  const [names, setNames] = useState<string[]>([]);
  const [newName, setNewName] = useState<string>("");
  const [tasks, setTasks] = useState<[]>([]);

  console.log("in sessions", encounter_num);
  return (
    <>
      <div>This Session</div>
      <div>Encounter: {encounter_num}</div>
      <div>
        {" "}
        Name :{" "}
        <input
          id='add-name'
          type='text'
          value={names ? names[names.length] : ""}
          onChange={(e) => setNewName(e.target.value)}
          style={{ width: "60px" }} // small input box
        />
        <button onClick={() => setNames((prev) => [...prev, newName])}></button>
      </div>
      {names.length > 0 && tasks.length > 0 &&
        names.map((name) => {
            return (
           {tasks.length > 0 && tasks.map((task) => (
          
            <div>
              <div>{name} {task}</div>
              <input
                id={`${name}-${task}`}
                type='text'
                value={names ? names[names.length] : ""}
                onChange={(e) => setNewName(e.target.value)}
                style={{ width: "60px" }} // small input box
              />
            </div>
          ))})
        })}
      <div></div>
    </>
  );
};
export default Session;
