import { app } from "../../../src/app";
import request from "supertest";

/* Sends an http request to the login endpoint with the desired body */
export const login = async (credentials: { email?: string; password?: string }) => {
  return await request(await app())
    .post("/login")
    .set("Content-Type", "application/json")
    .send(credentials);
};

export const register = async (user: { email?: string; password?: string; password_confirmation?: string; firstName?: string; lastName?: string }) => {
  return await request(await app())
    .post("/register")
    .set("Content-Type", "application/json")
    .send(user);
};

export const refresh = async (refreshToken: string) => {
  return await request(await app())
    .post("/refresh")
    .set("Content-Type", "application/json")
    .set("Authorization", `Bearer ${refreshToken}`);
};

export const verify = async (accessToken: string) => {
  return await request(await app())
    .get("/verify")
    .set("Content-Type", "application/json")
    .set("Authorization", `Bearer ${accessToken}`);
};

export const logout = async (refreshToken: string) => {
  return await request(await app())
    .post("/logout")
    .set("Content-Type", "application/json")
    .set("Authorization", `Bearer ${refreshToken}`);
};

export const forgot_password = async (email?: string) => {
  return await request(await app())
    .post("/forgot-password")
    .set("Content-Type", "application/json")
    .send({ email });
};

export const send_confirmation_email = async (accessToken: string) => {
  return await request(await app())
    .post("/send-confirmation-email")
    .set("Content-Type", "application/json")
    .set("Authorization", `Bearer ${accessToken}`);
};
