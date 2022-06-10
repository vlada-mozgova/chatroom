import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { Dispatch, SetStateAction } from "react";
import { storage } from "../../../firebase/config";
import "../../../styles/Button.scss";
import "../../../styles/chat/ModalFile.scss";
import { Button } from "../../shared/Button";

interface ModalFileProps {
  image: string;
  setImageAsFile: Dispatch<SetStateAction<string>>;
  chatId: string;
  imageUrl: string;
  setFile: Dispatch<SetStateAction<string>>;
}

export const ModalFile: React.FC<ModalFileProps> = ({
  image,
  setImageAsFile,
  imageUrl,
  chatId,
  setFile,
}) => {
  const onClickReset = () => {
    setImageAsFile("");
    setFile("");
  };
  const onClickSubmit = () => {
    uploadedFiles(image);
    onClickReset();
  };
  const uploadedFiles = (file: any) => {
    if (!file) return;
    console.log("start of upload");
    const storageRef = ref(storage, `/images/${chatId}/${file.name}`);
    const uploadtask = uploadBytesResumable(storageRef, file);

    uploadtask.on(
      "state_changed",
      (snapshot) => {
        console.log("uploaded");
      },
      (err) => {
        console.log(err);
      },
      () => {
        getDownloadURL(uploadtask.snapshot.ref).then((url) => {
          setFile(url);
        });
      }
    );
  };
  return (
    <div className={`modal ${image ? "show" : ""}`} onClick={onClickReset}>
      <div onClick={(e) => e.stopPropagation()} className="modal-content">
        <div className="modal-body">
          <img src={imageUrl} alt="" />
        </div>
        <div className="modal-footer">
          <Button
            onClick={onClickReset}
            text="Cancel"
            className="button-modal"
            type="reset"
          />
          <Button
            onClick={onClickSubmit}
            className="button-modal"
            type="submit"
            text="Send"
          />
        </div>
      </div>
    </div>
  );
};
