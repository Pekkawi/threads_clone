import mongoose from "mongoose";
import { boolean } from "zod";

const userSchema = new mongoose.Schema({
  id: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  image: String,
  bio: String,
  threads: [{ type: mongoose.Schema.Types.ObjectId, ref: "Thread" }], // a user can have multiple ref to a Thread model
  onboarded: {
    type: Boolean,
    default: false,
  },
  communities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Community" }],
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
//first time it will create a mongoose model called User and the second time it will call the user model

export default User;
