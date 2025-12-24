import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

const useThemeStore = create(immer((set) => ({
    themeMode: 'system',
    appliedTheme: 'light',

    setThemeMode: (mode) => set((state) => {
        state.themeMode = mode;
        if (mode === 'light') {
            state.appliedTheme = 'light';
        } else if (mode === 'dark') {
            state.appliedTheme = 'dark';
        } else if (mode === 'system') {
            const systemTheme = useThemeStore.getState().getSystemTheme();
            state.appliedTheme = systemTheme;
        }

        document.documentElement.setAttribute('data-theme', state.appliedTheme);
        localStorage.setItem('theme-mode', mode);
    }),

    getSystemTheme: () =>  {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    },

    initializeTheme: () => set((state) => {
        const savedMode = localStorage.getItem('theme-mode');

        if (savedMode) {
            state.themeMode = savedMode;
        } else {
            state.themeMode = 'system';
        }

        if (state.themeMode === 'light') {
            state.appliedTheme = 'light';
        } else if (state.themeMode === 'dark') {
            state.appliedTheme = 'dark';
        } else {
            const systemTheme = useThemeStore.getState().getSystemTheme();
            state.appliedTheme = systemTheme;
        }

        document.documentElement.setAttribute('data-theme', state.appliedTheme);
    }),
})))

export default useThemeStore;