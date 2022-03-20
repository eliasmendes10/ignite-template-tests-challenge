import request from "supertest";
import { app } from "../../../../app";
import { v4 as uuid } from "uuid";
import { hash } from "bcryptjs";

import createConnection from "../../../../database";
import { Connection } from "typeorm";

let connection: Connection;

describe("Show User Profile Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuid();
    const password = await hash("password", 8);

    await connection.query(
      `INSERT INTO USERS(id, name, email, password, created_at, updated_at)
        values('${id}', 'Supertest', 'email@supertest.com', '${password}', 'now()', 'now()')
      `
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to show a user profile", async () => {
    const sessionResponse = await request(app).post("/api/v1/sessions").send({
      email: "email@supertest.com",
      password: "password",
    });

    const { user, token } = sessionResponse.body;

    const response = await request(app)
      .get("/api/v1/profile")
      .set({ authorization: `Bearer ${token}` });

    expect(response.status).toBe(200);
    expect(user.email).toEqual("email@supertest.com");
    expect(user.name).toEqual("Supertest");
    expect(user.id).not.toBeNull();
    expect(user.created_at).not.toBeNull();
  });
});
