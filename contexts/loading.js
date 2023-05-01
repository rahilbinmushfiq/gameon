import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";

// Create a new context for loading state management
const LoadingContext = createContext({
  isPageLoading: false,
  setIsPageLoading: null
});

/*
 * A provider component that manages a loading state for a page based on router events.
 * 
 * @param {React.ReactNode} children - The child components to render within the provider.
 * @returns {JSX.Element} A wrapper element that provides a loading state to its children.
*/
export const LoadingProvider = ({ children }) => {
  const router = useRouter();
  const [isPageLoading, setIsPageLoading] = useState(false);

  useEffect(() => {
    // Add event listeners to route changes and update the loading state accordingly
    router.events.on("routeChangeStart", () => setIsPageLoading(true));
    router.events.on("routeChangeComplete", () => setIsPageLoading(false));

    // Clean up the event listeners when the component is unmounted
    return () => {
      router.events.off("routeChangeStart", () => setIsPageLoading(true));
      router.events.off("routeChangeComplete", () => setIsPageLoading(false));
    };
  }, []);

  // Provide the loading state to child components through context
  return (
    <LoadingContext.Provider value={{ isPageLoading, setIsPageLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

// Custom hook to access the loading context
export const useLoading = () => {
  return useContext(LoadingContext);
};
