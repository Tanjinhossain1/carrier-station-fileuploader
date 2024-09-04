const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const app = express();
const port = 9000;
const path = require("path");
const fs = require("fs");
const mime = require("mime-types");

app.use(cors());
app.use(express.json());
app.use(fileUpload());
const directoryName =  "local" // "production"
app.post("/upload", async (req, res) => {
    console.log(
        'hit in get req'
    )
  try {
    const file = req.files.file;
    const folderPath = await path.join(
      __dirname,
      `./media/${directoryName}`
    );
    const uniqRandomNumber = await Math.floor(Math.random() * 10000000000);
    const currentDate = await Date.now();
    const currentFileName = await file?.name
      ?.replaceAll(" ", "-")
      .replaceAll("?", "-")
      .replaceAll("&", "-");
    const newFileName =
      await `${uniqRandomNumber}-${currentDate}-${currentFileName}`;
    const filePath = await path.join(folderPath, newFileName);
    await file?.mv(filePath);
    res.json({
      success: 1,
      file: { url: `${newFileName}` },
    });
    // res.json({ fileName: newFileName, status: 'success' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/upload/multiple", async (req, res) => {
  try {
    let files = req.files.files; // Note: req.files.files will be an array when multiple files are uploaded.
   if (!Array.isArray(files)) {
      files = [files];
    }
    const folderPath = await path.join(__dirname, `./media/${directoryName}`);
    const uploadedFiles = [];

    for (let file of files) {
      const uniqRandomNumber = await Math.floor(Math.random() * 10000000000);
      const currentDate = await Date.now();
      const currentFileName = await file?.name
        ?.replaceAll(" ", "-")
        .replaceAll("?", "-")
        .replaceAll("&", "-");
      const newFileName = await `${uniqRandomNumber}-${currentDate}-${currentFileName}`;
      const filePath = await path.join(folderPath, newFileName);

      await file?.mv(filePath);
      uploadedFiles.push({ url: newFileName });
    }

    res.json({
      success: 1,
      files: uploadedFiles,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


app.get("/get/:name", async (req, res) => {
    console.log(
        'hit in get req'
    )
  try {
    const { name } = await req.params;
    const rootDir = await path.join(
      __dirname,
      `./media/${directoryName}`
    );
    const filePath = await path.join(rootDir, name);
    if (await !fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found" });
    }
    const mimeType = mime.lookup(filePath);
    res.setHeader("Content-Type", mimeType);
    const stream = await fs.createReadStream(filePath);
    await stream.pipe(res);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});
app.delete("/delete/:name", async (req, res) => {
    console.log(
        'hit in delete req'
    )
  try {
    const { name } = await req.params;
    const rootDir = await path.join(
      __dirname,
      `./media/${directoryName}`
    );
    const filePath = await path.join(rootDir, name);
    if (await !fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found" });
    }

    await fs.unlinkSync(filePath);
    res.json({ message: "File deleted successfully" });
    
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});


app.get("/", async (req, res) => {
    
    res.json({ message:  "Your Apis is Working.",status:200 });
  
});
  
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
