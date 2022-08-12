const router = require("express").Router();
const path = require("path");

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

router.get("/about.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/about.html"));
});

router.get("/booking.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/booking.html"));
});
router.get("/contact.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/contact.html"));
});
router.get("/customerform.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/customerform.html"));
});
router.get("/faq.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/faq.html"));
});
router.get("/index.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});
router.get("/login.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/login.html"));
});
router.get("/petform.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/petform.html"));
});
router.get("/policy.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/policy.html"));
});
router.get("/registration.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/registration.html"));
});
router.get("/requirements.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/requirements.html"));
});
router.get("/sendemail.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/sendemail.html"));
});
router.get("/sendnewsletter.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/sendnewsletter.html"));
});
router.get("/service.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/service.html"));
});


router.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/404.html"));
});

module.exports = router;