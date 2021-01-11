const express = require("express")
const fileupload = require('express-fileupload');
const fs = require("fs")
const {spawn} = require('child_process')
const csvToJson = require('convert-csv-to-json');

const app = express()
const base = __dirname+'/uploads/'

const deleteFile = (name)=>{
    let file = base+name
    if(fs.existsSync(file))
        fs.unlinkSync(file)
}

const convert = (inp, out)=>{
    csvToJson.generateJsonFileFromCsv(inp, out)
}

app.use(fileupload())

app.listen(5000, ()=>{
    console.log("Server running on port 5000")
})

app.use(express.static(__dirname+"/public/"))
app.get("/",(req,res)=>{
    deleteFile("temp.json")
    console.log("hi")
    res.sendFile('./index.html',{root: __dirname})
})

app.post("/",(req, res)=>{
    
    deleteFile("temp.csv")
    deleteFile("temp.json")
    
    if(!req.files || Object.keys(req.files).length === 0){
        res.status(400).json({"error":'No files uploaded'})
        return;
    }

    uploadedFile = req.files.myfile;
    filename = base+uploadedFile.name
    uploadedFile.mv(filename, (err)=>{
        if(err)
            return res.status(500).json({"error":err})
        fs.renameSync(filename, base+'temp.csv',(err)=>{
            if(err)res.status(400).json({"msg":"Failed to save file"})
        })
        res.json({"msg":"File Uploaded"})
    })
    // spawn('python', ['script.py'])
   // convert((base+'temp.csv', base+'temp.json'))
    console.log("hi")
})

app.get("/download", (req, res)=>{
    let file = base+"temp.json"
    if(!fs.existsSync(file))
       return res.status(400).json({"msg":"File Not Present"})
    res.send("Ok")
})

app.get("/getfile",(req, res)=>{
    res.download(base+"temp.json")
})
