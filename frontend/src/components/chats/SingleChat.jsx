import React, { useEffect, useState } from "react";
import { ChatState } from "../../../Context/chatProvider";
import {
  Box,
  Text,
  IconButton,
  Spinner,
  Input,
  useToast,
  Avatar
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderObj } from "../../config/chatLogics";
import ProfileModal from "../misc/ProfileModal";
import UpdateGroupChatModal from "../misc/UpdateGroupChatModal";
import { FormControl } from "@chakra-ui/react";
import axios from "axios";
import styles from "./SingleChat.module.css";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";
import Lottie from "lottie-react";
import animationData from "../../assets/typingAnimation.json";

const ENDPOINT = import.meta.env.VITE_BACKENDURL;
let socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [laoding, setLaoding] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const {
    user,
    selectedChat,
    setSelectedChat,
    notifications,
    setNotifications,
  } = ChatState();
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [timerId, setTimerId] = useState(null);
  const toast = useToast();


  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => {
      setSocketConnected(true);
    });

    socket.on("typing", (room) =>{
      console.log(room +"  "+selectedChat._id)
      if(room === selectedChat._id){
        setIsTyping(true)
      }
    });
    socket.on("stop typing", () => setIsTyping(false));

    return () => {
      socket.off("typing");
      socket.off("stop typing");
    };
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessage) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessage.chat._id
      ) {
        if (!notifications.includes(newMessage)) {
          setNotifications((prevNotifications) => [
            ...prevNotifications,
            newMessage,
          ]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    });
    return () => {
      socket.off("message recieved");
    };
  });

  const fetchMessages = async () => {
    if (!selectedChat) return;
    setLaoding(true);
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKENDURL}/api/message/${selectedChat._id}`,
        config
      );

      setMessages(data);
      setLaoding(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Something went wrong!",
        description: error.message,
        status: "warning",
        duration: 2500,
        isClosable: true,
        position: "bottom",
      });
      setLaoding(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      const messageToSend = newMessage;
      setNewMessage("");
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        const { data } = await axios.post(
          `${import.meta.env.VITE_BACKENDURL}/api/message`,
          {
            content: messageToSend,
            chatId: selectedChat._id,
          },
          config
        );

        socket.emit("new message", data);

        setMessages((prevMessages) => [...prevMessages, data]);
      } catch (error) {
        toast({
          title: "Message cannot be sent!",
          description: error.message,
          status: "warning",
          duration: 2500,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    const timerLength = 3000;
        if (timerId) {
            clearTimeout(timerId);
        }

        let timer = setTimeout(() => {
            socket.emit('stop typing',selectedChat._id);
               setTyping(false);
        }, timerLength);

        setTimerId(timer);
  };

  return (
    <>
      {selectedChat ? (
        <>
        <Text
          fontSize={{ base: "28px", md: "30px" }}
          pb={3}
          px={2}
          w={"100%"}
          fontFamily={"montserrat"}
          display={"flex"}
          justifyContent={{ base: "space-between" }}
          alignItems={"center"}
        >
          <IconButton
            display={{ base: "flex", md: "none" }}
            icon={<ArrowBackIcon />}
            onClick={() => setSelectedChat(null)}
          />
          {selectedChat.isGroupChat ? (
            <>
              {selectedChat.chatName.toUpperCase()}
              <UpdateGroupChatModal
                fetchAgain={fetchAgain}
                setFetchAgain={setFetchAgain}
              />
            </>
          ) : (
            <Box display={"flex"} >
              <ProfileModal user={getSenderObj(user, selectedChat.users)} >
              <Avatar
                mt={1.5}
                mr={2}
                size={"sm"}
                cursor={"pointer"}
                name={user.name}
                src={getSenderObj(user, selectedChat.users).pic}
              />
              </ProfileModal>
              {getSender(user, selectedChat.users)}
            </Box>
          )}
        </Text>
        <Box
          display={"flex"}
          flexDir={"column"}
          justifyContent={"flex-end"}
          p={3}
          bg={"#E8E8E8"}
          width={"100%"}
          height={"100%"}
          borderRadius={"lg"}
          overflowY={"hidden"}
        >
          {laoding ? (
            <Spinner
              size={"xl"}
              w={20}
              h={20}
              alignSelf={"center"}
              margin={"auto"}
            />
          ) : (
            <div className={styles.messages}>
              <ScrollableChat messages={messages} />
            </div>
          )}

          <FormControl onKeyDown={sendMessage} isRequired mt={3}>
            {isTyping && !typing ? (
              <Lottie
                style={{
                  height: "50px",
                  width: "50px",
                }}
                animationData={animationData}
                loop={true}
                autoplay={true}
              />
            ) : (
              <></>
            )}
            <Input
              bg={"#E0E0E0"}
              variant={"filled"}
              placeholder="Enter Message"
              value={newMessage}
              onChange={typingHandler}
            />
          </FormControl>
        </Box>
      </>
      ) : (
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          height={"100%"}
        >
          <Text fontSize={"2xl"} pb={3} fontFamily={"montserrat"}>
            Cick on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
