
import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

export const getPosts = async (req, res) => {
  const query = req.query;

  const parseNumber = (value) => {
    if (value === undefined || value === null || value === "") {
      return undefined;
    }

    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  };

  const minPrice = parseNumber(query.minPrice);
  const maxPrice = parseNumber(query.maxPrice);
  const bedroom = parseNumber(query.bedroom);
  const bathroom = parseNumber(query.bathroom);

  const localities = Array.isArray(query.locality)
    ? query.locality
    : query.locality
      ? [query.locality]
      : [];

  const tenants = Array.isArray(query.tenant)
    ? query.tenant
    : query.tenant
      ? [query.tenant]
      : [];

  try {
    // Validate numeric filters instead of silently ignoring invalid values.
    for (const [name, value] of [
      ["minPrice", minPrice],
      ["maxPrice", maxPrice],
      ["bedroom", bedroom],
      ["bathroom", bathroom],
    ]) {
      if (
        value !== undefined &&
        (value < 0 ||
          !Number.isFinite(value) ||
          !Number.isInteger(value) ||
          ((name === "bedroom" || name === "bathroom") && value < 1))
      ) {
        return res.status(400).json({
          message: `Invalid ${name} filter`,
        });
      }
    }

    if (
      minPrice !== undefined &&
      maxPrice !== undefined &&
      minPrice > maxPrice
    ) {
      return res.status(400).json({
        message: "Minimum price cannot exceed maximum price",
      });
    }

    const where = {};

    // City search.
    if (query.city?.trim()) {
      where.city = {
        contains: query.city.trim(),
        mode: "insensitive",
      };
    }

    // Buy or rent.
    if (["buy", "rent"].includes(query.type)) {
      where.type = query.type;
    }

    // Property category.
    if (
      ["apartment", "house", "condo", "land"].includes(query.property)
    ) {
      where.property = query.property;
    }

    // Budget.
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};

      if (minPrice !== undefined) {
        where.price.gte = minPrice;
      }

      if (maxPrice !== undefined) {
        where.price.lte = maxPrice;
      }
    }

    // Minimum bedroom and bathroom counts.
    if (bedroom !== undefined) {
      where.bedroom = { gte: bedroom };
    }

    if (bathroom !== undefined) {
      where.bathroom = { gte: bathroom };
    }

    // Furnishing.
    if (
      ["furnished", "semi-furnished", "unfurnished"].includes(
        query.furnishing
      )
    ) {
      where.furnishing = query.furnishing;
    }

    // Poster type.
    if (["owner", "agent", "builder"].includes(query.postedBy)) {
      where.postedBy = query.postedBy;
    }

    // Tenant preference: matches any selected preference.
    const validTenants = tenants.filter((tenant) =>
      ["family", "bachelors", "students", "professionals"].includes(tenant)
    );

    if (validTenants.length > 0) {
      where.tenantPreference = {
        hasSome: validTenants,
      };
    }

    // Verified listings.
    if (query.verified === "true") {
      where.verified = true;
    }

    // Listings with images.
    if (query.photos === "true") {
      where.images = { isEmpty: false };
    }

    // Listings with a video URL.
    if (query.videos === "true") {
      where.videoUrl = { not: null };
    }

    // Search localities in either the city or address.
    const validLocalities = localities
      .filter((value) => typeof value === "string")
      .map((value) => value.trim())
      .filter(Boolean);

    if (validLocalities.length > 0) {
      const localityConditions = validLocalities.map((locality) => ({
        OR: [
          {
            city: {
              contains: locality,
              mode: "insensitive",
            },
          },
          {
            address: {
              contains: locality,
              mode: "insensitive",
            },
          },
        ],
      }));

      if (where.OR) {
        where.AND = [
          ...(where.AND || []),
          { OR: where.OR },
          { OR: localityConditions },
        ];
        delete where.OR;
      } else {
        where.AND = [
          ...(where.AND || []),
          { OR: localityConditions },
        ];
      }
    }

    // Sorting.
    let orderBy = { createdAt: "desc" };

    switch (query.sort) {
      case "priceAsc":
        orderBy = { price: "asc" };
        break;

      case "priceDesc":
        orderBy = { price: "desc" };
        break;

      case "bedroomDesc":
        orderBy = { bedroom: "desc" };
        break;

      case "newest":
        orderBy = { createdAt: "desc" };
        break;

      default:
        break;
    }

    const posts = await prisma.post.findMany({
      where,
      orderBy,
    });

    return res.status(200).json(posts);
  } catch (err) {
    console.error("Failed to get posts:", err);

    return res.status(500).json({
      message: "Failed to get posts",
    });
  }
};

export const getPost = async (req, res) => {
  const id = req.params.id;

  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        postDetail: true,
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
      },
    });

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const token = req.cookies?.token;

    if (!token) {
      return res.status(200).json({
        ...post,
        isSaved: false,
      });
    }

    try {
      const payload = jwt.verify(
        token,
        process.env.JWT_SECRET_KEY
      );

      const saved = await prisma.savedPost.findUnique({
        where: {
          userId_postId: {
            userId: payload.id,
            postId: id,
          },
        },
      });

      return res.status(200).json({
        ...post,
        isSaved: Boolean(saved),
      });
    } catch {
      return res.status(200).json({
        ...post,
        isSaved: false,
      });
    }
  } catch (err) {
    console.error("Failed to get post:", err);

    return res.status(500).json({
      message: "Failed to get post",
    });
  }
};

