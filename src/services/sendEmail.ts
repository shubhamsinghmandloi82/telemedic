import nodemailer from 'nodemailer';

const sendEmail = async (email,subject, text) => {

    try{
        let testAccount = await nodemailer.createTestAccount();

        const transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port:587,
            secure:false,
            auth:{
                user:testAccount.user,
                pass:testAccount.pass,
            }
        });
    
        await transporter.sendEmail({
            from: '"Fred Foo 👻" <foo@example.com>',
            to: email,
            subject: subject,
            text: text
        });

        console.log("Eamil sent Successful")
    }catch(error){
        console.log(error, "email not sent");
    }
    
}

export default sendEmail;