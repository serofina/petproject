const express = require("express");
const htmlRoute = require("./routes/htmlRoutes");
const apiRoutes = require("./routes/apiRoutes.js");

//create express server instance
const app = express();

app.use(express.json()); // allows for the server to accept json objs
app.use(express.urlencoded({ extended: true })); // server to accept strings and array from url

app.use(express.static("public"));

app.use(apiRoutes);
app.use(htmlRoute);

app.listen(3000, () => {
  console.log("App in running on node 3000");
});
