const prisma = require("../../lib/prisma");
const bcrypt = require("bcryptjs");
const CustomAPIError = require("../middlewares/custom-error");
const { generateToken } = require("../../lib/jwt");

const fetchAllUsers = async () => {
  const users = await prisma.user.findMany();
  return users;
};

const getUser = async (data) => {
  const { username, password } = data;
  if (!username) {
    throw new CustomAPIError("Invalid username or password", 401);
  }
  if (!password) {
    throw new CustomAPIError("Invalid username or password", 401);
  }
  // Step 1: Check if the username exists
  const user = await prisma.user.findFirst({
    where: {
      username,
    },
  });

  if (!user) {
    throw new CustomAPIError("Invalid username or password", 401);
  }

  // Step 2: Compare passwords
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new CustomAPIError("Invalid username or password", 401);
  }

  // Generate JWT token
  const token = generateToken(user);

  return token;
};

const fetchUserDetail = async (id) => {
  try {
    const userId = parseInt(id, 10);
    console.log("userId: " + userId);
    const users = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!users) {
      throw new CustomAPIError(`No User with id of ${id}`, 400);
    }

    return users;
  } catch (error) {
    console.log(error);
    throw new CustomAPIError(`${error.message}`, 500);
  }
};

const postUser = async (data) => {
  let { username, email, password } = data;

  try {
    const existedUserUsername = await prisma.user.findFirst({
      where: { username: username },
    });

    if (existedUserUsername) {
      throw new CustomAPIError(`Username is taken`, 400);
    }

    const existedUserEmail = await prisma.user.findFirst({
      where: { email: email },
    });

    if (existedUserEmail) {
      throw new CustomAPIError(`Email is registered before`, 400);
    }

    // hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
        },
      });

      return createdUser;
    });
  } catch (error) {
    console.log(error);
    throw new CustomAPIError(`${error.message}`, 500);
  }
};

const putUser = async (id, data) => {
  try {
    const userId = parseInt(id, 10);

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new CustomAPIError(`no user with id of ${id}`, 400);
    }

    const { username, email, password } = data;

    let hashedPassword = user.password;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }
    await prisma.user.update({
      where: {
        id: +userId,
      },
      data: {
        username: username || user.username,
        email: email || user.email,
        password: hashedPassword,
      },
    });

    const updateUser = await prisma.user.findUnique({
      where: { id: userId },
    });
    return updateUser;
  } catch (error) {
    console.log(error);
    throw new CustomAPIError(`Error: ${error.message}`, 500);
  }
};

const destroyUser = async (id) => {
  try {
    const userId = parseInt(id, 10);
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new CustomAPIError(`No user with id ${userId}`, 400);
    }

    await prisma.user.delete({
      where: {
        id: userId,
      },
    });

    return {
      deletedUser: user,
    };
  } catch (error) {
    console.log(error);
    throw new CustomAPIError(
      `Error: ${error.message}`,
      error.statusCode || 500
    );
  }
};

module.exports = {
  fetchAllUsers,
  getUser,
  fetchUserDetail,
  postUser,
  putUser,
  destroyUser,
};
