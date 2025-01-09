const User = require('../model/db'); 
const express = require('express'); 
const crypto = require('crypto'); // To generate a reset token
const nodemailer = require('nodemailer'); // For sending email
const bcrypt = require('bcrypt');



const signupUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: "User already exists" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        user = new User({ name, email, password: hashedPassword });
        await user.save(); // Save the user to the database
        res.status(201).json({ msg: "User registered successfully" });
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ msg: 'Server error' });
    }
};



const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return res.status(400).json({ msg: "Please provide email and password" });
    }

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: "Invalid email or password" });
        }

        // Compare the provided password with the hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid email or password" });
        }

        // If the password matches, return a success message
        return res.status(200).json({ msg: "Login successful" });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ msg: 'Server error' });
    }
};



const updateUser = async (req, res) => {
    try {
        const { id } = req.params; // Get user ID from the route parameters
        const { name, email } = req.body; // Get new name and email from the request body

        // Find the user and update details
        const updatedUser = await User.findByIdAndUpdate(id, { name, email }, { new: true, runValidators: true });

        if (!updatedUser) {
            return res.status(404).json({ msg: "User not found" });
        }
        res.status(200).json({ msg: "User updated successfully" });
    } catch (error) {
        console.error("Error during user update:", error);
        res.status(500).json({ msg: "Server error" });
    }
}


const forgetPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ msg: "User with this email does not exist" });
        }

        // Generate a reset token (this can be an OTP or token based on your use case)
        const resetToken = crypto.randomBytes(32).toString('hex');

        // Set token expiration (optional, e.g., 1 hour from now)
        const tokenExpiry = Date.now() + 3600000; // 1 hour in milliseconds
        console.log(tokenExpiry)

        // Save the token and its expiration in the user's record (add resetToken and tokenExpiry fields in your model)
        user.resetToken = resetToken;
        user.tokenExpiry = tokenExpiry;
        await user.save();

        // Create transporter with the App Password
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'yashkewat78@gmail.com', 
                pass: 'mdxw pvgx jtjl sfcw',  
            },
        });

        const mailOptions = {
            from: 'yashkewat78@gmail.com', // Replace with your email
            to: user.email,
            subject: 'Password Reset',
            text: `You requested a password token. Here is token: ${resetToken}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({ msg: 'Error sending email' });
            }
            console.log('Email sent: ' + info.response);
            res.status(200).json({ msg: 'we can send token sent to your email in 10 sec',resetToken });
        });
    } catch (error) {
        console.error("Error during password reset:", error);
        res.status(500).json({ msg: "Server error" });
    }
};


const resetPassword = async (req, res) => {
    try {
      const { token, newPassword } = req.body;
  
      // Find the user with the provided reset token
      const user = await User.findOne({ resetToken: token });
  
      // Check if user exists
      if (!user) {
        return res.status(400).json({ msg: "Invalid token." });
      }
  
      // Hash the new password before saving
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      // Update the user's password
      user.password = hashedPassword;
  
      // Clear the reset token (no need to check for expiry anymore)
      user.resetToken = undefined;
      user.tokenExpiry = undefined;
  
      // Save the updated user information
      await user.save();
  
      res.status(200).json({ msg: "Password has been reset successfully." });
    } catch (error) {
      console.error("Error during password reset:", error);
      res.status(500).json({ msg: "Server error" });
    }
  };



module.exports = { signupUser, loginUser, updateUser, forgetPassword ,resetPassword};
