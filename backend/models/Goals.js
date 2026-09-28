const mongoose = require("mongoose");

const goalsSchema = mongoose.Schema(
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

        targetDate: {
            type: Date,
            required: true,
        },

        progress: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },

        status: {
            type: String,
            enum: ["Active", "Completed"],
            default: "Active",
        },
    },
    {
        timestamps: {
            createdAt: "created_at",
        },
    },
);

module.exports = mongoose.model("Goal", goalsSchema);
