const mongoose = require("mongoose");

const reminderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        title: {
            type: String,
            required: true,
        },

        description: {
            type: String,
        },

        remindAt: {
            type: Date,
            required: true,
        },

        status: {
            type: String,
            enum: ["Pending", "Completed"],
            default: "Pending",
        },
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
    },
);

module.exports = mongoose.model("Reminder", reminderSchema);
