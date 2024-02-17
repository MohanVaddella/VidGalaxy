import axios from 'axios';
import { jwtDecode } from "jwt-decode";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

/** Make API Requests */


/** to get username from Token */
export async function getUsername(){
    const token = localStorage.getItem('token')
    if(!token) return Promise.reject("Cannot find Token");
    let decode = jwtDecode(token)
    return decode;
}

/** authenticate function */
export async function authenticate(username){
    try {
        return await axios.post('/api/authenticate', { username })
    } catch (error) {
        return { error : "Username doesn,t exist...!"}
    }
}

/** get user details */
export async function getUser({ username }){
    try {
        const { data } = await axios.get(`/api/user/${username}`)
        return { data };
    } catch (error) {
        return { error : "Password doesn't Match...!"}
    }
}

/** register user function  */
export async function registerUser(values){
    try {
        const { data : { msg }, status } = await axios.post('/api/register', values);
        
        let { username, email } = values;

        /** send email */
        if(status === 201){
            await axios.post('/api/registerMail', { username, userEmail : email, text : msg})

        }

        return Promise.resolve(msg)
    } catch (error) {
        return Promise.reject({ error })
    }
}

/** login function */
export async function verifyPassword({ username, password}){
    try {
        if(username){
            const { data } = await axios.post('/api/login', { username, password })
            return Promise.resolve({ data, success: true });
        }
    } catch (error) {
        // Handle the error here
        return Promise.resolve({ error, success: false });
    }
}

/** update user function */
export async function updateUser(response){
    try {
        const token = await localStorage.getItem('token');
        const data = await axios.put('/api/updateUser', response, { headers : {"Authorization" : `Bearer ${token}`}})

        return Promise.resolve({ data })
    } catch(error) {
        return Promise.reject({ error : "Couldn't Update Profile...!"})
    }
}

/** generate OTP */
export async function generateOTP(username) {
    try {
        if (username.length >= 8 && username.length <= 12) { // Check if username length is valid
            const { data: { code }, status } = await axios.get('/api/generateOTP', { params: { username } });

            // send mail with the OTP
            if (status === 201) {
                let { data: { email } } = await getUser({ username });
                let text = `Your Password Recovery OTP is ${code}. Verify and recover your password.`;
                await axios.post('/api/registerMail', { username, userEmail: email, text, subject: "Password Recovery OTP" })
            }
            return Promise.resolve(code);
        } else {
            throw new Error("Username length is invalid");
        }
    } catch (error) {
        return Promise.reject({ error });
    }
}

/** verify OTP */
export async function verifyOTP({ username, code }){
    try {
        const { data, status } = await axios.get('/api/verifyOTP', { params : { username, code }})
        return { data, status }
    } catch(error) {
        return Promise.reject(error);
    }
}

/** reset password */
export async function resetPassword({ username, password }){
    try {
        const { data, status } = await axios.put('/api/resetPassword', { username, password });
        return Promise.resolve({ data, status})
    } catch (error) {
        return Promise.reject({ error })
    }
}


/** video upload */


// Update the helper function to handle S3 upload
export async function uploadFile(values) {
    try {
        const formData = new FormData();
        formData.append("file", values.videoFile);
        formData.append("username", values.username);
        formData.append("title", values.title);  // Add this line

        /* console.log("FormData content:", formData);  */
        const { data, status } = await axios.post("/api/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
        });

        return Promise.resolve({ data, status });
    } catch (error) {
      // Handle the error here
        return Promise.reject({ error });
    }
}


export async function getVideos(username) {
    try {
        const response = await axios.get("/api/videos", { params: { username } }); // Adjust the endpoint as needed
        /* console.log("Response from /api/videos:", response.data); */
        if (response.status === 200) {
            return Promise.resolve(response.data);
        } else if (response.status === 304) {
        // No content, return an empty array
            return Promise.resolve([]);
        } else {
        // Other error status codes
        return Promise.reject(response.statusText);
        }
    } catch (error) {
    console.error("Error fetching videos:", error);
        return Promise.reject(error);
    }
}

export async function deleteVideo(username, videoId) {
    try {
        console.log(videoId);
        const response = await axios.delete(`/api/videos/${username}/${videoId}`);
        if (response.status === 200) {
            return Promise.resolve({ message: "Video deleted successfully" });
        } else {
            return Promise.reject(response.data.error || "Failed to delete video");
        }
    } catch (error) {
        console.error("Error deleting video:", error);
        return Promise.reject("Failed to delete video");
    }
}


export async function getAnalytics(username) {
    try {
        const response = await axios.get("/api/analytics", { params: { username } });
        return response.data;
    } catch (error) {
        console.error("Error fetching analytics:", error);
        throw error;
    }
};
