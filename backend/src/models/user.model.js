import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profilePic: {
      type: String,
      default: "https://res.cloudinary.com/dqgvjqjqj/image/upload/v1/chat-app-profiles/default-profile.png",
    },
    cloudinaryId: {
      type: String,
      default: null,
    },
    relationships: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      relationship: {
        type: String,
        enum: ['professional', 'friend', 'family', 'other'],
        required: true
      },
      profession: {
        type: String,
        default: ''
      }
    }]
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
