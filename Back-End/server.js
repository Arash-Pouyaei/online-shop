const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
const bodyparser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const MongoStore = require("connect-mongo");
const cors = require("cors"); // Import the cors package

dotenv.config({path:"./config/config.env"});

const connectDB = require("./config/db.js");
const winston = require("./config/winston.js");

connectDB();
require("./config/passport.js");

const app = express();

if (process.env.NODE_ENV === "development") {
    app.use(morgan("combined", {stream: winston.stream}));
}

const PORT = process.env.PORT || 5000;

// Configure CORS

app.use(cors({
    origin: "http://localhost:3000/", // Allow all origins. Change this to a specific URL or array of URLs for better security.
    methods: ["GET,HEAD,PUT,PATCH,POST,DELETE"],
    allowedHeaders: ["Content-Type, Authorization"],
    credentials: true, // Allow cookies to be sent with requests
})); // Apply the CORS middleware



app.use(express.static(path.join(__dirname, "public")));
app.use(bodyparser.json());
app.use(
    session({
        secret: "secret",
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({
            mongoUrl: process.env.MONGO_URI,
            mongooseConnection: mongoose.connection,
            collectionName: 'sessions'
        }),
        cookie:{
            httpOnly:true,
            secure:true,
            sameSite: "none"
        }
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/", require("./routes/product.js"));
app.use("/admin", require("./routes/admin.js"));
app.use("/users", require("./routes/users.js"));
app.use(require("./routes/notfound.js"));

app.listen(PORT, () => {
    console.log(`server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
