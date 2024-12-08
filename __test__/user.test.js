const { describe, test, beforeAll, afterAll, expect } = require("@jest/globals");
const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../models");
const { hashPassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
const { queryInterface } = sequelize;

// const access_token_admin ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzMxNDg5NTcyfQ.Y04RjDxUt8K4aRC3KuiNchF0RzHdLawGNj6DNshOLe8";

let sellerToken;

beforeAll(async () => {
  const data = require("../db/users.json").map((e) => {
    delete e.id;
    e.createdAt = e.updatedAt = new Date();
    e.password = hashPassword(e.password, 10);
    return e;
  });
  await queryInterface.bulkInsert("Users", data, {});

  sellerToken = signToken({id: 1})
});
afterAll(async() => {
    await queryInterface.bulkDelete("Users", null, {
        restartIdentity:true,
        truncate: true,
        cascade: true
    })
})

describe("Membuat Testing untuk Login (POST /login", () => {
  test("Berhasil login dan mengirimkan access_token", async () => {
    const response = await request(app).post("/login")
      .set('Authorization', `Bearer ${sellerToken}`)
      .send({
        email: "arif@gmail.com",
        password: "123456",
        role: "Seller"
      });
      // console.log(response.body, 'testsss login');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("status", 'Successfully to Login');
  });
  test('Email tidak diberikan/tidak di input', async() => {
    const response = await request(app).post('/login')
    .set('Authorization', `Bearer ${sellerToken}`)
    .send({
        email: "",
        password: "123456",
        role: "Seller"
    });
    // console.log(response.body.message, 'testsss');
    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('message','Email is required')
  });
  test('Password tidak diberikan/tidak di input', async() => {
    const response = await request(app).post('/login')
    .set('Authorization', `Bearer ${sellerToken}`)
    .send({
        email: "arif@gmail.com",
        password: "",
        role: "Seller"
    });
    //  console.log(response.body.message, 'testsss');
    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('message','Password is required')
  });

  test('Email diberikan invalid / tidak terdaftar', async() => {
    const response = await request(app).post('/login')
    .set('Authorization', `Bearer ${sellerToken}`)
    .send({
        email: "arifudinaswar@gmail.com",
        password: "123456",
        role: "Seller"
    });
    // console.log(response.body.message, 'testsss');
    expect(response.status).toBe(404)
    expect(response.body).toHaveProperty('message','User is not found')
  })

  test('Password diberikan salah / tidak match', async() => {
    const response = await request(app).post('/login')
    .set('Authorization', `Bearer ${sellerToken}`)
    .send({
        email: "arif@gmail.com",
        password: "12345678",
        role: "Seller"
    });
    // console.log(response.body.message, 'testsss');
    expect(response.status).toBe(401)
    expect(response.body).toHaveProperty('message','Invalid password/email')
  })
});
