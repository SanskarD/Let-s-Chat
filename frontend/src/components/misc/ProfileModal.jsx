import React from "react";
import { useDisclosure } from "@chakra-ui/hooks";
import { IconButton } from "@chakra-ui/button";
import { ViewIcon } from "@chakra-ui/icons";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Image,
  Text
} from "@chakra-ui/react";

const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          display={{ base: "flex" }}
          icon={<ViewIcon />}
          onClick={onOpen}
        />
      )}
      <Modal size={"lg"} isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent height={"380px"}>
          <ModalHeader
            fontSize={"30px"}
            fontFamily={"Montserrat"}
            display={"flex"}
            justifyContent={"center"}
            pb={0}
          >
            {user.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"space-evenly"}
          alignItems={"center"}
          pt={0}
           >
            <Image
            borderRadius={"full"}
            boxSize={"150px"}
            src={user.pic}
            alt={user.name}
            />
            <Text 
            fontSize={{base:"26px"}}
            fontFamily={"Montserrat"}
            >Email: {user.email}</Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
