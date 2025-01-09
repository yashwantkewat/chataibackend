const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const authRoutes = require("./router/routes"); // Assuming your routes are in a folder named 'routes'

const app = express();

// CORS options
const corsOptions = {
    origin: "http://localhost:5173", 
    methods: ["GET", "POST", "PUT", "DELETE"], 
    allowedHeaders: ["Content-Type"], 
};

// Middleware
app.use(bodyParser.json()); // Parse JSON bodies
app.use(cors(corsOptions)); // Enable CORS with options

// MongoDB connection
const uri = "mongodb://127.0.0.1:27017/chatbot";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB:", err);
    });

// Routes
app.get("/",(req,res)=>{
    res.send("hello world")
})
app.use("/api/auth", authRoutes); // All auth-related routes go through /api/auth

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: "Something went wrong" });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
