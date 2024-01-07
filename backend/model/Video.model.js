import mongoose from "mongoose";

export const videoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    fileUrl: { type: String, required: true, unique: true },
    description: { type: String },
    username: { type: String, required: true },
});

export default mongoose.models.Video || mongoose.model('Video', videoSchema);

