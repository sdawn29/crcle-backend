// AKziGIRACjQCKQs1
const mongoose = require('mongoose');
require('dotenv').config()

module.exports = function() {
    mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true })
        .then(() => console.log('Connected to MongoDB'))
        .catch((e) => console.log('Error Occured' + e));
}