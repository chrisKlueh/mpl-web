import React, { useCallback, Fragment } from "react";
import { useDropzone } from "react-dropzone";
import { DialogActions, Button } from "@mui/material";

import styles from "./UploadDropzone.module.css";

const Dropzone = (props) => {
  const [files, setFiles] = React.useState([]);
  const { handleClose } = props;
  const onDrop = useCallback(
    (acceptedFiles) => {
      const { onChange } = props;
      onChange(acceptedFiles);
      setFiles((prev) => [...prev, ...acceptedFiles]);
    },
    [props]
  );

  const fileList = files.map((file) => (
    <li key={file.path}>{`${file.path} (${file.size} bytes)`}</li>
  ));

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  return (
    <Fragment>
      <div {...getRootProps()} className={styles.dropzone}>
        <input {...getInputProps()} />
        <div className={styles.textContainer}>
          <p>
            {isDragActive
              ? "Drop the demo files here ..."
              : "Drag 'n' drop demo files here, or click to select."}
          </p>
          {fileList.length > 0 && (
            <div>
              <ul>{fileList}</ul>
            </div>
          )}
        </div>
      </div>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button disabled color="primary">
          Upload
        </Button>
      </DialogActions>
    </Fragment>
  );
};

export default Dropzone;
