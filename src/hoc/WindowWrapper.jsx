import useWindowStore from "#store/window";
import { useGSAP } from "@gsap/react";
import { useLayoutEffect, useRef } from "react"
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";

/**
 * Higher-order component that wraps a window-like component with
 * window state, focus, drag, and open/close animation behavior.
 *
 * The returned component:
 * - Looks up window state using {@link windowKey} from the window store.
 * - Applies entry animations when the window is opened.
 * - Toggles visibility based on the window's `isOpen` state.
 * - Makes the window draggable and brings it to the front on focus.
 *
 * @param {React.ComponentType<any>} Component - The React component to render inside the window.
 * @param {string} windowKey - Identifier used to read window state and set the `id` attribute of the section.
 * @returns {React.FC<any>} A wrapped component that renders the given component within a managed window.
 */
const WindowWrapper = (Component, windowKey) => {
    const Wrapped = (props) => {
        const { focusWindow, windows } = useWindowStore();
        const { isOpen, zIndex } = windows[windowKey];
        const ref = useRef(null);

        useGSAP(() => {
            const el = ref.current;
            if(!el || !isOpen) return;

            el.style.display = "block";

            gsap.fromTo(el, 
                { scale: 0.8, opacity: 0, y: 40 }, 
                { scale: 1, opacity: 1, duration: 0.4, ease: "power3.out"},
            );
        }, [isOpen]);

        useGSAP(() => {
            const el = ref.current;
            if (!el) return;

            const [instance] = Draggable.create(el, { onPress: () => focusWindow(windowKey) });

            return () => instance.kill();
        }, []);

        useLayoutEffect(() => {
            const el = ref.current;
            if(!el) return;
            el.style.display = isOpen ? "block" : "none";
        }, [isOpen]);


        return (
            <section id={windowKey} ref={ref} style={{ zIndex }} 
            className="absolute">
                <Component {...props} />
            </section>
        );
    };

    Wrapped.displayName = `WindowWrapper(${Component.displayName || 
        Component.name || "Component"})`;
  
    return Wrapped;
};

export default WindowWrapper;