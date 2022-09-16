const router = require("express").Router();
const nodemailer = require("nodemailer");
const { createImageUpload } = require("../utils/cloudinary");
const connection = require("../db/connection");
const { authenticateToken } = require("../utils/auth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtdecode = require("jwt-decode");

router.post("/api/decode", authenticateToken, (req, res) => {
  const decoded = jwtdecode(req.body.token);

  res.json({
    success: true,
    decoded,
  });
});

router.post("/api/pet-insert", authenticateToken, (req, res) => {
  let { iduser } = req.user;
  connection.query("INSERT INTO `pets` (`userid`) VALUES (?);", iduser, (err, result) => {
    if (err) {
      res.status(500).json({ error: err });
    }else{
    res.json({
      success: true,
    });
  }
  });
});

router.put("/api/pet-update/:pet_id", authenticateToken, (req, res) => {
  connection.query("update pets SET ? where id =?", [req.body,req.params.pet_id],
   (err, result) => {
    if (err) {
      res.status(500).json({ error: err });
    }else{
    res.json({
      success: true,
    });
  }
  });
});

router.get("/api/petform_info/:pet_id", authenticateToken, (req, res) => {
  connection.query("SELECT * FROM pets where id = ?;",req.params.pet_id, (err, result) => {
    if (err) {
      res.status(500).json({ error: err });
    }else{
    res.json({
      success: true,
      data: result,
    });
  }
  });
});

router.get("/api/pet-form/:userId", authenticateToken, (req, res) => {
  connection.query(
    "SELECT * FROM pets WHERE userId = ?",
    [req.params.userId],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err });
      }else{
      res.json({
        success: true,
        data: result,
      });
    }
    }
  );
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
            const username = results[0].name;
            const email = results[0].email;
            const iduser = results[0].iduser;
            const user = { name: username, email: email, iduser: iduser };
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN, {
              expiresIn: "2h",
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
  let { name, email } = req.body;
  connection.query(
    "INSERT INTO newsletter (name, email) VALUES ( ? , ? )",
    [name, email],
    (err) => {
      if (err) {
        res.status(404).json({ error: err });
      }else{
      res.json({
        success: true,
      });
    }
    }
  );
});

router.get("/api/newsletterSubmit", authenticateToken,(req, res) => {
  let { iduser } = req.user;
    if (iduser===155) {
      connection.query("SELECT * FROM newsletter", function (err, result) {
        if (err) {
          res.status(404).json({ error: err });
        }else{
        res.json({ result });
        }
      });
    }else{  res.status(404).json({ error: "invalid User" });
  }
});


router.post("/api/register", (req, res) => {
  const { email, name, password } = req.body;
  const hash = bcrypt.hashSync(password, 10);
  connection.query(
    `call addUser ("${name}", "${email}", "${hash}")`,
    function (err, result) {
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
  console.log("hello")
  let { iduser } = req.user;
  connection.query(
    "SELECT * FROM users, customerinfo where users.iduser= customerinfo.iduser and users.iduser = ?;",
    [iduser],
    (err, result) => {
      if (err){ 
        console.log(err)
        res.status(404).json({ error: "No user" })
      };
      res.json(result);
    }
  );
});

router.post('/api/get_user', authenticateToken, (req, res) => {
  if (req.user) {
    res.json({
      user: req.user
    })
  } else {
    res.sendStatus(403)
  }
})

router.post("/api/booking", authenticateToken, (req, res) => {
  console.log(req.body)
  let {date, time, service} = req.body;
  let {iduser} = req.user;

  if (iduser == null) {
    res.redirect('/signup')
  }
  console.log(date, time, service)

  connection.query(
    'insert into booking (date, time, type, user_id) values (?, ?, (select id from booking_type where name=?), ?);',
    [date, time, service, iduser],
    (err, result) => {
      if (err) {
        console.log(err)
        
        res.status(500).json({
          error: "Database error"
      })} else {
        res.status({success: true})
      }
    }
  );
})

router.get("/auth", authenticateToken, (req, res) => {
  res.json({ authenticated: true });
});

module.exports = router;
