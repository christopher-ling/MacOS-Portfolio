import { useState, useEffect } from "react"
import dayjs from "dayjs"

import { navIcons, navLinks } from "#constants"
import useWindowStore from "#store/window"
import { ControlCenter } from "#components"

const Navbar = () => {
    const { openWindow } = useWindowStore();
    const [isControlCenterOpen, setIsControlCenterOpen] = useState(false);

  const [currentTime, setCurrentTime] = useState(dayjs().format("ddd MMM D h:mm A"));

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(dayjs().format("ddd MMM D h:mm A"));
    }, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const handleIconClick = (id) => {
    // Icon with id 4 is the mode/theme icon (from constants)
    if (id === 4) {
      setIsControlCenterOpen(!isControlCenterOpen);
    }
    // You can add handlers for other icons here later
  };

  return (
    <>
      <nav>
          <div>
              <img src="images/logo.svg" alt="logo" />
              <p className="font-bold">Christopher's Portfolio</p>

              <ul>
                  {navLinks.map(({ id, name, type }) => (
                      <li key={id} onClick={() => openWindow(type)}>
                          <p>{name}</p>
                      </li>
                  ))}
              </ul>
          </div>

          <div>
              <ul>
                  {navIcons.map(({ id, img }) => (
                      <li key={id} onClick={() => handleIconClick(id)}>
                          <img 
                            src={img} 
                            className="icon-hover" 
                            alt={`icon-${id}`}
                          />
                      </li>
                  ))}
              </ul>

              <time>{currentTime}</time>
          </div>
      </nav>
      <ControlCenter 
        isOpen={isControlCenterOpen} 
        onClose={() => setIsControlCenterOpen(false)} 
      />
    </>
  )
}

export default Navbar