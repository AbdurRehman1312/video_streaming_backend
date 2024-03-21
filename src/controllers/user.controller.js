import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const registerUser = asyncHandler(async (req, res) => {
  // GET USER DETAILS FROM FRONTEND

  const { fullName, username, email, password } = req.body;
  console.log(
    `Fullname is : ${fullName} \n Username is : ${username} \n Email is : ${email} \n Password is : ${password}  `
  );
  // VALIDATION - NOT EMPTY

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // CHECK IF USER ALREADY EXISTS OR NOT: USERNAME, EMAIL

  const existedUser = User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email and username already exists");
  }

  // CHECK FOR IMAGES
  // CHECK FOR AVATAR
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is mandatory");
  }

  // UPLOAD THAT IMAGES TO CLOUDINARY, AVATAR
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  // CREATE USER OBJECT - CREATE ENTRY IN DB
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  // REMOVE PASSWORD & REFRESH TOKEN FIELD FROM RESPONSE
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // CHECK FOR USER CREATION
  if (!createdUser) {
    throw new ApiError(
      500,
      "Something Went Wrong during resgisteration of user"
    );
  }

  // RETURN RESPONSE
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Registered Successfully"));
});

export { registerUser };
