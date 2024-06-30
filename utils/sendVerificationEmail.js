import Mailgen from 'mailgen';
import nodemailer from 'nodemailer';

export const sendVerificationEmail = (name, emailId, id) => {
	const transporter = nodemailer.createTransport({
		host: 'smtp.zoho.com',
		port: 465,
		secure: true,
		auth: {
			user: "principal@ffsboyswah.com",
			pass: process.env.ApplicationPassword,
		},

	});
	const mailGenerator = new Mailgen({
		theme: 'default',
		product: {
			name: 'Linkedtree',
			link: 'www.linktree.com',
		},
		header: {
			title: 'Yours truly',
			imageUrl: 'https://example.com/logo.png', // Replace with your logo image URL
		},
		footer: {
			name: "Hiii",
			title: 'Linkedtree',
			imageUrl: 'https://example.com/signature.png', // Replace with your signature image URL
		},
	});

	const email = {
		body: {
			name: name,
			intro: ``,
			action: {
				instructions: 'Thanks for Registering you can verify by clicking the below button:',
				button: {
					color: '#22BC66',
					text: 'Open App',
					link: `http://195.200.14.117/verify?id=${id}`,
				},
			},
		},
	};

	const emailBody = mailGenerator.generate(email);

	const mailOptions = {
		from: 'principal@ffsboyswah.com',
		to: emailId,
		subject: 'Verification Link',
		html: emailBody,
	};

	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			console.error('Error sending email:', error);
		} else {
			console.log('Email sent successfully:', info.response);
		}
	});
};


// sendVerificationEmail