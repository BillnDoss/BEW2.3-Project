const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("./models/User");
const Task = require("./models/Tasks");
const Reminder = require("./models/Reminders");
const Goal = require("./models/Goals");

require("dotenv").config();

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        console.log("Connected to MongoDB");

        // Clear existing data
        await User.deleteMany({});
        await Task.deleteMany({});
        await Reminder.deleteMany({});
        await Goal.deleteMany({});

        console.log("Cleared existing data");

        // --------------------------------------------------
        // USERS
        // --------------------------------------------------

        const password = await bcrypt.hash(
            "Password123!",
            Number(process.env.BCRYPT_SALT_ROUNDS),
        );

        const users = await User.insertMany([
            {
                name: "admin",
                email: "admin@email.com",
                password,
                role: "admin",
            },
            {
                name: "John Doe",
                email: "john@example.com",
                password,
                role: "user",
            },
            {
                name: "Jane Smith",
                email: "jane@example.com",
                password,
                role: "user",
            },
            {
                name: "Bob Wilson",
                email: "bob@example.com",
                password,
                role: "user",
            },
        ]);

        const admin = users.find((user) => user.role === "admin");
        const john = users.find((user) => user.email === "john@example.com");
        const jane = users.find((user) => user.email === "jane@example.com");
        const bob = users.find((user) => user.email === "bob@example.com");

        console.log("Created users");

        // --------------------------------------------------
        // TASKS
        // --------------------------------------------------

        await Task.insertMany([
            // John's tasks
            {
                userId: john._id,
                title: "Finish project proposal",
                description: "Complete the project proposal and send it to the team.",
                dueDate: new Date("2026-10-05"),
                priority: "High",
                status: "In Progress",
                completed: false,
            },
            {
                userId: john._id,
                title: "Read documentation",
                description: "Read the new API documentation.",
                dueDate: new Date("2026-10-07"),
                priority: "Medium",
                status: "Pending",
                completed: false,
            },
            {
                userId: john._id,
                title: "Update profile",
                description: "Update profile information.",
                dueDate: new Date("2026-09-28"),
                priority: "Low",
                status: "Completed",
                completed: true,
            },

            // Jane's tasks
            {
                userId: jane._id,
                title: "Prepare presentation",
                description: "Prepare slides for the upcoming presentation.",
                dueDate: new Date("2026-10-03"),
                priority: "High",
                status: "In Progress",
                completed: false,
            },
            {
                userId: jane._id,
                title: "Review emails",
                description: "Go through outstanding emails.",
                dueDate: new Date("2026-10-01"),
                priority: "Medium",
                status: "Pending",
                completed: false,
            },
            {
                userId: jane._id,
                title: "Submit report",
                description: "Submit the monthly report.",
                dueDate: new Date("2026-09-25"),
                priority: "High",
                status: "Completed",
                completed: true,
            },

            // Bob's tasks
            {
                userId: bob._id,
                title: "Fix dashboard bug",
                description: "Investigate the dashboard loading issue.",
                dueDate: new Date("2026-10-02"),
                priority: "High",
                status: "Pending",
                completed: false,
            },
            {
                userId: bob._id,
                title: "Database cleanup",
                description: "Remove old unused records.",
                dueDate: new Date("2026-10-10"),
                priority: "Low",
                status: "Pending",
                completed: false,
            },
        ]);

        console.log("Created tasks");

        // --------------------------------------------------
        // REMINDERS
        // --------------------------------------------------

        await Reminder.insertMany([
            // John's reminders
            {
                userId: john._id,
                title: "Team meeting",
                description: "Weekly team meeting.",
                remindAt: new Date("2026-10-01T09:00:00"),
                status: "Pending",
            },
            {
                userId: john._id,
                title: "Submit timesheet",
                description: "Submit this week's timesheet.",
                remindAt: new Date("2026-10-03T17:00:00"),
                status: "Pending",
            },

            // Jane's reminders
            {
                userId: jane._id,
                title: "Doctor appointment",
                description: "Appointment at 2 PM.",
                remindAt: new Date("2026-10-04T14:00:00"),
                status: "Pending",
            },
            {
                userId: jane._id,
                title: "Pay subscription",
                description: "Renew monthly subscription.",
                remindAt: new Date("2026-09-20T12:00:00"),
                status: "Completed",
            },

            // Bob's reminders
            {
                userId: bob._id,
                title: "Project deadline",
                description: "Project deadline is approaching.",
                remindAt: new Date("2026-10-06T09:00:00"),
                status: "Pending",
            },
        ]);

        console.log("Created reminders");

        // --------------------------------------------------
        // GOALS
        // --------------------------------------------------

        await Goal.insertMany([
            // John's goals
            {
                userId: john._id,
                title: "Learn React",
                description: "Improve React skills and build several projects.",
                targetDate: new Date("2026-12-31"),
                progress: 65,
                status: "Active",
            },
            {
                userId: john._id,
                title: "Complete certification",
                description: "Finish the professional certification.",
                targetDate: new Date("2026-11-30"),
                progress: 40,
                status: "Active",
            },

            // Jane's goals
            {
                userId: jane._id,
                title: "Improve fitness",
                description: "Exercise consistently throughout the year.",
                targetDate: new Date("2026-12-31"),
                progress: 75,
                status: "Active",
            },
            {
                userId: jane._id,
                title: "Read 20 books",
                description: "Read 20 books this year.",
                targetDate: new Date("2026-12-31"),
                progress: 100,
                status: "Completed",
            },

            // Bob's goals
            {
                userId: bob._id,
                title: "Build portfolio",
                description: "Create a professional developer portfolio.",
                targetDate: new Date("2026-11-15"),
                progress: 30,
                status: "Active",
            },
        ]);

        console.log("Created goals");

        console.log("\nSeed completed successfully!");

        console.log("\nLogin accounts:");
        console.log("-------------------------------");
        console.log("Admin: admin@email.com.com");
        console.log("User:  john@example.com");
        console.log("User:  jane@example.com");
        console.log("User:  bob@example.com");
        console.log("-------------------------------");
        console.log("Password: Password123!");

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error("Seed failed:", error);

        await mongoose.connection.close();
        process.exit(1);
    }
};

seedDatabase();
