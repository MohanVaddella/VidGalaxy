import express from 'express';
import multer from "multer";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import ENV from './config.js';
import cors from 'cors';
import morgan from 'morgan';
import connect from './database/conn.js';
import router from './router/route.js';
import bodyParser from 'body-parser';
dotenv.config();

const app = express();
const port = 8080;

/** middlewares */
app.use(express.json());
app.use(cors({ "origin": "*"}));
app.use(morgan('tiny'));
app.disable('x-powered-by');  //less hackers know about our stack
app.use(bodyParser.urlencoded({ extended : true }));
app.use(bodyParser.json());


// Create an S3 client
const s3Client = new S3Client({
    region: ENV.AWS_REGION,
    credentials: {
      accessKeyId: ENV.S3_ACCESS_KEY,
      secretAccessKey: ENV.S3_SECRET_KEY,
    },
  });

  const storage = multer.memoryStorage();
  const upload = multer({
    storage,
    limits: {
      fileSize: 25 * 1024 * 1024, // 25MB in bytes
    },
  });

  app.post("/upload", upload.single("file"), async (req, res) => {
    try {
      const file = req.file;
      const { username } = req.query;
  
      const contentType = file.mimetype;
  
      const params = {
        Bucket: ENV.S3_BUCKET_NAME,
        Key: `${username}/${file.originalname}`,
        Body: file.buffer,
        ContentType: contentType,
      };
  
      const response = await s3Client.send(new PutObjectCommand(params));
      console.log("File uploaded to S3:", response);
  
      const fileUrl = `https://${ENV.S3_BUCKET_NAME}.s3.amazonaws.com/${username}/${file.originalname}`;
  
      res.status(200).json({ fileUrl });
    } catch (error) {
      console.error("Failed to upload file to S3:", error);
      res.status(500).json({ error: "Failed to upload file to S3" });
    }
  });
  

/** HTTP GET Request */
app.get('/', (req, res) => {
    res.status(201).json("Home GET Request");
});


/** api routes */
app.use('/api', router)

/** start server only when we have valid connection */
connect().then(() => {
    try {
        app.listen(port, () => {
            console.log(`Server connected to http://localhost:${port}`);
        });
    } catch (error) {
        console.log('Cannot connect to the server');
    }
}).catch(error => {
    console.log("Invalid database connection...!");
})

