import { HashLoader } from "react-spinners";

export default function Loader({ isLoading }) {
  return (
    <div className="min-h-screen max-w-screen fixed inset-0 z-[2] flex justify-center items-center bg-[#3f3f3f] bg-opacity-50 backdrop-blur-md">
      <HashLoader
        color="#e30e30"
        loading={isLoading}
        size={50}
        speedMultiplier={2}
      />
    </div>
  );
}
