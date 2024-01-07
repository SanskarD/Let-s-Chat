import React from 'react'
import {Box} from  '@chakra-ui/react'
import {CloseIcon} from '@chakra-ui/icons'
const UserBadgeItem = ({user,handleFunction}) => {
  return (
    <Box 
    px={3}
    py={1}
    m={1}
    mb={2}
    borderRadius={"xl"}
    fontSize={"15px"}
    backgroundColor="purple"
    color={"white"}
    cursor={"pointer"}
    display={"flex"}
    alignItems={"center"}
    onClick={handleFunction}
    >
        {user.name}
        <CloseIcon pl={1} fontSize={"sm"} ml={1}/>
    </Box>
  )
}

export default UserBadgeItem