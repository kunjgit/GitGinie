import mongoose, { Schema } from "mongoose";
const userSchema = new mongoose.Schema({
    login : {
        type : Schema.Types.String,
        required : true
    },
    email : {
        type : Schema.Types.String
    },
    name : {
        type : Schema.Types.String
    },
    avatar_url : {
        type : Schema.Types.String
    },
});

const UserModel  = mongoose.models.user || mongoose.model("user",userSchema);
export default UserModel;