import gsap from "gsap";
import { Draggable } from "gsap/Draggable";

import useThemeStore from "#store/theme";
import { useEffect } from "react";

import { Dock, Home, Navbar, Welcome } from "#components"
import { Finder, Resume, Safari, Terminal, Text, Image, Contact, Photos } from "#windows";

gsap.registerPlugin(Draggable);

const App = () => {
  const { initializeTheme, themeMode, setThemeMode } = useThemeStore();

  useEffect(() => {
    // Initialize theme on mount
    initializeTheme();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleSystemThemeChange = (e) => {
      // Only update if user is in 'system' mode
      const currentMode = useThemeStore.getState().themeMode;
      if (currentMode === 'system') {
        const newTheme = e.matches ? 'dark' : 'light';
        useThemeStore.getState().setThemeMode('system'); // Re-apply system theme
      }
    };

    // Add listener for system theme changes
    mediaQuery.addEventListener('change', handleSystemThemeChange);

    // Cleanup listener on unmount
    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, []);

  return (
    <main>
      <Navbar />
      <Welcome />
      <Dock />

      <Terminal />
      <Safari />
      <Resume />
      <Finder />
      <Text />
      <Image />
      <Contact />
      <Home />
      <Photos />
    </main>
  );
};

export default App;