const app = require('./app')
require('dotenv').config()

port = process.env.PORT

app.listen(port, ()=> {
    console.log(`server on port ${port}`)
})
