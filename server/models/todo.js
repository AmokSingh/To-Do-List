import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
  {
    todo: {
      type: String,
      required: [true, "Todo content is required"],
      trim: true,
      maxlength: [500, "Todo cannot exceed 500 characters"],
    },
    completed: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

// IMPORTANT: This ensures todos are unique per user, not globally
// Each user can have "Eat" but user1's "Eat" and user2's "Eat" are different
todoSchema.index({ userId: 1, todo: 1 }, { unique: true });

const TodoModel = mongoose.model("todos", todoSchema);
export default TodoModel;
