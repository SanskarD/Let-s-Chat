import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  useToast,
  Input,
  Button,
  Box,
  FormControl,
} from "@chakra-ui/react";

import { useDisclosure } from "@chakra-ui/hooks";
import { ChatState } from "../../../Context/chatProvider";
import axios from "axios";
import UserListItem from "../userAvatar/UserListItem";
import UserBadgeItem from "../userAvatar/UserBadgeItem";

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const { user, setAllChats } = ChatState();

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query){
        setSearchResult([])
        return
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKENDURL}/api/user?search=${query}`,
        config
      );
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured",
        description: error.message,
        status: "error",
        duration: 2500,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const handleSubmit = async () => {
    if(!groupChatName){
        toast({
            title:"Please Enter Chat Name",
            status:"info",
            duration:2500,
            isClosable:true,
            position:"top-left"
        })
        return
    }
    if(selectedUsers.length === 0){
        toast({
            title:"Please Select Participants",
            status:"info",
            duration:2500,
            isClosable:true,
            position:"top-left"
        })
        return
    }
    try {
        const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
        
          const {data} = await axios.post(`${import.meta.env.VITE_BACKENDURL}/api/chats/group`,{
            name: groupChatName,
            users: JSON.stringify(selectedUsers.map(user => user._id))
          },config)

          setAllChats(prevChats => [data,...prevChats])
          onClose()
          toast({
            title:"New Group Chat Created",
            status:"success",
            duration:2500,
            isClosable:true,
            position:"top-left"
        })
    } catch (error) {
        toast({
            title:"Failed to Create Chat",
            description:error.message,
            status:"error",
            duration:2500,
            isClosable:true,
            position:"top-left"
        })
    }
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) return;
    setSelectedUsers((prevUsers) => [...prevUsers, userToAdd]);
  };

  const handleDelete = (userToDel)=>{
    setSelectedUsers(prevUsers => prevUsers.filter(user => user !== userToDel))
  }

  return (
    <>
      <span onClick={onOpen}>{children}</span>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={"30px"}
            fontFamily={"Montserrat"}
            fontWeight={"400"}
            display={"flex"}
            justifyContent={"center"}
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display={"flex"}
            flexDirection={"column"}
            alignItems={"center"}
          >
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users"
                mb={13}
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            <Box
            width={"100%"}
            display={"flex"}
            flexWrap={"wrap"}
            >
            {selectedUsers.map((user) => (
              <UserBadgeItem
                key={user._id}
                user={user}
                handleFunction={() => handleDelete(user)}
              />
            ))} 
            </Box>
            {loading ? (
              <div>loading</div>
            ) : (
              searchResult.length > 0 &&
              searchResult
                .slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSubmit}>
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
