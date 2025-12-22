import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { INITIAL_Z_INDEX, WINDOW_CONFIG } from "#constants";

const useWindowStore = create(immer((set) => ({
    windows: WINDOW_CONFIG,
    nextZIndex: INITIAL_Z_INDEX + 1,

    openWindow: (windowKey, data = null) => 
        set((state) => {
            const win = state.windows[windowKey];
            if(!win) return;
            win.isOpen = true;
            win.isMinimized = false;
            win.zIndex = state.nextZIndex;
            win.data = data ?? window.data;
            state.nextZIndex++;
        }),

    closeWindow: (windowKey, data = null) => 
        set((state) => {
            const win = state.windows[windowKey];
            if(!win) return;
            win.isOpen = false;
            win.isMinimized = false;
            win.isMaximized = false;
            win.savedPosition = null;
            win.zIndex = INITIAL_Z_INDEX;
            win.data = null;
        }),

    focusWindow: (windowKey, data = null) => 
        set((state) => {
            const win = state.windows[windowKey];
            win.zIndex = state.nextZIndex++;
        }),

    minimizeWindow: (windowKey) => 
        set((state) => {
            const win = state.windows[windowKey];
            if(!win) return;
            win.isMinimized = true;
        }),

    maximizeWindow: (windowKey) => 
        set((state) => {
            const win = state.windows[windowKey];
            if(!win) return;
            win.isMaximized = !win.isMaximized;
        }),

    setWindowPosition: (windowKey, position) => 
        set((state) => {
            const win = state.windows[windowKey];
            if(!win) return;
            win.savedPosition = position;
        }),
})));

export default useWindowStore;