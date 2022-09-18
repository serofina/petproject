const router = require("express").Router();
const path = require("path");

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

router.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/about.html"));
});

router.get("/booking", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/booking.html"));
});

router.get("/blog", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/blog.html"));
});

router.get("/contact", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/contact.html"));
});

router.get("/customerform", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/customerform.html"));
});

router.get("/confirmation", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/confirmation.html"));
});

router.get("/faqs", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/faqs.html"));
});

router.get("/index", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

router.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/login.html"));
});

router.get("/petform", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/petform.html"));
});

router.get("/petprofile", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/petprofile.html"));
});

router.get("/policy", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/policy.html"));
});

router.get("/registration", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/registration.html"));
});

router.get("/requirements", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/requirements.html"));
});

router.get("/sendemail", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/sendemail.html"));
});

router.get("/sendnewsletter", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/sendnewsletter.html"));
});

router.get("/service", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/service.html"));
});

router.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/404.html"));
});

module.exports = router;
