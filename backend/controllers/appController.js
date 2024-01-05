import UserModel from '../model/User.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import ENV from '../config.js';
import otpGenerator from 'otp-generator';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import multer from "multer";
import dotenv from "dotenv";
dotenv.config();


/** middleware for verify user */
export async function verifyUser(req, res, next){
    try {
        const { username } = req.method == "GET" ? req.query : req.body;
        
        // check the user existence
        let exist = await UserModel.findOne({ username });
        if(!exist) return res.status(404).send({ error : "Can't find User!"});
        next();
    } catch (error) {
        return res.status(404).send({ error: "Authentication Error"});
    }
}


/** POST: http://localhost:8080/api/register 
 * @param : {
    "username" : "John123",
    "password" : "John@123",
    "email": "example@gmail.com",
    "firstName" : "bill",
    "lastName": "william"
}
*/

export async function register(req, res){
    try {
        const { firstName, lastName, email, username, password } = req.body;
        // check the existing username
    const existUsername = await UserModel.findOne({ username });
    if (existUsername) {
      return res.status(400).send({ error: "Username exists" });
    }

    // check for existing email
    const existEmail = await UserModel.findOne({ email });
    if (existEmail) {
      return res.status(400).send({ error: "Email exists" });
    }

        // Hash the password and save the user
    if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
  
        const user = new UserModel({
          username,
          password: hashedPassword,
          email,
          firstName,
          lastName,
        });
        
  
        // Save the user to the database
        const result = await user.save();
        return res.status(201).send({ msg: "User registered successfully" });
      }
    } catch (error) {
      return res.status(500).send({ error: "Internal Server Error" });
    }
  }

/** POST: http://localhost:8080/api/login 
 * @param: {
    "username" : "John123",
    "password" : "John@123"
}
*/
export async function login(req, res){
    const { username, password } =req.body;
    try {
        UserModel.findOne({ username})
            .then(user => {
                bcrypt.compare(password, user.password)
                    .then(passwordCheck => {
                        if(!passwordCheck) return res.status(400).send({ error: "Incorrect password. Please try again."});

                        // create jwt token
                        const token = jwt.sign({
                            userId: user._id,
                            username: user.username
                        }, ENV.JWT_SECRET , { expiresIn : "24h"});

                        return res.status(201).send({
                            msg: "Login Successful...!",
                            username: user.username,
                            token
                        });

                    })
                    .catch(error => {
                        return res.status(400).send({ error})
                    })
            })
            .catch( error => {
                return res.status(404).send({ error});
            })
    } catch (error) {
        return res.status(500).send({error});
    }
}

/** GET: http://localhost:8080/api/user/John123 */
export async function getUser(req, res){
    const { username } = req.params;
    try {
        if(!username) return res.status(501).send({ error : "Invalid Username"});
        UserModel.findOne({ username }, function(err, user){
            if(err) return res.status(500).send({ err });
            if(!user) return res.status(501).send({ error : "Couldn't Find the User"});
            /** remove password from user */
            // mongoose return unnecessary data with object so convert it into json
            const { password, ...rest } = Object.assign({}, user.toJSON());

            return res.status(201).send(user);
        })
    } catch (error) {
        return res.status(404).send({ error : "Cannot Find User Data"});
    }
}

/** PUT: http://localhost:8080/api/updateuser 
 * @param: {
    "id" : "<userid>"
}
body: {
    firstName: '',
    lastname : '',
    profile : ''
}
*/
export async function updateUser(req, res){
    try {
        // const id = req.query.id;
        const { userId } = req.user;
        if(id){
            const body = req.body;

            // update the data
            UserModel.updateOne({ _id : userId}, body , function(err, data){
                if(err) throw err;
                return res.status(201).send({ msg : "Record Updated...!"});
            })
        }else{
            return res.status(401).send({ error : "User Not Found...!"});
        }

    } catch (error) {
        return res.status(401).send({ error });
    }
}

/** GET: http://localhost:8080/api/generateOTP */
export async function generateOTP(req, res){
    req.app.locals.OTP = await otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false});
    res.status(201).send({ code: req.app.locals.OTP })
}

/** GET: http://localhost:8080/api/verifyOTP */
export async function verifyOTP(req, res){
    const { code } = req.query;
    if(parseInt(req.app.locals.OTP) === parseInt(code)){
        req.app.locals.OTP = null; // reset the OTP value
        req.app.locals.resetSession = true; // start the session for reset password
        return res.status(201).send({ msg: 'Verify Successfully!'})
    }
    return res.status(400).send({ error: "Invalid OTP"});
}


// successfully redirect user when OTP is valid
/** GET: http://localhost:8080/api/createResetSession */
export async function createResetSession(req, res){
    if(req.app.locals.resetSession){
        return res.status(201).send({flag : req.app.locals.resetSession})
    }
    return res.status(440).send({ error : "Session expired"})
}

// update the password when we have valid session
/** PUT: http://localhost:8080/api/resetPassword */
export async function resetPassword(req, res){
    try {
        if(!req.app.locals.resetSession) return res.status(440).send({ error : "Session expired"});
        const { username, password } = req.body;
        try {
            UserModel.findOne({ username })
                .then(user => {
                    bcrypt.hash(password, 10)
                        .then(hashedPassword => {
                            UserModel.updateOne({ username : user.username},
                            { password : hashedPassword }, function(err, data){
                                if(err) throw err;
                                req.app.locals.resetSession = false;
                                return res.status(201).send({ msg : "Record Updated...!"})
                            })
                        })
                        .catch( e => {
                            return res.status(500).send({
                                error : "Enable to hashed password"
                            })
                        })
                })
                .catch(error => {
                    return res.status(404).send({ error : "Username not Found"});
                })
        } catch (error) {
            return res.status(500).send({ error })
        }
    } catch (error) {
        return res.status(401).send({ error })
    }
    
}


// Create an S3 client
const s3Client = new S3Client({
    region: ENV.AWS_REGION,
    credentials: {
        accessKeyId: ENV.S3_ACCESS_KEY,
        secretAccessKey: ENV.S3_SECRET_KEY,
    },
});

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: {
    fileSize: 25 * 1024 * 1024, // 25MB in bytes
    },
});

/** POST: http://localhost:8080/api/upload */
export const uploadVideo = async (req, res) => {
    try {
        const file = req.file;
        const { username } = req.query;

        const contentType = file.mimetype;

        console.log("Username:", username);
        console.log("Original Name:", file.originalname);
        console.log("Content Type:", contentType);

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
};





