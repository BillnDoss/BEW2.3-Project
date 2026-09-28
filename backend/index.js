const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/userRoute");
const taskRoutes = require("./routes/taskRoute");
const goalRoutes = require("./routes/goalsRoute");
const reminderRoutes = require('./routes/remindersRoute')

require("dotenv").config();

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB Connected");
    })
    .catch((err) => {
        console.log(err);
    });

const corsHandler = cors({
    origin: "*",
    methods: "GET,POST,PUT,PATCH,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200,
    preflightContinue: true,
});

app.use(corsHandler);

app.use("/users", userRoutes);
app.use("/tasks", taskRoutes);
app.use("/goals", goalRoutes);
app.use("/reminders", reminderRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
