import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import { Box } from "@chakra-ui/react";
import { ChatState } from "../../../Context/chatProvider";
import styles from "./ScrollableChat.module.css";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((message, index) => {
          const addedStyles =
            message.sender._id === user._id
              ? styles.sameSender
              : styles.differentSender;
          return (
            <Box display={"flex"} key={message._id}>
              <span className={`${styles.message} ${addedStyles}`}>{message.content}</span>
            </Box>
          );
        })}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
