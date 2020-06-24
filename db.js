const mongoose = require('mongoose')

.connect('mongodb://127.0.0.1:27017', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
})
.then(function () {
    console.log("data base connected successfully")
})
.catch(function (err) {
    console.log(err.message)
})