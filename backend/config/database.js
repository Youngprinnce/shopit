const mongoose = require('mongoose');

require('dotenv').config({ path: 'backend/config/config.env' })

const connectDatabase = () => {
    mongoose.connect(process.env.NODE_ENV === 'DEVELOPMENT' ? process.env.DB_LOCAL_URI : process.env.DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    }).then(()=> { console.log(`DB Connected`)})
}

module.exports = connectDatabase