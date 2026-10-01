import prisma from "../lib/prisma.js";

export const getChats = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    const chats = await prisma.chat.findMany({
      where: {
        userIDs: {
          hasSome: [tokenUserId],
        },
      },
    });

    const validChats = [];

    for (const chat of chats) {
      const receiverId = chat.userIDs.find(
        (id) => id !== tokenUserId
      );

      // Skip broken chats that don't have another user
      if (!receiverId) {
        continue;
      }

      const receiver = await prisma.user.findUnique({
        where: {
          id: receiverId,
        },
        select: {
          id: true,
          username: true,
          avatar: true,
        },
      });

      // Skip chat if receiver no longer exists
      if (!receiver) {
        continue;
      }

      validChats.push({
        ...chat,
        receiver,
      });
    }

    return res.status(200).json(validChats);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Failed to get chats!",
    });
  }
};

export const getChat = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    const chat = await prisma.chat.findUnique({
      where: {
        id: req.params.id,
        userIDs: {
          hasSome: [tokenUserId],
        },
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!chat) {
      return res.status(404).json({
        message: "Chat not found!",
      });
    }

    await prisma.chat.update({
      where: {
        id: req.params.id,
      },
      data: {
        seenBy: {
          push: [tokenUserId],
        },
      },
    });

    return res.status(200).json(chat);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Failed to get chat!",
    });
  }
};

export const addChat = async (req, res) => {
  const tokenUserId = req.userId;
  const receiverId = req.body.receiverId;

  try {
    if (!receiverId) {
      return res.status(400).json({
        message: "Receiver ID is required!",
      });
    }

    if (tokenUserId === receiverId) {
      return res.status(400).json({
        message: "You cannot create a chat with yourself!",
      });
    }

    const receiver = await prisma.user.findUnique({
      where: {
        id: receiverId,
      },
    });

    if (!receiver) {
      return res.status(404).json({
        message: "Receiver not found!",
      });
    }

    const existingChat = await prisma.chat.findFirst({
      where: {
        AND: [
          {
            userIDs: {
              has: tokenUserId,
            },
          },
          {
            userIDs: {
              has: receiverId,
            },
          },
        ],
      },
    });

    if (existingChat) {
      return res.status(200).json(existingChat);
    }

    const newChat = await prisma.chat.create({
      data: {
        userIDs: [tokenUserId, receiverId],
      },
    });

    return res.status(200).json(newChat);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Failed to add chat!",
    });
  }
};

export const readChat = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    const chat = await prisma.chat.update({
      where: {
        id: req.params.id,
        userIDs: {
          hasSome: [tokenUserId],
        },
      },
      data: {
        seenBy: {
          set: [tokenUserId],
        },
      },
    });

    return res.status(200).json(chat);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Failed to read chat!",
    });
  }
};