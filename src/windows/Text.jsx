import { WindowControls } from "#components";
import WindowWrapper from "#hoc/WindowWrapper";
import useWindowStore from "#store/window";

const Text = () => {
  const { windows } = useWindowStore();
  const data = windows.txtfile.data;

  if (!data) return null;
  
  const { name, image, subtitle, description } = data;

  return (
    <>
      <div id="window-header">
        <WindowControls target="txtfile" />
        <h2>{name}</h2>
      </div>

      <div className="p-5 space-y-6" style={{ background: 'var(--bg-window)' }}>
        {image ? (
          <div className="w-full">
            <img 
              src={image} 
              alt={name} 
              className="w-full h-auto rounded"
            />
          </div>
        ): null}

        {subtitle ? (
          <h3 className="text-xl font-semibold" style={{ color: 'var(--window-heading)' }}>
            {subtitle}
          </h3>
        ): null}

        {Array.isArray(description) && description.length > 0 ? (
          <div className="space-y-3 leading-relaxed text-base" style={{ color: 'var(--window-text)' }}>
            {description.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        ): null}
      </div>
    </>
  );
};

const TextWindow = WindowWrapper(Text, "txtfile");

export default TextWindow;
