import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";

export const createUser = async (req, res) => {
    try {
        const { userName, password } = req.body;
        const user = new User(req.body);

        const existingUser = await User.findOne({ userName });
        if (existingUser) {
            return res.status(400).json({ message: "User Already Exists" });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        user.password = hashedPassword;

        await user.save();
        res.status(201).json({
            status: "success",
            message: "User created successfully",
        });
    } catch (error) {
        res.status(400).send(error);
    }
};

export const signIn = async (req, res) => {
    try {
        const { userName, password } = req.body;

        if (!userName || !password) {
            return res
                .status(400)
                .json({ message: "Please provide username and password" });
        }

        const user = await User.findOne({ userName });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: "1d",
        });

        res.status(200).json({
            status: "success",
            message: "User logged in successfully",
            token,
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: "An error occurred while trying to login",
        });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, { password: 0 });
        return res.status(200).json({ users });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Error fetching users" });
    }
};

export const updatePassword = async (req, res) => {
    try {
        const { userName, oldPassword, newPassword } = req.body;

        if (!userName || !oldPassword || !newPassword) {
            return res
                .status(400)
                .json({
                    message: "Please provide username, old password, and new password.",
                });
        }

        const user = await User.findOne({ userName });
        if (!user) {
            return res.status(403).json({ message: "Authentication failed." });
        }

        const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordCorrect) {
            return res.status(403).json({ message: "Authentication failed." });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        user.password = hashedPassword;

        await user.save();
        res
            .status(200)
            .json({ status: "success", message: "Password updated successfully." });
    } catch (error) {
        res
            .status(500)
            .json({
                status: "error",
                message: "An error occurred while trying to update password.",
            });
    }
};

export const updateUsername = async (req, res) => {
    try {
        const { currentUserName, newUserName, password } = req.body;

        if (!currentUserName || !newUserName || !password) {
            return res.status(400).json({ message: "Please provide current username, new username, and password" });
        }

        const user = await
            User.findOne({ userName: currentUserName });
        if (!user) {
            return res.status(403).json({ message: "Authentication failed." });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(403).json({ message: "Authentication failed." });
        }

        const existingUser = await User.findOne({ userName: newUserName });
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists." });
        }

        user.userName = newUserName;

        await user.save();
        res.status(200).json({ status: "success", message: "Username updated successfully" });
    } catch (error) {
        res.status(500).json({ status: "error", message: "An error occurred while trying to update username" });
    }
};

export const updateEmail = async (req, res) => {
    try {
        const { currentEmail, newEmail, userName, password } = req.body;

        if (!currentEmail || !newEmail || !userName || !password) {
            return res.status(400).json({ message: "Please provide current email, new email, username, and password" });
        }

        const user = await User.findOne({ userName });
        if (!user || user.email !== currentEmail) {
            return res.status(403).json({ message: "Authentication failed." });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(403).json({ message: "Authentication failed." });
        }

        const checkNewEmail = await User.findOne({ email: newEmail });
        if (checkNewEmail) {
            return res.status(400).json({ message: "Email already exists." });
        }

        user.email = newEmail;

        await user.save();
        res.status(200).json({ status: "success", message: "Email updated successfully" });
    } catch (error) {
        res.status(500).json({ status: "error", message: "An error occurred while trying to update email" });
    }
};

const sendEmail = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject,
            text,
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

export const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        await user.save();

        const resetUrl = `http://localhost:7000/reset-password/${resetToken}`;
        const message = `You requested a password reset. Please go to this link to reset your password: ${resetUrl}`;

        await sendEmail(user.email, 'Password Reset Request', message);

        res.status(200).json({ message: "Password reset link sent to email" });
    } catch (error) {
        res.status(500).json({ message: "Error requesting password reset", error });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
        res.status(500).json({ message: "Error resetting password", error });
    }
};