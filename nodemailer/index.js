const express = require('express');
const ejs = require('ejs');
const nodemailer = require('nodemailer');
const path = require('path');
// const bodyParser = require('body-parser');
const fetch = require('node-fetch');

////////////////////////////////////////
const File = require("./model/uploader");
const multer = require("multer");
////////////////////////////////////////


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





//////////////////////////////////////////////



const mongoose = require("mongoose");

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION, APP SHUTTING NOW!!");
  console.log(err.message, err.name);
  process.exit(1);
});

const DB = "mongodb://localhost:27017/file-system";

mongoose
  .connect(DB, {
    useCreateIndex: true,
    useFindAndModify: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true,
  })
  .then(() => {
    console.log("DB connected successfully");
  });

  /////////////////////////////////


//////////////////////////////////////////////

// multer start here

let dataFileName = "";
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `files/${file.originalname}`);
    dataFileName = file.originalname;
    console.log(dataFileName);
  },
});

// Multer Filter
const multerFilter = (req, file, cb) => {
  if (file.mimetype.split("/")[1] === "pdf") {
    cb(null, true);
  } else {
    cb(new Error("Not a PDF File!!"), false);
  }
};

//Calling the "multer" Function
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});


app.post("/send", upload.single("myFile"), (req, res) => {
  // Stuff to be added later
  // console.log(req.file)
  try {
      const newFile = File.create({
      name: req.file.filename,
      });
      res.status(200).json({
      status: "success",
      message: "File created successfully!!",
      });
  } catch (error) {
      res.json({
      error,
      });
  }
  console.log(req.file.filename);


  ////////////////////////////////////////////////////////



  var obj = [];
  async function mailer() {
    let result = await fetch('http://localhost:5000/user/').then((res) => res.json());   
    // let data = await result;

    let data = JSON.stringify(result);
    let useData = JSON.parse(data);

    for (let i in useData) {
      obj.push(useData[i].email)
    }
    console.log(obj.toString());
    // if (!err) {

    // }
    res.redirect('/confirmation');

  }
  mailer();

    // let maillist = [
    //     'xyz@gmail.com',
    //     'abc@gmail.com',
    //     'abcagain@gmail.com'
    // ];

    // maillist.toString();

    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,   /* true for security against third party modules */ 
        auth: {
          user: req.body.from, 
          pass: req.body.password, 
        },
      });
    
      transporter.sendMail({
        from: req.body.from, 
        to: 'example@gmail.com', 
        subject: "Hello ✔", 
        text: req.body.Body, 
        html: req.body.Body,
        attachments: [
          {
            filename: 'dataFileName', path: './public/file/dataFileName'
          }
        ]
      }, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          console.log('email sent', result.response)
        }
      });
  

      ///////////////////////////////////////////////////////////////

});


app.get("/send", async (req, res) => {
  try {
    const files = await File.find();
    res.status(200).json({
      status: "success",
      files,
    });
  } catch (error) {
    res.json({
      status: "Fail",
      error,
    });
  }
});




////////////////////////////////////////////////








app.post('/send', (req, res) => {

  var obj = [];
  async function mailer() {
    let result = await fetch('http://localhost:5000/user/').then((res) => res.json());   
    // let data = await result;

    let data = JSON.stringify(result);
    let useData = JSON.parse(data);

    for (let i in useData) {
      obj.push(useData[i].email)
    }
    console.log(obj.toString());
    // if (!err) {

    // }
    res.redirect('/confirmation');

  }
  mailer();

    // let maillist = [
    //     'xyz@gmail.com',
    //     'abc@gmail.com',
    //     'abcagain@gmail.com'
    // ];

    // maillist.toString();

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
        to: "rushikadivar2701@gmail.com", 
        subject: "Hello ✔", 
        text: req.body.Body, 
        html: req.body.Body,
        attachments: [
          {
            filename: 'dataFileName', path: './public/file/dataFileName'
          }
        ]
      }, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          console.log('email sent', result.response)
        }
      });
  
});




////////////////////////////////////////////////




app.listen(3000, () => {
    console.log('Server is listening at 3000');
})