import WindowWrapper from "#hoc/WindowWrapper";
import { techStack } from "#constants";
import { Check, Flag } from "lucide-react";
import WindowControls from "#components/WindowControls";

const Terminal = () => {
  return <>
  <div id="window-header">
    <WindowControls target="terminal" />
    <h2>Tech Stack</h2>
  </div>

  <div className="terminal-content">
    <div className="terminal-body">
      <p className="terminal-prompt">
          <span className="font-bold">@christopher % </span>
          show tech stack
      </p>

      <div className="terminal-output">
        <div className="label">
            <p className="label-category">Category</p>
            <p className="label-tech">Technologies</p>
        </div>

        <ul className="content">
            {techStack.map(({ category, items }) => (
                <li key={category} className="tech-row">
                    <Check className="check"/>
                    <h3 className="category-name">{category}</h3>
                    <ul className="tech-items">
                        {items.map((item, i) => (
                            <li key={i} className="tech-item">{item}{i < items.length - 1 ? "," : ""}</li>
                        ))}
                    </ul>
                </li>
            ))}
        </ul>

        <div className="footnote">
            <p> 
                <Check size={20} /> {techStack.length} of {techStack.length} stacks loaded successfully (100%)
            </p>

            <p className="text-black">
                <Flag size={15} fill="black"/>
                Render time: 6ms
            </p>
        </div>
      </div>
    </div>
  </div>
  </>;
};

const TerminalWindow = WindowWrapper(Terminal, "terminal");

export default TerminalWindow;