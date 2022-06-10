import React from "react";
import "../../styles/Message.scss";

interface MessageProps {
  msg: string;
  type: "danger" | "success";
}

export const Message: React.FC<MessageProps> = ({ msg, type }) => {
  let typeClass = "";

  if (type === "danger") {
    typeClass = "is-danger";
  }

  if (type === "success") {
    typeClass = "is-success";
  }

  return (
    <article className={`message ${typeClass}`}>
      <div className="message-body">{msg}</div>
    </article>
  );
};
