import mongoose from "mongoose";

export const videoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    objectURL: { type: String, required: true },
    description: { type: String },
    username: { type: String, required: true },
});

export default mongoose.models.Video || mongoose.model('Video', videoSchema);

