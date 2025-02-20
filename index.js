require("dotenv").config();
const express = require('express');
const fs = require('fs');
const http = require("http");
const cors = require("cors");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan')
const app = express();

const server = http.createServer(app);
const port = process.env.API_PORT;
if(!port)
    throw new ReferenceError("Invalid input: `PORT` is not Defined in ENV file.");  

app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(cors());

// Use the routes from the server/routes directory
const routeFiles = fs.readdirSync('./routes');
routeFiles.forEach(file => {
    console.log('filee',file)
    app.use(`/api/v1/`, require(`./routes/${file}`));
});

// This should be the last route else any after it won't work
app.use("*", (req, res) => {
    res.status(404).json({
        message: "Page not found",
        "code": "404",
        "status": "failure"
    });
});

// Start the server
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


// mongo db connection
const mongoUrl = `mongodb://${process.env.DB_HOST_SECOND}:${process.env.DB_PORT_SECOND}/${process.env.DB_DATABASE_SECOND}`

mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => {
    console.log('MongoDB connected successfully');
  }).catch((error) => {
    console.error('MongoDB connection error:', error);
  });
