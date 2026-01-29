import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
    {
        name: { type: String, required: true },
        // Ensure phone is unique and indexed
        phone: { type: String, required: true, unique: true }, 
        email: { type: String, required: true },
        password: { type: String, required: true },
        usertype: { type: String, enum: ["1", "2"], default: "1", required: true },
        defaultdata: { type: String, required: true, default: "User" }
    },
    { timestamps: true }
);

const UserModel = mongoose.models.Usertest22 || mongoose.model("Usertest22", UserSchema);
export default UserModel;