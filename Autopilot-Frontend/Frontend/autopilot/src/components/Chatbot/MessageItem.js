import React from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism } from "react-syntax-highlighter";
import { coldarkDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import botLogo from "../../assets/icons/bot-logo.png";
import { CopyIcon } from "@primer/octicons-react"; 
import "./MessageItem.css";

const MessageItem = ({ msg }) => {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Code copied to clipboard!"); 
  };

  const transparentTheme = {
    ...coldarkDark,
    'pre[class*="language-"]': {
      ...coldarkDark['pre[class*="language-"]'],
      background: "rgba(10, 10, 10, 0.75)", 
      borderRadius: "8px", 
      padding: "1rem",
      fontWeight: "bold",
    },
    'code[class*="language-"]': {
      ...coldarkDark['code[class*="language-"]'],
      background: "transparent", 
      fontWeight: "bold",
    },
  };

  const markdownText = (text) => {
    return (
      <Markdown
        children={text}
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const language = className ? className.replace("language-", "") : "";
            const codeText = String(children).replace(/\n$/, "");

            if (!inline) {
              return (
                <div className="code-block-container">
                  <Prism language={language} style={transparentTheme} {...props}>
                    {codeText}
                  </Prism>
                  <button
                    className="copy-button"
                    onClick={() => copyToClipboard(codeText)}
                  >
                    <CopyIcon size={18} />
                  </button>
                </div>
              );
            }
            return <code className={className} {...props}>{children}</code>;
          },
          table({ children }) {
            return <table className="message-table">{children}</table>;
          },
          th({ children }) {
            return <th className="message-table-header">{children}</th>;
          },
          td({ children }) {
            return <td className="message-table-cell">{children}</td>;
          },
          tr({ children }) {
            return <tr className="message-table-row">{children}</tr>;
          },
        }}
      />
    );
  };

  return (
    <div className={`message-item ${msg.sender}`}>
      {msg.sender === "bot" && (
        <div className="avatar">
          <img src={botLogo} alt="Bot Icon" />
        </div>
      )}
      <span className="message-text">
        {msg.sender === "bot" ? markdownText(msg.text) : <span>{msg.text}</span>}
      </span>
      {msg.sender === "user" && <div className="spacer" />}
    </div>
  );
};

export default MessageItem;
