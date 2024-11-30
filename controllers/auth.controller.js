import crypto from "crypto";
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateVerificationToken } from "../utils/generateVerificationToken.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import dotenv from "dotenv";
import { sendVerificationEmail, sendWelcomeEmail, sendResetPasswordEmail, sendResetSuccessEmail } from "../mailtrap/emails.js";

dotenv.config();

export const home = async (req, res) => {

    res.send("Home route");
}

export const signup = async (req, res) => {

    const { email, password, name } = req.body;

    try {

        if (!email || !password || !name) {
            throw new Error("All fields are required");
        }

        const userAlreadyExists = await User.findOne({ email });

        if (userAlreadyExists) {
            throw new Error("User already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const verificationToken = generateVerificationToken();

        const user = User({
            email,
            password: hashedPassword,
            name,
            verificationToken,
            verificationTokenExpireAt: Date.now() + (60 * 60 * 1000), //24h
        });

        await user.save();

        // jwt
        generateTokenAndSetCookie(res, user._id);

        await sendVerificationEmail(user.email, verificationToken);

        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                ...user._doc,
                password: undefined
            }
        });

    } catch (error) {
        console.log("Error: ", error);
        res.status(400).json({ success: false, message: error.message });

    }
}

export const verifyEmail = async (req, res) => {

    const { code } = req.body;

    try {

        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpireAt: {
                $gt: Date.now()
            }
        });

        if (!user) {

            return res.status(400).json({ success: false, message: "Invalid verification code" });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpireAt = undefined;

        await user.save(); //save to db

        await sendWelcomeEmail(user.email, user.name);

        res.status(200).json({
            success: true,
            message: "Welcome email verified successfully",
            user: {
                ...user._doc,
                password: undefined
            }
        });

    } catch (error) {
        console.log("Error in verifying email: ", error);
        res.status(500).json({ success: false, message: error.message });

    }
}

export const login = async (req, res) => {

    const { email, password } = req.body;

    try {

        const user = await User.findOne({ email });

        if (!user) {

            return res.status(404).json({ success: false, message: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {

            return res.status(400).json({ success: false, message: "Invalid password" });
        }

        generateTokenAndSetCookie(res, user._id);

        user.lastLogin = new Date();

        await user.save();

        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            user: {
                ...user._doc,
                password: undefined
            }
        });

    } catch (error) {
        console.log("Error in login: ", error);
        res.status(400).json({ success: false, message: error.message });
    }
}

export const logout = async (req, res) => {

    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Logged out successfully" });
}

export const forgotPassword = async (req, res) => {

    const { email } = req.body;

    try {

        const user = await User.findOne({ email });

        if (!user) {

            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Generate password reset token
        const resetPasswordToken = crypto.randomBytes(20).toString("hex");

        const resetPasswordExpireAt = Date.now() + (1 * 60 * 60 * 1000); //1h

        user.resetPasswordToken = resetPasswordToken;
        user.resetPasswordExpireAt = resetPasswordExpireAt;

        await user.save();

        //send email
        await sendResetPasswordEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetPasswordToken}`);

        res.status(200).json({
            success: true,
            message: "Password reset link sent to your email",
        });

    } catch (error) {
        console.log("Error in forgot password: ", error);
        res.status(400).json({ success: false, message: error.message });

    }
}

export const resetPassword = async (req, res) => {

    try {

        const { token } = req.params;
        const { password } = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpireAt: {
                $gt: Date.now()
            }
        });

        if (!user) {

            return res.status(400).json({ success: false, message: "Invalid or expired token" });
        }

        //update password
        const hashedPassword = await bcrypt.hash(password, 10);

        user.password = hashedPassword;

        user.resetPasswordToken = undefined;
        user.resetPasswordExpireAt = undefined;

        await user.save();

        await sendResetSuccessEmail(user.email);

        res.status(200).json({
            success: true,
            message: "Password reset successfully",
        });

    } catch (error) {
        console.log("Error in reset password: ", error);
        res.status(400).json({ success: false, message: error.message });

    }
}

export const checkAuth = async (req, res) => {

    try {

        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({
            success: true,
            message: "User found",
            user: {
                ...user._doc,
                password: undefined
            }
        });

    } catch (error) {

        console.log("Error in check auth: ", error);
        res.status(400).json({ success: false, message: error.message });


    }
}