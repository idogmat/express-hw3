import { config } from "dotenv";
config();

export const SETTINGS = {
  PORT: process.env.PORT || 3003,
  PATH: {
    BLOGS: "/blogs",
    POSTS: "/posts",
    TESTING: "/testing",
    AUTH: "/auth",
    USERS: "/users",
    COMMENTS: "/comments",
    DEVICES: "/security/devices",
    FILE: "/file",
  },
  ADMIN: process.env.ADMIN || "admin:qwerty",
};
