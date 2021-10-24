const express = require("express");
const userRouter = require("./routes/routes");
const cors = require("cors");
const db = require("./pool");

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

app.use("/api", userRouter);

const start = async () => {
  try {
    await db.connect();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
