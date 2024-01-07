const mongoose = require('mongoose')
const {Schema} = mongoose


const chatSchema = new Schema({
    chatName:{
        type:String,
    },
    isGroupChat:{
        type:Boolean,
        default:false
    },
    users:[{
        type:Schema.Types.ObjectId,
        ref:"User"
    }],
    latestMessage:{
        type:Schema.Types.ObjectId,
        ref:"Message"
    },
    groupAdmin:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true})

const chatModel = mongoose.model('Chat',chatSchema)

module.exports = chatModel