const mongoose = require('mongoose')
const colors = require('colors')

const connetDb = async () =>{
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log('database connected')
        
    } catch (error) {
        console.log(`MOngoDb server issue ${error}`.bgRed.white)
    }
}


module.exports = connetDb