import useWindowStore from "#store/window";
import { useGSAP } from "@gsap/react";
import { useLayoutEffect, useRef, useState } from "react"
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
        const { focusWindow, windows, resizeWindow } = useWindowStore();
        const { isOpen, zIndex, isMinimized, width, height } = windows[windowKey];
        const ref = useRef(null);
        const [isResizing, setIsResizing] = useState(false);

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
                onPress: () => focusWindow(windowKey) 
            });

            return () => instance.kill();
        }, []);

        useLayoutEffect(() => {
            const el = ref.current;
            if(!el) return;
            el.style.display = isOpen && !isMinimized ? "block" : "none";
        }, [isOpen, isMinimized]);

        useLayoutEffect(() => {
            const el = ref.current;
            if (!el) return;

            const handleMouseDown = (e, edge) => {
                e.preventDefault();
                e.stopPropagation();
                setIsResizing(true);
                focusWindow(windowKey);

                const startX = e.clientX;
                const startY = e.clientY;
                const startWidth = el.offsetWidth;
                const startHeight = el.offsetHeight;
                const startLeft = el.offsetLeft;
                const startTop = el.offsetTop;

                const handleMouseMove = (e) => {
                    let newWidth = startWidth;
                    let newHeight = startHeight;
                    let newLeft = startLeft;
                    let newTop = startTop;

                    if (edge.includes('right')) {
                        newWidth = Math.max(300, startWidth + (e.clientX - startX));
                    }
                    if (edge.includes('left')) {
                        const delta = e.clientX - startX;
                        newWidth = Math.max(300, startWidth - delta);
                        if (newWidth > 300) newLeft = startLeft + delta;
                    }
                    if (edge.includes('bottom')) {
                        newHeight = Math.max(200, startHeight + (e.clientY - startY));
                    }
                    if (edge.includes('top')) {
                        const delta = e.clientY - startY;
                        newHeight = Math.max(200, startHeight - delta);
                        if (newHeight > 200) newTop = startTop + delta;
                    }

                    el.style.width = `${newWidth}px`;
                    el.style.height = `${newHeight}px`;
                    el.style.left = `${newLeft}px`;
                    el.style.top = `${newTop}px`;
                };

                const handleMouseUp = () => {
                    setIsResizing(false);
                    resizeWindow(windowKey, el.offsetWidth, el.offsetHeight);
                    document.removeEventListener('mousemove', handleMouseMove);
                    document.removeEventListener('mouseup', handleMouseUp);
                };

                document.addEventListener('mousemove', handleMouseMove);
                document.addEventListener('mouseup', handleMouseUp);
            };

            const edges = [
                { selector: '.resize-right', edge: 'right' },
                { selector: '.resize-left', edge: 'left' },
                { selector: '.resize-bottom', edge: 'bottom' },
                { selector: '.resize-top', edge: 'top' },
                { selector: '.resize-corner-br', edge: 'bottom-right' },
                { selector: '.resize-corner-bl', edge: 'bottom-left' },
                { selector: '.resize-corner-tr', edge: 'top-right' },
                { selector: '.resize-corner-tl', edge: 'top-left' },
            ];

            edges.forEach(({ selector, edge }) => {
                const handle = el.querySelector(selector);
                if (handle) {
                    handle.addEventListener('mousedown', (e) => handleMouseDown(e, edge));
                }
            });
        }, [windowKey, focusWindow, resizeWindow]);


        return (
            <section 
                id={windowKey} 
                ref={ref} 
                style={{ 
                    zIndex,
                    width: width ? `${width}px` : undefined,
                    height: height ? `${height}px` : undefined,
                }} 
                className="absolute">
                <Component {...props} />
                
                {/* Resize handles */}
                <div className="resize-right" />
                <div className="resize-left" />
                <div className="resize-bottom" />
                <div className="resize-top" />
                <div className="resize-corner-br" />
                <div className="resize-corner-bl" />
                <div className="resize-corner-tr" />
                <div className="resize-corner-tl" />
            </section>
        );
    };

    Wrapped.displayName = `WindowWrapper(${Component.displayName || 
        Component.name || "Component"})`;
  
    return Wrapped;
};

export default WindowWrapper;