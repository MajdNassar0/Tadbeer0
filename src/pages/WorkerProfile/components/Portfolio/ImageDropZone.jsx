import { useRef, useState } from "react";
import { Upload } from "lucide-react";

const ImageDropZone = ({ file, onChange, label, multiple = false }) => {
  const inputRef = useRef();
  const [dragging, setDragging] = useState(false);

  const handleFiles = (files) => {
    if (!files?.length) return;
    multiple ? onChange(Array.from(files)) : onChange(files[0]);
  };

  return (
    <div
      onClick={() => inputRef.current.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        handleFiles(e.dataTransfer.files);
      }}
      className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center py-8 px-4 text-center
        ${dragging ? "border-orange-400 bg-orange-50" : "border-gray-200 hover:border-orange-300 hover:bg-orange-50/50"}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {file ? (
        <div className="space-y-2 w-full">
          {multiple ? (
            <div className="flex flex-wrap gap-2 justify-center">
              {(Array.isArray(file) ? file : [file]).map((f, i) => (
                <img key={i} src={URL.createObjectURL(f)} alt="" className="h-16 w-16 object-cover rounded-xl" />
              ))}
            </div>
          ) : (
            <img src={URL.createObjectURL(file)} alt="" className="h-32 w-full object-cover rounded-xl" />
          )}
          <p className="text-xs text-orange-500 font-medium">
            {multiple ? `${Array.isArray(file) ? file.length : 1} صورة محددة — انقر للتغيير` : file.name}
          </p>
        </div>
      ) : (
        <>
          <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center mb-3">
            <Upload size={20} className="text-orange-400" />
          </div>
          <p className="text-sm font-semibold text-gray-700">{label}</p>
          <p className="text-xs text-gray-400 mt-1">PNG · JPG · WEBP — اسحب أو انقر</p>
        </>
      )}
    </div>
  );
};

export default ImageDropZone;