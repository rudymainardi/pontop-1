const mongoose = require('mongoose');
require('dotenv').config();

const url = `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.jhzfs.mongodb.net/${process.env.MONGO_DB_NAME}?retryWrites=true&w=majority`;
console.log(`Connecting to ${url}`);

const connection = mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

module.exports = connection;