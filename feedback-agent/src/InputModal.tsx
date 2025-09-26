import type { StudentRecord } from "./types/interfaces";

interface InputModalProps {
  modalValue: string;
  setModalValue: (modalValue: string) => void;
  person: string;
  modalKeyStudent: keyof StudentRecord;
  task_num: string;
  feedType: string;
  update_Success_Notes: (
    value: string | boolean,
    person: string,
    modalKeyStudent: keyof StudentRecord,
    task_num: string,
    type: string
  ) => void;
  setOpenModal: (arg0: boolean) => void;
}

const InputModal: React.FC<InputModalProps> = ({
  modalValue,
  setModalValue,
  person,
  modalKeyStudent,
  task_num,
  feedType,
  update_Success_Notes,
  setOpenModal,
}) => {
  return (
    <>
      <div
        key={`topModalDiv-${person}-${task_num}`}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "#001f3f",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        onClick={() => setOpenModal(false)} // close on background click
      >
        <div
          style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "10px",
            width: "400px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
          }}
          onClick={(e) => e.stopPropagation()} // prevent modal close when clicking inside
        >
          <h3 style={{ color: "black" }}>{`${person}-${task_num} ${feedType}`}</h3>
          <textarea
            value={modalValue}
            onChange={(e) => {
              setModalValue(e.target.value);
              update_Success_Notes(e.target.value, person, modalKeyStudent, task_num, feedType);
            }}
            style={{ width: "100%", height: "100px" }}
          />
        </div>
      </div>
    </>
  );
};
export default InputModal;
