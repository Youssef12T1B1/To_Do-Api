const express = require("express");
const TodoRouter = require("./routes/todo");
const connectDB = require("./config/db");
connectDB();
const app = express();
const PORT = require("./config/.env").PORT;

app.use(express.json());

app.get("/", (req, res, next) => {
  res.json({ message: "server is running" });
});
app.use("/todo", TodoRouter);

app.listen(PORT, () => console.log(`Server running At ${PORT}`));
