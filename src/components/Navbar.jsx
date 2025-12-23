import { useState, useEffect } from "react"
import dayjs from "dayjs"

import { navIcons, navLinks } from "#constants"
import useWindowStore from "#store/window"

const Navbar = () => {
    const { openWindow } = useWindowStore();

  const [currentTime, setCurrentTime] = useState(dayjs().format("ddd MMM D h:mm A"));

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(dayjs().format("ddd MMM D h:mm A"));
    }, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
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
                    <li key={id}>
                        <img src={img} className="icon-hover" 
                        alt={`icon-${id}`} />
                    </li>
                ))}
            </ul>

            <time>{currentTime}</time>
        </div>
    </nav>
  )
}

export default Navbar