import React, { useState } from "react";
import { VStack } from "@chakra-ui/react";
import { FormControl, FormLabel, useToast } from "@chakra-ui/react";
import { Button } from "@chakra-ui/button";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import axios from "axios";
import {useNavigate} from 'react-router-dom'
import { ChatState } from "../../../Context/chatProvider";

const SignUp = () => {
  const [showPass, setShowPass] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pic, setPic] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate= useNavigate()
  const {setUser} = ChatState()

  const handleClick = () => {
    setShowPass((prevShowPass) => !prevShowPass);
  };

  const uploadPic = async (pic) => {
    setLoading(true);
    if (pic === undefined) {
      toast({
        title: "Please Select an Image",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    if (
      pic.type === "image/jpeg" ||
      pic.type === "image/png" ||
      pic.type === "image/jpg"
    ) {
      const cloudName = import.meta.env.VITE_CLOUDNAME;
      const data = new FormData();
      data.append("file", pic);
      data.append("upload_preset", "chatApp");
      data.append("cloud_name", cloudName);
      data.append("folder", "chatDp");

      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: "post",
            body: data,
          }
        );

        const resData = await response.json();
        setPic(resData.url.toString());
        setLoading(false);
      } catch (err) {
        console.log(err.message);
        setLoading(false);
      }
    } else {
      toast({
        title: "Please Select an Image",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault()
    setLoading(true);
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "Please Fill all the Fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false)
      return;
    }
    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false)
      return;
    }
    
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(`${import.meta.env.VITE_BACKENDURL}/api/user`, {
        name,
        email,
        password,
        pic:pic?pic:undefined          //if pic is present send pic if not send undefined as we have default pic
      },
      config
      );
      toast({
        title: "User registered Successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem('userInfo',JSON.stringify(data))
      setLoading(false)
      setUser(JSON.parse(localStorage.getItem('userInfo')))
      navigate('/chats')
    } catch (err) {
      toast({
        title: "Error Occured!",
        description:err.message,
        status: "danger",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false)
    }
  };

  return (
    <>
      <VStack spacing={"5px"}>
        <FormControl id="name" isRequired>
          <FormLabel>Name</FormLabel>
          <Input
            placeholder="Enter Your Name"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </FormControl>

        <FormControl id="email" isRequired>
          <FormLabel>Email</FormLabel>
          <Input
          type="email"
            placeholder="Enter Your Email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </FormControl>

        <FormControl id="password" isRequired>
          <FormLabel>Password</FormLabel>

          <InputGroup>
            <Input
              type={showPass ? "text" : "password"}
              placeholder="Enter Your Password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />

            <InputRightElement width={"4.5em"}>
              <Button h={"1.75rem"} size="sm" onClick={handleClick}>
                {showPass ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <FormControl id="confirm Password" isRequired>
          <FormLabel>Confirm Password</FormLabel>

          <InputGroup>
            <Input
              type={showPass ? "text" : "password"}
              placeholder="Confirm Password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
            />

            <InputRightElement width={"4.5em"}>
              <Button h={"1.75rem"} size="sm" onClick={handleClick}>
                {showPass ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <FormControl id="pic" isRequired>
          <FormLabel>Upload your picture</FormLabel>
          <Input
            type="file"
            p={1.5}
            accept="image/"
            onChange={(e) => uploadPic(e.target.files[0])}
          />
        </FormControl>

        <Button
          colorScheme="blue"
          width={"100%"}
          style={{ marginTop: 15 }}
          onClick={submitHandler}
          isLoading={loading}
        >
          Sign Up!
        </Button>
      </VStack>
    </>
  );
};

export default SignUp;
