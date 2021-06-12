require('dotenv').config();
module.exports = {
  MONOGCONFIG:
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.xvkdi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
};

