
const nodemailer = require("nodemailer");


const sendEmail = async function(receiver, subject, text) {
    const transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "johndoe@gmail.com",
            pass: "jahdgjsjf"
        }
    })
    const mailOptions = {
        from : "johndoe@gmail",
        to: receiver,
        subject: subject,
        text: text 
    } 
    try {
        await transport.sendMail(mailOptions);
        console.log("Message sent successfully");
    } catch (error) {
        console.error(error)
    }
};


module.exports = sendEmail; 
