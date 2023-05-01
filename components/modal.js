import { BsChevronLeft, BsFillSendFill } from "react-icons/bs";

/*
 * Renders a dynamic content-based modal window with a backdrop, a heading, a description, a primary button, a secondary button, and either a form or a div content, depending on the modal 'type' passed as a prop. The modal can be closed by clicking outside of it or on the cancel button, and has a primary button that either submits the form or triggers an action based on the modal type.
 * 
 * @param {string} type - The type of modal (either "send" or "confirm").
 * @param {string} id - The HTML id attribute of the modal backdrop element.
 * @param {string} heading - The heading text of the modal.
 * @param {string} description - The description text of the modal.
 * @param {function} setIsModalOpen - A function that sets the modal state.
 * @param {function} handleButtonClick - (optional) A function that handles the click event of the primary button.
 * @param {function} handleSubmission - (optional) A function that handles the submission event of the form.
 * @param {React.ReactNode} children - (optional) The child components to render within the Modal component.
 * 
 * @returns {JSX.Element} A JSX element that displays a modal window with dynamic content.
 */
export default function Modal({ type, id, heading, description, setIsModalOpen, handleButtonClick = () => null, handleSubmission = (e) => e.preventDefault(), children }) {
  // Dynamic HTML tag for the modal content based on the modal type
  const Tag = type === "send" ? "div" : "form";

  return (
    /* Modal backdrop */
    <div
      className="fixed inset-0 z-[1] w-screen h-screen flex justify-center items-center bg-[#3f3f3f] bg-opacity-50 backdrop-blur-md"
      id={id}
      onClick={(event) => event.target.id === id && setIsModalOpen(false)}
    >
      {/* Modal container */}
      <div className="space-y-8 p-8 mx-6 rounded-md bg-[#1f1f1f] sm:p-10 sm:mx-40 md:mx-48 lg:w-2/5 xl:w-1/3 2xl:w-1/4 2xl:p-8">
        {/* Modal header */}
        <div className="space-y-2">
          <h3 className="text-2xl font-bold">{heading}</h3>
          <p>{description}</p>
        </div>
        {/* Modal content that renders either a form or a div,
            depending whether it submits a form or triggers an action
            based on the modal type
        */}
        <Tag className="space-y-8" onSubmit={handleSubmission}>
          {children}
          {/* Modal buttons */}
          <div className="grid grid-cols-2 gap-4 [&>button]:h-12">
            {/* Cancel button that closes the modal */}
            <button
              className="secondary-btn"
              type="button"
              onClick={() => setIsModalOpen(false)}
            >
              <BsChevronLeft size={12} color="#1f1f1f" />
              <p>Cancel</p>
            </button>
            {/* Primary button that either submits the form or triggers an action based on the modal type */}
            <button
              className="primary-btn hover:bg-[#fe0303]"
              type={type === "send" ? "button" : "submit"} // Regular or submit button based on the modal type
              onClick={handleButtonClick}
            >
              {/* Dynamic text on the button based on the modal type */}
              <p>{type === "confirm" ? "Confirm" : "Send Link"}</p>
              {// If the modal is used for sending a link, render a send icon beside the text
                type === "send" && <BsFillSendFill size={12} />
              }
            </button>
          </div>
        </Tag>
      </div>
    </div>
  );
}
