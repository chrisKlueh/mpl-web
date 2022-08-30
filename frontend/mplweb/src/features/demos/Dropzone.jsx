import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

const Dropzone = (props) => {
  const [files, setFiles] = React.useState([]);
  const onDrop = useCallback(
    (acceptedFiles) => {
      const { onChange } = props;
      onChange(acceptedFiles);
      setFiles((prev) => [...prev, ...acceptedFiles]);
    },
    [props]
  );

  const fileList = files.map((file) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag 'n' drop some files here, or click to select files</p>
      )}
      <aside>
        <h4>Files</h4>
        <ul>{fileList}</ul>
      </aside>
    </div>
  );
};

export default Dropzone;
