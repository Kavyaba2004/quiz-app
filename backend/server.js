const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
const connectDb = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const quizRoutes = require("./routes/quizRoutes");
const performanceRoutes = require("./routes/performanceRoutes");
const languageRoutes = require("./routes/languageRoutes"); // 👈 NEW LINE
const cors = require("cors");

dotenv.config();

connectDb();

const app = express();

app.use(express.json());

app.use(cors());

app.get("/", (req, res) => {
  res.status(200).send("App is running successfully!");
});

app.use("/user", userRoutes);
app.use("/quiz", quizRoutes);
app.use("/performance", performanceRoutes);
app.use("/api/language", languageRoutes);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(
    `Server is running on http://localhost:${port}`.cyan.bgWhite.bold
  );
});
