const express = require('express');
const bodyParser = require('body-parser');
const path = require("path");
const fs = require("fs");
const mysql = require("mysql2");
const nodemailer = require('nodemailer');


const connection = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "password",
	database: "pets_db",
});

const app = express();
app.use(express.urlencoded({ extended: false })); // server to accept strings and array from url
app.use(express.json()); // allows for the server to accept json objs

app.use(bodyParser.json());

app.use(express.static("public"));


app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, "/public/index.html"));
});

// app.get('/sendnewsletter.html', (req, res) => {
// 	res.sendFile(path.join(__dirname, "/public/sendnewsletter.html"));
// });


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



app.post("/api/newsletter", (req, res) => {
	let { name, email } = req.body;
	console.log(name, email);


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

app.get("/api/newsletter", (req, res) => {

	connection.query("SELECT * FROM newsletter", (err, result) => {
		if (err) {
			res.status(404).json({ error: err });
		}
		res.json({ result });
	}
	);
});



app.listen(3000, () => {
	console.log("app in running on node 3000");
})