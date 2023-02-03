const express = require("express");
const mongoose = require("mongoose")
const routes = require("./routes/routes")
// connect to cloud database(mongoose/mongoDB)

mongoose.connect("mongodb+srv://Jmukakalisa:Wharfdaycare%401@cluster0.fjkf6.mongodb.net/restFull-api?retryWrites=true&w=majority",
{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    const app = express()
    app.use(express.json())
    app.use("/api", routes)

    app.listen(3000, () => {
        console.log("App connected to mongoDB successfully");
        console.log("Server has started successfully!")
    })
})
.catch((e) => {
    console.log("Mongodb connection error "+e.message);
})
