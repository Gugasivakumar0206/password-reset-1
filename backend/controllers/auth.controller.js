import bcryptjs from "bcryptjs";
import crypto from "crypto";

import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import {
	sendPasswordResetEmail,
	sendResetSuccessEmail,
	sendVerificationEmail,
	sendWelcomeEmail,
} from "../mailtrap/emails.js";
import { User } from "../models/user.model.js";

export const signup = async (req, res) => {
	console.log("📥 Signup request body:", req.body); // DEBUG

	const { email, password, name } = req.body;

	try {
		if (!email || !password || !name) {
			console.log("❌ Signup missing fields");
			throw new Error("All fields are required");
		}

		const userAlreadyExists = await User.findOne({ email });
		console.log("userAlreadyExists:", userAlreadyExists);

		if (userAlreadyExists) {
			return res.status(400).json({ success: false, message: "User already exists" });
		}

		const hashedPassword = await bcryptjs.hash(password, 10);
		const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

		const user = new User({
			email,
			password: hashedPassword,
			name,
			verificationToken,
			verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
		});

		await user.save();
		console.log("✅ New user created:", user.email);

		// jwt
		generateTokenAndSetCookie(res, user._id);

		await sendVerificationEmail(user.email, verificationToken);

		res.status(201).json({
			success: true,
			message: "User created successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		});
	} catch (error) {
		console.error("🔥 Signup error:", error.message);
		res.status(400).json({ success: false, message: error.message });
	}
};

export const verifyEmail = async (req, res) => {
	console.log("📥 VerifyEmail request body:", req.body);

	const { code } = req.body;
	try {
		const user = await User.findOne({
			verificationToken: code,
			verificationTokenExpiresAt: { $gt: Date.now() },
		});

		if (!user) {
			console.log("❌ Invalid verification code:", code);
			return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
		}

		user.isVerified = true;
		user.verificationToken = undefined;
		user.verificationTokenExpiresAt = undefined;
		await user.save();

		await sendWelcomeEmail(user.email, user.name);

		console.log("✅ Email verified:", user.email);
		res.status(200).json({
			success: true,
			message: "Email verified successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		});
	} catch (error) {
		console.error("🔥 VerifyEmail error:", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

export const login = async (req, res) => {
	console.log("📥 Login request body:", req.body);

	const { email, password } = req.body;
	try {
		if (!email || !password) {
			console.log("❌ Login missing fields");
			return res.status(400).json({ success: false, message: "Email and password required" });
		}

		const user = await User.findOne({ email });
		if (!user) {
			console.log("❌ User not found:", email);
			return res.status(400).json({ success: false, message: "Invalid credentials" });
		}

		const isPasswordValid = await bcryptjs.compare(password, user.password);
		if (!isPasswordValid) {
			console.log("❌ Wrong password for:", email);
			return res.status(400).json({ success: false, message: "Invalid credentials" });
		}

		generateTokenAndSetCookie(res, user._id);

		user.lastLogin = new Date();
		await user.save();

		console.log("✅ Login success:", email);
		res.status(200).json({
			success: true,
			message: "Logged in successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		});
	} catch (error) {
		console.error("🔥 Login error:", error.message);
		res.status(400).json({ success: false, message: error.message });
	}
};

export const logout = async (req, res) => {
	console.log("👋 Logout request");
	res.clearCookie("token");
	res.status(200).json({ success: true, message: "Logged out successfully" });
};

export const forgotPassword = async (req, res) => {
	console.log("📥 ForgotPassword request body:", req.body);

	const { email } = req.body;
	try {
		if (!email) {
			console.log("❌ ForgotPassword missing email");
			return res.status(400).json({ success: false, message: "Email is required" });
		}

		const user = await User.findOne({ email });
		if (!user) {
			console.log("❌ ForgotPassword user not found:", email);
			return res.status(400).json({ success: false, message: "User not found" });
		}

		// Generate reset token
		const resetToken = crypto.randomBytes(20).toString("hex");
		const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000;

		user.resetPasswordToken = resetToken;
		user.resetPasswordExpiresAt = resetTokenExpiresAt;
		await user.save();

		await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

		console.log("📧 Reset email sent to:", email);
		res.status(200).json({ success: true, message: "Password reset link sent to your email" });
	} catch (error) {
		console.error("🔥 ForgotPassword error:", error.message);
		res.status(400).json({ success: false, message: error.message });
	}
};

export const resetPassword = async (req, res) => {
	console.log("📥 ResetPassword request:", { params: req.params, body: req.body });

	try {
		const { token } = req.params;
		const { password } = req.body;

		const user = await User.findOne({
			resetPasswordToken: token,
			resetPasswordExpiresAt: { $gt: Date.now() },
		});

		if (!user) {
			console.log("❌ Invalid reset token:", token);
			return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
		}

		const hashedPassword = await bcryptjs.hash(password, 10);

		user.password = hashedPassword;
		user.resetPasswordToken = undefined;
		user.resetPasswordExpiresAt = undefined;
		await user.save();

		await sendResetSuccessEmail(user.email);

		console.log("✅ Password reset successful for:", user.email);
		res.status(200).json({ success: true, message: "Password reset successful" });
	} catch (error) {
		console.error("🔥 ResetPassword error:", error.message);
		res.status(400).json({ success: false, message: error.message });
	}
};

export const checkAuth = async (req, res) => {
	console.log("🔍 checkAuth userId:", req.userId);

	try {
		const user = await User.findById(req.userId).select("-password");
		if (!user) {
			console.log("❌ checkAuth user not found");
			return res.status(400).json({ success: false, message: "User not found" });
		}

		console.log("✅ checkAuth success for:", user.email);
		res.status(200).json({ success: true, user });
	} catch (error) {
		console.error("🔥 checkAuth error:", error.message);
		res.status(400).json({ success: false, message: error.message });
	}
};
