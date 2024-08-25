const express = require("express");
const path = require("path");

const app = express();
const port = 3000;

app.use((req, res, next) => {
  if (req.path !== "/") {
    express.static(path.join(__dirname, "..", "dist"))(req, res, next);
  } else {
    next();
  }
});

app.use("/", (_, res) => {
  res.sendFile(path.join(__dirname, "..", "dist", "index.html"));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
