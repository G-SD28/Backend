import { Schema, model } from "mongoose";

const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  createdAt: { type: Date, default: Date.now },
});

export default model("User", userSchema);
