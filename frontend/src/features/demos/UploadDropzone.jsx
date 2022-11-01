import React, { useCallback, Fragment } from "react";
import { useDropzone } from "react-dropzone";
import { DialogActions, Button } from "@mui/material";

import styles from "./UploadDropzone.module.css";

const UploadDropzone = (props) => {
  const { handleClose, handleNext, disableNext, files, allowMultipleFiles } =
    props;

  const onDrop = useCallback(
    (acceptedFiles) => {
      const { setFiles, allowMultipleFiles } = props;
      if (allowMultipleFiles) {
        setFiles((prev) => [...prev, ...acceptedFiles]);
      } else {
        setFiles(acceptedFiles);
      }
    },
    [props]
  );

  const fileList = files.map((file) => (
    <li key={file.path}>{`${file.path} (${file.size} bytes)`}</li>
  ));

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/x-python": [".py"],
    },
  });
  const fileQuantityString = allowMultipleFiles ? "files" : "file";
  return (
    <Fragment>
      <div {...getRootProps()} className={styles.dropzone}>
        <input {...getInputProps()} />
        <div className={styles.textContainer}>
          <p>
            {isDragActive
              ? `Drop the demo ${fileQuantityString} here ...`
              : `Drag 'n' drop demo ${fileQuantityString} here, or click to select.`}
          </p>
          <div className={styles.fileTypeHint}>
            {"(Accepted file type: .py)"}
          </div>
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
        <Button onClick={handleNext} disabled={disableNext} color="primary">
          Next
        </Button>
      </DialogActions>
    </Fragment>
  );
};

export default UploadDropzone;
