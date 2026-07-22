import { createContext, useContext, useState, useEffect } from "react";

const DarkModeContext = createContext({
  isDark: false,
  toggleDarkMode: () => {},
});

export const useDarkMode = () => useContext(DarkModeContext);

export const DarkModeProvider = ({ children }) => {
  // Read initial state from localStorage (defaults to false = light mode)
  const [isDark, setIsDark] = useState(() => {
    try {
      return localStorage.getItem("darkMode") === "true";
    } catch {
      return false;
    }
  });

  // Apply / remove the "dark" class on <html> whenever isDark changes
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    try {
      localStorage.setItem("darkMode", String(isDark));
    } catch {
      /* ignore */
    }
  }, [isDark]);

  // Run once on mount to apply any persisted preference immediately
  useEffect(() => {
    const stored = localStorage.getItem("darkMode") === "true";
    if (stored) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => setIsDark((prev) => !prev);

  return (
    <DarkModeContext.Provider value={{ isDark, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};
