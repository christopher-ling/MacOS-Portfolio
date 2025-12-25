import { WindowControls } from "#components";
import WindowWrapper from "#hoc/WindowWrapper";
import useWindowStore from "#store/window";
import { Edit, Plus, Share } from "lucide-react";

const Image = () => {
  const { windows } = useWindowStore();
  const data = windows.imgfile.data;

  if (!data) return null;
  
  const { name, imageUrl } = data;

  return (
    <>
      <div id="window-header">
        <WindowControls target="imgfile" />
        <div className="flex items-center gap-5">
              <Edit className="icon" />
              <Plus className="icon" />
              <Share className="icon" />
          </div>
      </div>

      <div className="p-2 flex items-center justify-center h-full" style={{ backgroundColor: 'var(--bg-sidebar)' }}>
        <img 
          src={imageUrl} 
          alt={name} 
          className="w-full h-full object-contain"
        />
      </div>
    </>
  );
};

const ImageWindow = WindowWrapper(Image, "imgfile");

export default ImageWindow;
