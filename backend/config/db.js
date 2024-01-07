const mongoose = require('mongoose')
const colors = require('colors')

const connectDB = async ()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI)

        console.log(`Db connected ${conn.connection.host}`.cyan)
    }catch(err){
        console.log(`Error: ${err.message}`.red)
        process.exit(1)
    }

}

module.exports = connectDB