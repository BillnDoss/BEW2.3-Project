const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./models/User");
const Reminder = require("./models/Reminders");
const Goal = require("./models/Goals");
const Task = require("./models/Tasks");

const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);

        console.log("MongoDB connected");

        // Clear existing data
        await User.deleteMany({});
        await Reminder.deleteMany({});
        await Goal.deleteMany({});
        await Task.deleteMany({});

        console.log("Existing data cleared");

        // Create users
        const users = await User.create([
            {
                name: "John Doe",
                email: "john@example.com",
                password: "password123",
                role: "user",
            },
            {
                name: "Jane Smith",
                email: "jane@example.com",
                password: "password456",
                role: "user",
            },
        ]);

        console.log("Users created");

        const john = users[0];
        const jane = users[1];

        // Create reminders
        await Reminder.create([
            {
                userId: john._id,
                title: "Pay electricity bill",
                description: "Pay the monthly electricity bill",
                remindAt: new Date("2026-10-01T09:00:00"),
                status: "Pending",
            },
            {
                userId: john._id,
                title: "Team meeting",
                description: "Attend the weekly team meeting",
                remindAt: new Date("2026-10-02T10:00:00"),
                status: "Pending",
            },
            {
                userId: jane._id,
                title: "Doctor appointment",
                description: "Annual health checkup",
                remindAt: new Date("2026-10-03T14:00:00"),
                status: "Pending",
            },
        ]);

        console.log("Reminders created");

        // Create goals
        await Goal.create([
            {
                userId: john._id,
                title: "Learn JavaScript",
                description: "Improve JavaScript programming skills",
                targetDate: new Date("2026-12-31"),
                progress: 60,
                status: "Active",
            },
            {
                userId: john._id,
                title: "Complete Project",
                description: "Finish the final year project",
                targetDate: new Date("2026-11-30"),
                progress: 80,
                status: "Active",
            },
            {
                userId: jane._id,
                title: "Read 10 Books",
                description: "Read ten books this year",
                targetDate: new Date("2026-12-31"),
                progress: 100,
                status: "Completed",
            },
        ]);

        console.log("Goals created");

        // Create tasks
        await Task.create([
            {
                userId: john._id,
                title: "Finish assignment",
                description: "Complete the database assignment",
                dueDate: new Date("2026-10-05"),
                priority: "High",
                status: "In Progress",
                completed: false,
            },
            {
                userId: john._id,
                title: "Buy groceries",
                description: "Buy groceries for the week",
                dueDate: new Date("2026-10-01"),
                priority: "Medium",
                status: "Pending",
                completed: false,
            },
            {
                userId: jane._id,
                title: "Submit report",
                description: "Submit the monthly report",
                dueDate: new Date("2026-10-02"),
                priority: "High",
                status: "Completed",
                completed: true,
            },
        ]);

        console.log("Tasks created");

        console.log("Database seeded successfully!");

        await mongoose.connection.close();
        console.log("MongoDB connection closed");
    } catch (error) {
        console.error("Seeding failed:", error);

        await mongoose.connection.close();
        process.exit(1);
    }
};

seedDatabase();
