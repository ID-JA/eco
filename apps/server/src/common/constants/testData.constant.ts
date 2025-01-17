import { hashSync } from "bcrypt"
import { config } from "../../config/config";

export const userPayload = {
  firstName: "john",
  lastName: "doe",
  email: "john@eco.com",
  password: "password",
  address: "address54646513",
  phone: "+1000000",
  birthDay: new Date(),
  gender: "M"
};

export const adminPayload = {
  firstName: "admin",
  lastName: "admin",
  email: "admin@eco.com",
  password: hashSync("password", Number(config.SALT)),
  isAdmin: true,
  verifiedAt: new Date(),
  address: "address54646513",
  phone: "+1000000",
  birthDay: new Date(),
  gender: "F"
};

export const categoryPayload = {
  name: "cat",
};

export const productPayload = {
  name: "Product",
  price: 999,
  discount: 20,
  inStock: true,
  shortDescription: "Short",
  description: "Long",
};
