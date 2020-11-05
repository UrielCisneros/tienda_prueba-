const nodemailer = require('nodemailer');

const sendEmail = {};

sendEmail.sendEmail = (emailAdmin,action,htmlContent,service) => {
	console.log(emailAdmin);
	console.log(action);
	console.log(service);
	const transporter = nodemailer.createTransport({
		host: process.env.HOST_EMAIL,
		port: process.env.PORT_EMAIL,
		secure: false,
		auth: {
			user: process.env.USER_EMAIL,
			pass: process.env.PASS_EMAIL
		},
		tls: {
			rejectUnauthorize: false
		}
	})

	console.log(process.env.USER_EMAIL);
	console.log(process.env.PASS_EMAIL);
	console.log(process.env.HOST_EMAIL);
	console.log(process.env.PORT_EMAIL);

	const info = transporter.sendMail({
		from:` '${service}' <${process.env.USER_EMAIL}>`,
		to: emailAdmin,
		subject: action,
		html: htmlContent,
    })
    
    return info;
}


module.exports = sendEmail;