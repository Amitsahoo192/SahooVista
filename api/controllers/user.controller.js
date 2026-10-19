
import prisma from "../lib/prisma.js";
import bcrypt from "bcryptjs";

// Get all users — restrict this route to authorized admins
export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
      },
    });

    res.status(200).json(users);
  } catch (err) {
    console.error("Failed to get users:", err);
    res.status(500).json({ message: "Failed to get users!" });
  }
};

// Get a single user — return only safe fields
export const getUser = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Failed to get user:", err);
    res.status(500).json({ message: "Failed to get user!" });
  }
};

// Update user profile
export const updateUser = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;
  const { password, avatar, username, email } = req.body;

  if (id !== tokenUserId) {
    return res.status(403).json({ message: "Not Authorized!" });
  }

  try {
    const data = {};

    // Allow only explicitly approved profile fields
    if (username !== undefined) data.username = username;
    if (email !== undefined) data.email = email;
    if (avatar !== undefined) data.avatar = avatar;

    if (password) {
      if (typeof password !== "string" || password.length < 8) {
        return res.status(400).json({
          message: "Password must be at least 8 characters long!",
        });
      }

      data.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
      },
    });

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error("Failed to update user:", err);

    if (err.code === "P2002") {
      return res.status(409).json({
        message: "Username or email already exists!",
      });
    }

    if (err.code === "P2025") {
      return res.status(404).json({ message: "User not found!" });
    }

    res.status(500).json({ message: "Failed to update user!" });
  }
};

// Delete user account
export const deleteUser = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;

  if (id !== tokenUserId) {
    return res.status(403).json({ message: "Not Authorized!" });
  }

  try {
    await prisma.user.delete({
      where: { id },
    });

    res.status(200).json({ message: "User deleted" });
  } catch (err) {
    console.error("Failed to delete user:", err);

    if (err.code === "P2025") {
      return res.status(404).json({ message: "User not found!" });
    }

    res.status(500).json({ message: "Failed to delete user!" });
  }
};

// Save or unsave a property post
export const savePost = async (req, res) => {
  const postId = req.body.postId;
  const tokenUserId = req.userId;

  if (!postId) {
    return res.status(400).json({ message: "Post ID is required!" });
  }

  try {
    const savedPost = await prisma.savedPost.findUnique({
      where: {
        userId_postId: {
          userId: tokenUserId,
          postId,
        },
      },
    });

    if (savedPost) {
      await prisma.savedPost.delete({
        where: { id: savedPost.id },
      });

      return res.status(200).json({
        message: "Post removed from saved list",
      });
    }

    await prisma.savedPost.create({
      data: {
        userId: tokenUserId,
        postId,
      },
    });

    res.status(200).json({ message: "Post saved" });
  } catch (err) {
    console.error("Failed to save/unsave post:", err);
    res.status(500).json({ message: "Failed to update saved posts!" });
  }
};

// Get the current user's posts and saved posts
export const profilePosts = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    const userPosts = await prisma.post.findMany({
      where: { userId: tokenUserId },
    });

    const saved = await prisma.savedPost.findMany({
      where: { userId: tokenUserId },
      include: {
        post: true,
      },
    });

    const savedPosts = saved.map((item) => item.post);

    res.status(200).json({ userPosts, savedPosts });
  } catch (err) {
    console.error("Failed to get profile posts:", err);
    res.status(500).json({ message: "Failed to get profile posts!" });
  }
};