export const addPost = async (req, res) => {
  const body = req.body;
  const tokenUserId = req.userId;

  try {
    const postData = { ...(body.postData || {}) };

    // Verification must not be granted by a listing creator.
    delete postData.verified;

    const newPost = await prisma.post.create({
      data: {
        ...postData,
        userId: tokenUserId,
        postDetail: {
          create: body.postDetail,
        },
      },
    });

    return res.status(201).json(newPost);
  } catch (err) {
    console.error("Failed to create post:", err);

    return res.status(500).json({
      message: "Failed to create post",
    });
  }
};

export const updatePost = async (req, res) => {
  const { id } = req.params;
  const tokenUserId = req.userId;
  const { postData = {}, postDetail } = req.body;

  try {
    const existingPost = await prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return res.status(404).json({
        message: "Property not found",
      });
    }

    if (existingPost.userId !== tokenUserId) {
      return res.status(403).json({
        message: "You are not authorized to edit this property",
      });
    }

    const allowedFields = [
      "title",
      "price",
      "images",
      "address",
      "city",
      "bedroom",
      "bathroom",
      "latitude",
      "longitude",
      "type",
      "property",
      "furnishing",
      "postedBy",
      "tenantPreference",
      "videoUrl",
    ];

    const data = {};

    for (const field of allowedFields) {
      if (
        Object.prototype.hasOwnProperty.call(postData, field)
      ) {
        data[field] = postData[field];
      }
    }

    // Never allow ordinary listing edits to grant verification.
    delete data.verified;

    if (
      data.price !== undefined &&
      (!Number.isInteger(data.price) || data.price < 0)
    ) {
      return res.status(400).json({
        message: "Price must be a non-negative integer",
      });
    }

    for (const field of ["bedroom", "bathroom"]) {
      if (
        data[field] !== undefined &&
        (!Number.isInteger(data[field]) || data[field] < 0)
      ) {
        return res.status(400).json({
          message: `${field} must be a non-negative integer`,
        });
      }
    }

    if (
      data.type !== undefined &&
      !["buy", "rent"].includes(data.type)
    ) {
      return res.status(400).json({
        message: "Invalid listing type",
      });
    }

    if (
      data.property !== undefined &&
      !["apartment", "house", "condo", "land"].includes(data.property)
    ) {
      return res.status(400).json({
        message: "Invalid property category",
      });
    }

    if (
      data.furnishing !== undefined &&
      data.furnishing !== null &&
      !["furnished", "semi-furnished", "unfurnished"].includes(
        data.furnishing
      )
    ) {
      return res.status(400).json({
        message: "Invalid furnishing option",
      });
    }

    if (
      data.postedBy !== undefined &&
      data.postedBy !== null &&
      !["owner", "agent", "builder"].includes(data.postedBy)
    ) {
      return res.status(400).json({
        message: "Invalid poster type",
      });
    }

    if (
      data.tenantPreference !== undefined &&
      (!Array.isArray(data.tenantPreference) ||
        data.tenantPreference.some(
          (tenant) =>
            !["family", "bachelors", "students", "professionals"].includes(
              tenant
            )
        ))
    ) {
      return res.status(400).json({
        message: "Invalid tenant preference",
      });
    }

    const updateData = { ...data };

    if (postDetail !== undefined) {
      if (
        !postDetail ||
        typeof postDetail !== "object" ||
        Array.isArray(postDetail)
      ) {
        return res.status(400).json({
          message: "Invalid property details",
        });
      }

      const detailFields = [
        "desc",
        "utilities",
        "pet",
        "income",
        "size",
        "school",
        "bus",
        "restaurant",
      ];

      const detailData = {};

      for (const field of detailFields) {
        if (
          Object.prototype.hasOwnProperty.call(postDetail, field)
        ) {
          detailData[field] = postDetail[field];
        }
      }

      const existingDetail = await prisma.postDetail.findUnique({
        where: { postId: id },
      });

      if (!existingDetail && !detailData.desc) {
        return res.status(400).json({
          message: "A description is required for property details",
        });
      }

      updateData.postDetail = existingDetail
        ? { update: detailData }
        : { create: detailData };
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: updateData,
      include: {
        postDetail: true,
      },
    });

    return res.status(200).json(updatedPost);
  } catch (err) {
    console.error("Failed to update property:", err);

    return res.status(500).json({
      message: "Failed to update property",
    });
  }
};

export const deletePost = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;

  try {
    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    if (post.userId !== tokenUserId) {
      return res.status(403).json({
        message: "Not Authorized!",
      });
    }

    await prisma.post.delete({
      where: { id },
    });

    return res.status(200).json({
      message: "Post deleted",
    });
  } catch (err) {
    console.error("Failed to delete post:", err);

    return res.status(500).json({
      message: "Failed to delete post",
    });
  }
};
