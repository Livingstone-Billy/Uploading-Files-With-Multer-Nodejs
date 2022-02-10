const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose")
const multer = require("multer");
const File = require("./model/schema");

const app = express();

app.use(express.static(__dirname));

app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', (req, res) =>{

    res.redirect(encodeURIComponent("/public/index.html"));
})

const url = "mongodb://localhost:27017/multerdb";

mongoose.connect(url, {
    useNewUrlParser:true,
    useUnifiedTopology:true,
    autoIndex:true,
}).then(()=>console.log("Database Connected!"))

const port = 4000;

app.listen(port, ()=>console.log(`Server is listening at port ${port}`));

const multerStorage = multer.diskStorage({
    destination: (req,file,cb) =>{
        cb(null, "public");
    },
    filename: (req,file,cb) =>{
        const ext = file.mimetype.split("/")[1];
        cb(null, `billy-${file.originalname}-${Date.now()}. ${ext}`);
    }
});

const muletrFilter = (req,file,cb) =>{
    if(file.mimetype.split("/")[1] === "pdf"){
        cb(null, true);
    }else{
        cb(new Error("Not A Pdf File"), false);
    }
};

const upload = multer({
    storage:multerStorage,
    fileFilter:muletrFilter,
});

app.post("/file", upload.single("filename"),async(req,res) =>{
    console.log(req.file);
    try{
        const newFile = await File.create({
            name: req.file.filename,
        });
        res.status(200).json({
            status: "success",
            message:"File created successfully",
        });
    }catch(error){
        res.json({ 
            error,
        })
    }
})