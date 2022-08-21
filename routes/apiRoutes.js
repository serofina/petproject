const router = require("express").Router();
const nodemailer = require("nodemailer");
const { createImageUpload } = require("../utils/cloudinary");
const connection = require("../db/connection");

router.post("/api/pet-form", (req, res) => {
  connection.query("INSERT INTO pets SET ?", req.body, (err, result) => {
    if (err) {
      res.status(500).json({ error: err });
    }
    res.json({
      success: true,
    });
  });
});

router.get("/api/pet-form", (req, res) => {
  connection.query("SELECT * FROM pets", (err, result) => {
    if (err) {
      res.status(500).json({ error: err });
    }
    res.json({
      success: true,
      result,
    });
  });
});

router.get("/api/cloudSignature", async (req, res) => {
  const uploadSignature = await createImageUpload();

  res.json(uploadSignature);
});

router.post("/api/signin", (req, res) => {
  res.json("signin");
});

router.post("/api/mailto", (req, res) => {
  console.log("request /api/mailto: ", req.body);
  let { email, subject, message } = req.body;
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: "boris66@ethereal.email",
      pass: "b6wVK8CRsJ5XDMJsTa",
    },
  });

  let mailOptions = {
    from: "pethotelnational@Ethereal.com ",
    to: email,
    subject: subject,
    text: message,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      res.json(error);
    } else {
      res.json("Email sent: " + info.response);
    }
  });
});

router.post("/api/newsletterAddMember", (req, res) => {
  console.log("request /api/newsletterAddMember: ", req.body);
  let { name, email } = req.body;

  connection.query(
    "INSERT INTO newsletter (name, email) VALUES ( ? , ? )",
    [name, email],
    (err) => {
      if (err) {
        res.status(500).json({ error: err });
      }
      res.json({
        success: true,
      });
    }
  );
});

router.get("/api/newsletterSubmit", (req, res) => {
  connection.query("SELECT * FROM newsletter", (err, result) => {
    if (err) {
      res.status(500).json({ error: err });
    }
    res.json({ result });
  });
});

module.exports = router;
