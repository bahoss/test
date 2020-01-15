const express = require("express");
const bodyParser = require("body-parser");

var fs = require("fs");
const quizData = require("../quiz.json");

const app = express();
app.use(bodyParser());

app.get("/api", function(req, res) {
  res.json(quizData);
});

app.get("/result", (req, res) => {
  const resultData = require("../result.json");
  res.json(resultData);
});

app.post("/result", (req, res) => {
  const resData = req.body;
  let data = JSON.stringify(resData);
  fs.writeFileSync("result.json", data);
  const resultData = require("../result.json");
  res.json(resultData);
});

app.listen(3001, () =>
  console.log("Express server is running on localhost:3001")
);
