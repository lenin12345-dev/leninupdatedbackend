
const mongoose = require('mongoose');

const Connection = async () => {
   
    try {
        await mongoose.connect(process.env.DATABASE_URI, { useUnifiedTopology: true, useNewUrlParser: true });
        console.log('Database Connected Successfully');
    } catch (error) {
        console.log('dddd',process.env.DATABASE_URI); 
        console.error('Errorff: ', error.message);
    }
};

module.exports = Connection;
