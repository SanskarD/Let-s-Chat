const expressAsyncHandler = require("express-async-handler");
const Message = require('../models/messageModel')
const Chat = require('../models/chatModel')


const sendMessage = expressAsyncHandler(async(req,res)=>{
    const {content , chatId} = req.body

    if(!content || !chatId){
        console.log("Invalid data passed")
        return res.status(400)
    }

    let newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId
    }

    try {
        newMessage = new Message({...newMessage})
        await newMessage.save()

        await (
            await newMessage.populate("sender", "name profilePicture")
          ).populate({
            path: "chat",
            select: "chatName isGroupChat users groupAdmin ",
            model: "Chat",
            populate: { path: "users", select: "name email profilePicture", model: "User" },
          });

        await Chat.findByIdAndUpdate(chatId,{
            latestMessage: newMessage
        })

        res.json(newMessage)

    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }
})

const getAllMessages = expressAsyncHandler(async(req,res)=>{
    try {
        const messages = await Message.find({chat:req.params.chatId})
        .populate("sender","name pic email")
        .populate("chat")
        
        res.json(messages)
    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }
})

module.exports = { sendMessage, getAllMessages}