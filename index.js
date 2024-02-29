const express = require('express')
const colors = require('colors')
const morgan = require('morgan')
const dotenv = require('dotenv')
const connetDb = require('./config/db')
const cors = require('cors')



dotenv.config()

connetDb()

const app = express()




app.use(express.json())
app.use(cors())
app.use(morgan("dev"))


app.use('/api', require('./routes/userRoutes'))
app.use('/api/admin' ,require('./routes/adminRoutes'))
app.use('/api/doctor', require("./routes/doctorRoutes"))

const port = process.env.PORT || 8080;
//listen port
app.listen(port, () => {
  console.log(
    `Server Running in ${process.env.NODE_MODE} Mode on port ${process.env.PORT}`
      .bgCyan.white
  );
});