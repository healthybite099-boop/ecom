import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
    {
        name: { type: String, required: true },
        phone: { type: Number, required: true },
        email: { type: String, required: true },
        password: { type: String, required: true },
        plainpassword: { type: String, required: true },
        usertype: { type: String, enum: ["1", "2"], default: "1", required: true },
        defaultdata:{type:String,required:true,default:"User"}

    },
    { timestamps: true }
);

const UserModel =
    mongoose.models.Usertest || mongoose.model("Usertest", UserSchema);

export default UserModel;