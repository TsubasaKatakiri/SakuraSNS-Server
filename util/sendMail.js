const nodemailer = require("nodemailer");

const sendMail = (to, link, text) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth:{
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            }
    })

    const mailOptions = {
        from: process.env.SMTP_USER,
        to: to,
        subject: `The Social Network Project Notification`,
        html:`
        <div style="width: 500px; margin: auto; border: 1px solid #000000; font-family:Arial, Helvetica, sans-serif">
            <div style="border-bottom: 1px solid #000000">
                <h2 style="text-align: center; font-family:Arial, Helvetica, sans-serif">The Social Network Project</h2>
            </div>
            <div style="padding: 10px; text-align: justify">
                <p>Good daytime,</p>
                <p>This is the Social Network Project.</p>
                <p>Please, proceed this link to ${text}:</p>
                <a href=${link}>${link}</a>
                <p>This message is sent automatically. Please, do not respond on it.</p>
            </div>
        </div>
        `
    }

    transporter.sendMail(mailOptions, (err, info) => {
        if(err) return err;
        return info;
    })
}

module.exports = sendMail;