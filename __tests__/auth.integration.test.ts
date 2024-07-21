import { authServiceSeed } from "./helpers/test-helpers";
import "dotenv/config";
import bcrypt from "bcrypt";

describe("check utils like integration", () => {
  it("should register user with correct data", async () => {
    const credentials = {
      login: "testik",
      email: "testik@test.he",
      password: "testick",
    };
    const user = await authServiceSeed.createUser(credentials);
    expect(user.hasOwnProperty("login")).toBe(true);
    expect(user.hasOwnProperty("email")).toBe(true);
    expect(user.hasOwnProperty("passwordHash")).toBe(true);
    expect(user).toHaveProperty("login", credentials.login);
    expect(user).toHaveProperty("email", credentials.email);
  });
});
