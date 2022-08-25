const router = require("express").Router();
const nodemailer = require("nodemailer");
const { createImageUpload } = require("../utils/cloudinary");
const connection = require("../db/connection");
const { authenticateToken } = require("../utils/auth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/api/pet-form", authenticateToken, (req, res) => {
  connection.query("INSERT INTO pets SET ?", req.body, (err, result) => {
    if (err) {
      res.status(500).json({ error: err });
    }
    res.json({
      success: true,
    });
  });
});

router.get("/api/pet-form", authenticateToken, (req, res) => {
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

router.get("/api/cloudSignature", authenticateToken, async (req, res) => {
  const uploadSignature = await createImageUpload();

  res.json(uploadSignature);
});

router.post("/api/signin", (req, res) => {
  const { email, password } = req.body;
  connection.query(
    `SELECT * FROM users, login where users.iduser=login.iduser and email = ?`,
    [email],
    async function (error, results) {
      if (error) {
        res
          .status(401)
          .json({ success: false, message: "Login not successful" });
      } else {
        if (results.length > 0) {
          const isvalid = bcrypt.compareSync(password, results[0].hash);
          if (isvalid) {
            const username = results[0].username;
            const email = results[0].email;
            const iduser = results[0].iduser;
            const user = { name: username, email: email, iduser: iduser };
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN, {
              expiresIn: "15m",
            });
            res.json({ success: true, accessToken: accessToken });
          } else {
            res
              .status(500)
              .json({ success: false, Error: "Email and Pass do not match." });
          }
        } else {
          res.status(206).json({ success: false, message: "User not found" });
        }
      }
    }
  );
});

router.post("/api/mailto", (req, res) => {
  let { email, subject, message } = req.body;
  console.log(email, subject);
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

router.post("/api/newsletterAddMember", authenticateToken, (req, res) => {
  let { name, email } = req.body;
  connection.query(
    "INSERT INTO newsletter (name, email) VALUES ( ? , ? )",
    [name, email],
    (err) => {
      if (err) {
        res.status(404).json({ error: err });
      }
      res.json({
        success: true,
      });
    }
  );
});

router.get("/api/newsletterSubmit", authenticateToken, (req, res) => {
  connection.query("SELECT * FROM newsletter", function (err, result) {
    if (err) {
      res.status(404).json({ error: err });
    }
    res.json({ result });
  });
});

router.post("/api/register", (req, res) => {
  const { email, name, password } = req.body;

  console.log(req.body);
  const hash = bcrypt.hashSync(password, 10);
  connection.query(
    `call addUser ("${name}", "${email}", "${hash}")`,
    function (err, result) {
      console.log("****", result);
      if (result[0][0].hasOwnProperty("fail")) {
        res.status(500).json({ success: false, error: err });
      } else {
        res.json({ success: true });
      }
    }
  );
});

router.put("/api/customerform", authenticateToken, (req, res) => {
  let { iduser } = req.user;
  let {
    firstName,
    lastName,
    phone,
    address,
    address2,
    city,
    state,
    zip,
    emergencyContact,
    emergencyPhone,
  } = req.body;

  connection.query(
    `UPDATE customerinfo SET firstName = "${firstName}", lastName ="${lastName}", 
    phone = "${phone}", address = "${address}", address2 = "${address2}", city = "${city}", 
    state = "${state}", zip = "${zip}", emergencyContact = "${emergencyContact}", emergencyphone = "${emergencyPhone}"
    WHERE (iduser = '${iduser}');`,
    function (err, result) {
      if (result.affectedRows === 0 || err) {
        res.status(500).json({ success: false, error: err });
      } else {
        res.json({ success: true });
      }
    }
  );
});

router.get("/api/customerinformation", authenticateToken, (req, res) => {
  let { iduser } = req.user;
  connection.query(
    "SELECT * FROM users, customerinfo where users.iduser= customerinfo.iduser and users.iduser = ?;",
    [iduser],
    (err, result) => {
      if (err) res.status(404).json({ error: "No user" });
      res.json(result);
    }
  );
});

router.get("/auth", authenticateToken, (req, res) => {
  res.json({ authenticated: true });
});

module.exports = router;
