import { HashLoader } from "react-spinners";

/*
 * The Loader component displays a loading spinner with an overlay while content is being loaded.
 * 
 * @param {boolean} isLoading - The page loading or user loading state.
 * @returns {JSX.Element} A JSX element that displays a loading spinner based on the loading state.
 */
export default function Loader({ isLoading }) {
  return (
    // Fixed semi-transparent overlay
    <div className="min-h-screen max-w-screen fixed inset-0 z-[2] flex justify-center items-center bg-[#3f3f3f] bg-opacity-50 backdrop-blur-md">
      {/* Loading spinner */}
      <HashLoader
        color="#e30e30"
        loading={isLoading} // Based on the loading state, show or hide the loading spinner
        size={50}
        speedMultiplier={2}
      />
    </div>
  );
}
