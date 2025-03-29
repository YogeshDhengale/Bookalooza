import React, { ReactNode, CSSProperties, useRef, useCallback } from "react";

interface FilePickerProps {
  name?: string;
  onChange?: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  className?: string;
  validate?: (file: File) => boolean;
  style?: CSSProperties;
  title?: string;
  Component?: React.ComponentType<{ title?: string; onClick: () => void; className?: string; style?: CSSProperties; children: ReactNode }>;
}

const getValidFiles = async (files: FileList | null, validate?: (file: File) => boolean): Promise<File[]> => {
  return files ? (validate ? Array.from(files).filter(validate) : Array.from(files)) : [];
};

export function FilePicker({ name, onChange, accept, multiple, className, validate, style, title, Component = ({ children, onClick, ...rest }) => (
  <div {...rest} onClick={onClick} style={{ cursor: "pointer", ...style }}>
    {children}
  </div>
)}: FilePickerProps) {
  const ref = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    getValidFiles(e.target.files, validate)
      .then((validFiles) => onChange?.(validFiles))
      .finally(() => { e.target.value = ""; });
  }, [onChange, validate]);

  return (
    <>
      <Component title={title} onClick={() => ref.current?.click()} className={className} style={style}>
        {title}
      </Component>
      <input ref={ref} name={name} type="file" accept={accept} multiple={multiple} onChange={handleFileChange} className="hidden" style={{ display: "none" }} />
    </>
  );
}
