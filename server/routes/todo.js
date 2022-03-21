const express = require("express");
const Todo = require("../models/todo");
const router = express.Router();

// All the todo List
router.get("/", (req, res, next) => {
  const page = req.params.page || 1;
  const limit = req.params.limit || 5;
  const skip = (page - 1) * limit;

  Todo.find()
    .select("-__v")
    .skip(+skip)
    .limit(+limit)
    .exec()
    .then((Todos) => {
      const response = {
        count: Todos.length,
        ExistedTodos: Todos.map((todo) => {
          return {
            title: todo.title,
            content: todo.content,
            completed: todo.completed,
            request: {
              type: "GET",
              url: "http://localhost:4000/todo/" + todo._id,
            },
          };
        }),
      };
      res.status(200).json({ response });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

// Get a single Todo
router.get("/:id", (req, res, next) => {
  const id = req.params.id;
  Todo.findById(id)
    .exec()
    .then((result) => {
      if (result) {
        res.status(200).json(result);
      } else {
        res.status(404).json({
          message: "No Todo found with given Id :" + id,
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});
// Create a single Todo
router.post("/create", (req, res, next) => {
  const todo = Todo({
    title: req.body.title,
    content: req.body.content,
    completed: req.body.completed,
  });
  todo
    .save()
    .then((result) => {
      res.status(201).json({
        message: "A Todo Created successfully",
        CreatedTodo: {
          title: result.title,
          content: result.content,
          request: {
            type: "GET",
            url: "http://localhost:4000/todo/" + result._id,
          },
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

// Edit Todo by Id
router.patch("/:id", (req, res, next) => {
  const id = req.params.id;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.TodoN] = ops.value;
  }

  Todo.updateOne({ _id: id }, { $set: updateOps })
    .then((result) => {
      res.status(200).json({
        message: "Todo Updated",
        request: {
          type: "GET",
          url: "http://localhost:4000/todo/" + id,
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

// Delete Todo by Id
router.delete("/:id", (req, res, next) => {
  const id = req.params.id;
  Todo.deleteOne({ _id: id })
    .exec()
    .then((result) => {
      if (result.deletedCount == 0) {
        res.status(404).json({
          message: "No Todo found with given Id :" + id,
        });
      } else {
        res.status(200).json({
          message: "Todo Deleted",
          request: {
            type: "POST",
            url: "http://localhost:4000/todo",
            body: {
              title: "String",
              content: "String",
              completed: "Boolean",
            },
          },
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
