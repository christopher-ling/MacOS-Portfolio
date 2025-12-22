import useWindowStore from "#store/window";
import { useGSAP } from "@gsap/react";
import { useLayoutEffect, useRef, useState, useEffect } from "react"
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
        const { focusWindow, windows, maximizeWindow, setWindowPosition } = useWindowStore();
        const { isOpen, zIndex, isMinimized, isMaximized, savedPosition } = windows[windowKey];
        const ref = useRef(null);
        const [shouldHighlightNav, setShouldHighlightNav] = useState(false);
        const draggableInstanceRef = useRef(null);

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

            const [instance] = Draggable.create(el, { 
                trigger: el.querySelector("#window-header"),
                onPress: () => focusWindow(windowKey),
                onDrag: function() {
                    const navbar = document.querySelector('nav');
                    if (navbar) {
                        const rect = el.getBoundingClientRect();
                        const windowTop = rect.top;
                        
                        // Highlight if window top is at or above navbar (0 or negative)
                        if (windowTop <= 5) {
                            setShouldHighlightNav(true);
                        } else {
                            setShouldHighlightNav(false);
                        }
                    }
                },
                onDragEnd: function() {
                    const navbar = document.querySelector('nav');
                    if (navbar) {
                        const rect = el.getBoundingClientRect();
                        const windowTop = rect.top;
                        
                        // Maximize if window top is at or above navbar top
                        if (windowTop <= 5) {
                            // Save position before maximizing
                            setWindowPosition(windowKey, {
                                left: el.style.left,
                                top: el.style.top,
                                width: el.style.width,
                                height: el.style.height,
                            });
                            maximizeWindow(windowKey);
                        }
                    }
                    setShouldHighlightNav(false);
                }
            });

            draggableInstanceRef.current = instance;

            return () => instance.kill();
        }, []);

        // Handle maximize state changes
        useEffect(() => {
            const el = ref.current;
            if (!el || !draggableInstanceRef.current) return;

            if (isMaximized) {
                // Reset GSAP transform to fix offset
                gsap.set(el, { x: 0, y: 0 });
                // Disable dragging when maximized
                draggableInstanceRef.current.disable();
            } else {
                // Re-enable dragging when restored
                draggableInstanceRef.current.enable();
                
                // Restore saved position if available
                if (savedPosition) {
                    gsap.set(el, {
                        x: 0,
                        y: 0,
                        left: savedPosition.left,
                        top: savedPosition.top,
                        width: savedPosition.width,
                        height: savedPosition.height,
                    });
                }
            }
        }, [isMaximized, savedPosition]);

        useLayoutEffect(() => {
            const el = ref.current;
            if(!el) return;
            el.style.display = isOpen && !isMinimized ? "block" : "none";
        }, [isOpen, isMinimized]);

        // Add/remove highlight class to navbar
        useEffect(() => {
            const navbar = document.querySelector('nav');
            if (navbar) {
                if (shouldHighlightNav) {
                    navbar.classList.add('maximize-highlight');
                } else {
                    navbar.classList.remove('maximize-highlight');
                }
            }
        }, [shouldHighlightNav]);


        return (
            <section 
                id={windowKey} 
                ref={ref} 
                style={{ zIndex }} 
                className={`absolute ${isMaximized ? 'maximized' : ''}`}>
                <Component {...props} />
            </section>
        );
    };

    Wrapped.displayName = `WindowWrapper(${Component.displayName || 
        Component.name || "Component"})`;
  
    return Wrapped;
};

export default WindowWrapper;