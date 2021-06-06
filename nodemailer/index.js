const express = require('express');
const ejs = require('ejs');
const nodemailer = require('nodemailer');
const path = require('path');
// const bodyParser = require('body-parser');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// join path
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('formData');
});


app.post('/send', (req, res) => {

    let maillist = [
        'xyz@gmail.com',
        'abc@gmail.com',
        'abcagain@gmail.com'
    ];

    maillist.toString();

    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, 
        auth: {
          user: req.body.from, 
          pass: req.body.password, 
        },
      });
    
      transporter.sendMail({
        from: req.body.from, 
        to: maillist, 
        subject: "Hello ✔", 
        text: req.body.Body, 
        html: req.body.Body,
      }, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          console.log('email sent', result.response)
        }
      });
  
});

app.listen(3000, () => {
    console.log('Server is listening at 3000');
})