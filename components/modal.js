import { BsChevronLeft, BsFillSendFill } from "react-icons/bs";

export default function Modal({ type, id, heading, description, setIsModalOpen, handleButtonClick = () => null, handleSubmission = (e) => e.preventDefault(), children }) {
  const Tag = type === "send" ? "div" : "form";

  return (
    <div
      className="fixed inset-0 w-screen h-screen flex justify-center items-center bg-[#3f3f3f] bg-opacity-50 backdrop-blur-md"
      id={id}
      onClick={(event) => event.target.id === id && setIsModalOpen(false)}
    >
      <div className="mx-6 p-8 space-y-8 rounded-md bg-[#1f1f1f]">
        <div className="space-y-2">
          <h3 className="text-2xl font-bold">{heading}</h3>
          <p>{description}</p>
        </div>
        <Tag className="space-y-8" onSubmit={handleSubmission}>
          {children}
          <div className="grid grid-cols-2 gap-4 [&>button]:h-12">
            <button
              className="secondary-btn hover:bg-[#ffffff]"
              type="button"
              onClick={() => setIsModalOpen(false)}
            >
              <BsChevronLeft size={12} color="#1f1f1f" />
              <p>Cancel</p>
            </button>
            <button
              className="primary-btn hover:bg-[#fe0303]"
              type={type === "send" ? "button" : "submit"}
              onClick={handleButtonClick}
            >
              <p>{type === "confirm" ? "Confirm" : "Send Link"}</p>
              {type === "send" && <BsFillSendFill size={12} />}
            </button>
          </div>
        </Tag>
      </div>
    </div>
  );
}