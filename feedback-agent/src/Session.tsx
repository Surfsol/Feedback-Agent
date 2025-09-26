import React, { useState } from "react";
import rawFeedback from "./encounters2.json";
import InputModal from "./InputModal";
import type {
  StudentNames,
  StudentRecord,
  ActiveSessions,
} from "./types/interfaces";

const feedback = rawFeedback as StudentNames;

interface SessionProps {
  session_code: string;
  current_session: StudentNames;
  setSessions: React.Dispatch<React.SetStateAction<ActiveSessions>>;
}

interface ResponseDataProps {
  [session_code: string]: { [student_code: string]: { feedback: "" } };
}

// to add Modal input
// voice input
// Rag, to get examples that are not straight forward

const Session: React.FC<SessionProps> = ({
  session_code,
  current_session,
  setSessions,
}) => {
  const [encounter_num] = useState(() => {
    const match = session_code.match(/^([^-\s]+)/);
    return match ? match[1] : "";
  });
  const [responseData, setResponseData] = useState<ResponseDataProps>();
  console.log({ responseData });
  const [newName, setNewName] = useState<string>("");
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [modalValue, setModalValue] = useState<string>("");
  const [feedType, setFeedType] = useState<string>("");
  const [modalTaskNum, setModalTaskNum] = useState<string>("");
  const [modalPerson, setModalPerson] = useState<string>("");
  const [modalKeyStudent, setModalKeyStudent] =
    useState<keyof StudentRecord>("tasks");
  console.log({ newName });

  const handleGetFeedBack = async () => {
    let objNotes: any = {};
    console.log({ current_session });
    Object.keys(current_session).map((code) => {
      if (!objNotes[code]) {
        objNotes[code] = {};
      }
      Object.keys(current_session[code]).map((item) => {
        if (item == "pass" || item == "notes" || item == "student_name")
          objNotes[code][item] = current_session[code][item];
        if (item == "tasks") {
          Object.keys(current_session[code]["tasks"]).map((task) => {
            if (
              current_session[code]["tasks"][task]["correct"] != "" ||
              current_session[code]["tasks"][task]["incorrect"] != ""
            ) {
              objNotes[code][task] = current_session[code]["tasks"][task];
            }
          });
        }
      });
    });
    //console.log({objNotes, current_session})

    const objPost = {
      lesson: encounter_num,
      session_code: session_code,
      student_codes: objNotes,
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
      let data = await response.json();
      console.log({ data });
      setResponseData(data.feedback);
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  const AddStudent = () => {
    if (newName != "" && encounter_num) {
      const student_code = crypto.randomUUID();
      const removeWhitespace = newName.trim().replace(/\s+/g, " ");
      const tasks = feedback[encounter_num];
      const studentRecords: StudentRecord = JSON.parse(JSON.stringify(tasks));
      studentRecords["student_name"]["name"] = removeWhitespace;
      setSessions((prev) => ({
        ...prev,
        [session_code]: {
          ...prev[session_code],
          [student_code]: studentRecords,
        },
      }));
      setNewName("");
    }
  };

  const handleInputModal = (
    current_value: string,
    person: string,
    item: keyof StudentRecord,
    task_num: string,
    type: string
  ) => {
    setModalValue(current_value);
    setFeedType(type);
    setModalTaskNum(task_num);
    setModalPerson(person);
    setModalKeyStudent(item);
    setOpenModal(true);
  };

  const update_Success_Notes = (
    value: string | boolean,
    person: string,
    item: keyof StudentRecord, // (tasks, notes, pass)
    task_num: string,
    type: string
  ) => {
    console.log({ item });
    if (item == "tasks") {
      setSessions((prev) => ({
        ...prev,
        [session_code]: {
          ...prev[session_code],
          [person]: {
            ...prev[session_code][person],
            [item]: {
              ...prev[session_code][person][item],
              [task_num]: {
                ...prev[session_code][person][item][task_num],
                [type]: value,
              },
            },
          },
        },
      }));
    } else {
      console.log({ item, type, value });
      setSessions((prev) => ({
        ...prev,
        [session_code]: {
          ...prev[session_code],
          [person]: {
            ...prev[session_code][person],
            [item]: {
              ...prev[session_code][person][item],
              [type]: value,
            },
          },
        },
      }));
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <>
      <div>Encounter: {encounter_num}</div> Name :{" "}
      <input
        id='new-name'
        type='text'
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
        style={{ width: "60px" }} // small input box
      />
      <button onClick={AddStudent}>Add</button>
      <button onClick={() => handleGetFeedBack()} style={{ margin: "10px" }}>
        Get FeedBack
      </button>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {Object.keys(current_session).length > 0 &&
          Object.keys(current_session).map((person) => (
            <>
              <div key={`student-${person}`}>
                <h3>{current_session[person]["student_name"]["name"]}</h3>
                {Object.keys(current_session[person]).map((item) => {
                  console.log({ person });
                  if (item == "tasks") {
                    return Object.keys(current_session[person]["tasks"]).map(
                      (task_num: string) => (
                        <React.Fragment key={`frag-${person}-${task_num}`}>
                          <div key={`name-${person}-${task_num}`}>
                            {task_num}
                            <input
                              id={`${person}-${task_num}-success`}
                              type='checkbox'
                              checked={
                                current_session[person]["tasks"][task_num][
                                  "success"
                                ]
                              }
                              onChange={(e) =>
                                update_Success_Notes(
                                  e.target.checked,
                                  person,
                                  item,
                                  task_num,
                                  "success"
                                )
                              }
                            />
                            <input
                              id={`correct-${person}-${task_num}`}
                              type='text'
                              value={
                                current_session[person]["tasks"][task_num][
                                  "correct"
                                ]
                              }
                              placeholder='correct'
                              readOnly
                              style={{ width: "40px" }}
                              onClick={() =>
                                handleInputModal(
                                  current_session[person]["tasks"][task_num][
                                    "correct"
                                  ],
                                  person,
                                  item,
                                  task_num,
                                  "correct"
                                )
                              }
                            />
                            {current_session[person]["tasks"][task_num][
                              "success"
                            ] == false && (
                              <input
                                id={`incorrect-${person}-${task_num}`}
                                type='text'
                                value={
                                  current_session[person]["tasks"][task_num][
                                    "incorrect"
                                  ]
                                }
                                placeholder='incorrect'
                                readOnly
                                style={{ width: "50px" }}
                                onClick={() =>
                                  handleInputModal(
                                    current_session[person]["tasks"][task_num][
                                      "incorrect"
                                    ],
                                    person,
                                    item,
                                    task_num,
                                    "incorrect"
                                  )
                                }
                              />
                            )}
                          </div>
                          {openModal && (
                            <InputModal
                              key={`input-modal${modalPerson}-${modalTaskNum}`}
                              modalValue={modalValue}
                              setModalValue={setModalValue}
                              person={modalPerson}
                              modalKeyStudent={modalKeyStudent}
                              task_num={modalTaskNum}
                              feedType={feedType}
                              update_Success_Notes={update_Success_Notes}
                              setOpenModal={setOpenModal}
                            />
                          )}
                        </React.Fragment>
                      )
                    );
                  } else if (item == "notes") {
                    return (
                      <div key={`name-${person}-${item}`}>
                        {item}
                        <input
                          id={`correct-${person}-${item}`}
                          type='text'
                          value={current_session[person][item]["teacher_notes"]}
                          placeholder='notes'
                          style={{ width: "40px" }}
                          readOnly
                          onClick={() =>
                            handleInputModal(
                              current_session[person][item]["teacher_notes"],
                              person,
                              item,
                              "blank",
                              "teacher_notes"
                            )
                          }
                        />
                      </div>
                    );
                  } else if (item == "pass") {
                    return (
                      <div key={`name-${person}-${item}`}>
                        {item}
                        <input
                          id={`${person}-${item}-success`}
                          type='checkbox'
                          checked={current_session[person][item]["success"]}
                          onChange={(e) =>
                            update_Success_Notes(
                              e.target.checked,
                              person,
                              item,
                              "blank",
                              "success"
                            )
                          }
                        />
                      </div>
                    );
                  }
                })}
              </div>
              {responseData &&
                responseData?.[session_code][person]?.feedback && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      border: "1px solid #ccc",
                      padding: "5px 10px",
                      borderRadius: "6px",
                      backgroundColor: "#f9f9f9",
                      color: "#000",
                      maxWidth: "50%", // 🚨 limits width to half of page
                      wordWrap: "break-word", // wraps long words
                      whiteSpace: "pre-wrap", // preserves line breaks
                      overflowWrap: "break-word",
                    }}
                  >
                    <span style={{ flex: 1 }}>
                      {responseData[session_code][person]["feedback"]}
                    </span>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          responseData[session_code][person]["feedback"]
                        )
                      }
                    >
                      Copy
                    </button>
                  </div>
                )}
            </>
          ))}
      </div>
    </>
  );
};
export default Session;
