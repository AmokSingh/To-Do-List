import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import TodoModel from "../models/todo.js";

const router = express.Router();

router.post("/create-todo", verifyToken, async (req, res) => {
  const { todo } = req.body;
  const userId = req.userId;

  if (!todo || todo.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: "Todo content is required",
    });
  }

  try {
    // 🔍 CHECK: Does this todo already exist for THIS SPECIFIC user? (Case-Insensitive)
    const existingTodo = await TodoModel.findOne({
      userId: userId, // <-- IMPORTANT: Filter by current user
      todo: { $regex: new RegExp("^" + todo.trim() + "$", "i") },
    });

    if (existingTodo) {
      return res.status(400).json({
        success: false,
        message: "⚠️ You already have this todo in your list!",
      });
    }

    const newTodo = new TodoModel({
      todo: todo.trim(),
      userId,
    });
    await newTodo.save();

    res.status(201).json({
      success: true,
      message: "Todo created successfully",
      todo: newTodo,
    });
  } catch (error) {
    console.error("Create Todo Error:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "⚠️ This todo already exists in your list!",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create todo",
    });
  }
});

router.get("/read-todos", verifyToken, async (req, res) => {
  const userId = req.userId;

  try {
    const todos = await TodoModel.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      todos,
    });
  } catch (error) {
    console.error("Read Todos Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch todos",
    });
  }
});

router.patch("/update-todo/:id", verifyToken, async (req, res) => {
  const todoId = req.params.id;
  const { updatedTodo } = req.body;
  const userId = req.userId;

  if (!updatedTodo || updatedTodo.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: "Todo content is required",
    });
  }

  try {
    // Check if updated todo already exists for THIS SPECIFIC user (case-insensitive, excluding current todo)
    const existingTodo = await TodoModel.findOne({
      userId: userId, // <-- IMPORTANT: Filter by current user
      todo: { $regex: new RegExp("^" + updatedTodo.trim() + "$", "i") },
      _id: { $ne: todoId },
    });

    if (existingTodo) {
      return res.status(400).json({
        success: false,
        message: "⚠️ You already have this todo in your list!",
      });
    }

    const todo = await TodoModel.findOne({ _id: todoId, userId });
    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    }

    todo.todo = updatedTodo.trim();
    await todo.save();

    res.status(200).json({
      success: true,
      message: "Todo updated successfully",
    });
  } catch (error) {
    console.error("Update Todo Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update todo",
    });
  }
});

router.patch("/toggle-todo/:id", verifyToken, async (req, res) => {
  const todoId = req.params.id;
  const userId = req.userId;

  try {
    const todo = await TodoModel.findOne({ _id: todoId, userId });
    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    }

    todo.completed = !todo.completed;
    await todo.save();

    res.status(200).json({
      success: true,
      message: "Todo status updated successfully",
      completed: todo.completed,
    });
  } catch (error) {
    console.error("Toggle Todo Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update todo status",
    });
  }
});

router.delete("/delete-todo/:id", verifyToken, async (req, res) => {
  const todoId = req.params.id;
  const userId = req.userId;

  try {
    const todo = await TodoModel.findOneAndDelete({ _id: todoId, userId });
    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Todo deleted successfully",
    });
  } catch (error) {
    console.error("Delete Todo Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete todo",
    });
  }
});

export { router as todoRouter };
