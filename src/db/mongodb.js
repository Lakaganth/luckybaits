const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://admin1:Teamroots20@luckystrike.d63nz.mongodb.net/<dbname>?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
})