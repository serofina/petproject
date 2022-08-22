const express = require('express');
const bodyParser = require('body-parser');
const path = require("path");
const fs = require("fs");
const mysql = require("mysql2");
const nodemailer = require('nodemailer');
const htmlRoute = require("./routes/htmlRoutes");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const { request } = require('http');
const saltRounds = 10;
require("dotenv").config();




const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});


const app = express();
app.use(express.urlencoded({ extended: false })); // server to accept strings and array from url
app.use(express.json()); // allows for the server to accept json objs

app.use(bodyParser.json());

app.use(express.static("public"));


app.post("/api/signin", async function (req, res) {
	const { email, password} = req.body
	connection.query(`SELECT * FROM users, login where users.iduser=login.iduser and email = ?`, [email],
	async function(error, results, fields) {
					if (error) {
						res.status(401).json({success: false, message: "Login not successful" })
					}else{
						if(results.length > 0){
							const isvalid = bcrypt.compareSync(password,results[0].hash);
										if (isvalid){
											const username = results[0].username;
											const email = results[0].email;
											const iduser = results[0].iduser; 
											const user ={name: username, email: email, iduser: iduser}
											const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN)
											res.json({ success: true, accessToken: accessToken});
										}else{
											res.status(500).json({ success: false, Error: 'Email and Pass do not match.'});
										}      
						}else{
							res.status(206).json({ success: false, message: "User not found" })
						}
				}
			});
	})
	
	
	
	app.post("/api/register", (req, res) => {

    const { email, name, password } = req.body;
    const hash = bcrypt.hashSync(password, saltRounds);
      connection.query(
      `call addUser ("${name}", "${email}", "${hash}")`,
        function (err, result) {
          console.log(result);
          if(result[0][0].hasOwnProperty("fail")) {
						res.status(500).json({ success: false, error: err });
          }else{
            res.json({ success: true });
          }
      });
   })
      

   app.put("/api/customerform" ,authenticateToken, (req, res) => {
		let { iduser } = req.user
    let { firstName, lastName, phone, address, address2, city, state, zip, emergencyContact, emergencyPhone} = req.body;

    connection.query(
    `UPDATE customerinfo SET firstName = "${firstName}", lastName ="${lastName}", 
    phone = "${phone}", address = "${address}", address2 = "${address2}", city = "${city}", 
    state = "${state}", zip = "${zip}", emergencyContact = "${emergencyContact}", emergencyphone = "${emergencyPhone}"
    WHERE (iduser = '${iduser}');`,
     function (err, result) {
        if(result.affectedRows === 0|| err) {
          res.status(500).json({ success: false, error: err });
        }else{
          res.json({ success: true });
        }
      });
  })


app.post('/api/mailto', (req, res) => {
	let { email, subject, message } = req.body;
	console.log(email, subject)
	const transporter = nodemailer.createTransport({
		host: 'smtp.ethereal.email',
		port: 587,
		auth: {
			user: 'boris66@ethereal.email',
			pass: 'b6wVK8CRsJ5XDMJsTa'
		}
	});

	let mailOptions = {
		from: 'pethotelnational@Ethereal.com ',
		to: email,
		subject: subject,
		text: message
	};

	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			res.json(error);
		} else {
			res.json('Email sent: ' + info.response);
		}
	});
})



app.post("/api/newsletterAddMember", (req, res) => {
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

app.get("/api/newsletterSubmit", (req, res) => {
	connection.query("SELECT * FROM newsletter", function (err, result) {
			if (err) {
				res.status(404).json({ error: err });
			}
			res.json({ result });
		}
	);
});

app.get("/api/customerinformation",authenticateToken, (req, res) => {
	let { iduser } = req.user
	connection.query("SELECT * FROM users, customerinfo where users.iduser= customerinfo.iduser and users.iduser = ?;", [iduser], 
	(err, result) => {
		if (err) res.status(404).json({ error: 'No user' });
		res.json(result);
	});
});


app.get("/auth",authenticateToken, (req, res) => {
	res.json({authenticated: true});
});

app.get("/petform",authenticateToken,(req, res) => {
  res.sendFile(path.join(__dirname, "./public/petform.html"));
});


function authenticateToken(req, res, next) {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];

	if (token===null) return res.sendStatus(401)

	jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
		if (err) return res.sendStatus(403);
		req.user = user
		next()
	})
}

app.use(htmlRoute);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`app in running on node ${PORT}`);
});