const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../models");
const { queryInterface } = sequelize;
const {
  describe,
  test,
  beforeAll,
  afterAll,
  expect,
} = require("@jest/globals");
const { hashPassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");

let sellerToken;
let falseToken;

beforeAll(async () => {
  const users = require('../db/users.json').map((user) => {
    delete user.id;
    user.createdAt = user.updatedAt = new Date();
    user.password = hashPassword(user.password, 10);
    return user;
  });
  const categories = require('../db/categories.json').map((category) => {
    category.createdAt = category.updatedAt = new Date();
    return category;
  });
  const products = require('../db/products.json').map((product) => {
    delete product.id;
    product.createdAt = product.updatedAt = new Date();
    return product;
  });
  // console.log(products);
  await queryInterface.bulkInsert("Users", users, {});
  await queryInterface.bulkInsert("Categories", categories, {});
  await queryInterface.bulkInsert("Products", products, {});
});

sellerToken = signToken({ id: 1 });
falseToken = "false";

afterAll(async () => {
  await queryInterface.bulkDelete(
    "Products",
    {},
    {
      restartIdentity: true,
      truncate: true,
      cascade: true,
    }
  );
  await queryInterface.bulkDelete(
    "Users",
    {},
    {
      restartIdentity: true,
      truncate: true,
      cascade: true,
    }
  );
  await queryInterface.bulkDelete(
    "Categories",
    {},
    {
      restartIdentity: true,
      truncate: true,
      cascade: true,
    }
  );
});

describe("Membuat Testing untuk Create Main Entity(POST /products", () => {
  test("Berhasil membuat entitas utama", async () => {
    const data = {
      name: "Celana keren",
      description: "selalu memeberikan kenyamanan di setiap situasi",
      price: 156828,
      stock: 3,
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4T6NPj3_gxgdGQeEqMUDmyzOW9sUmtHWN7g&s",
      categoryId: 2,
    };
    const response = await request(app)
      .post("/products")
      .set("Authorization", `Bearer ${sellerToken}`)
      .send(data);

    // console.log(response.body, 'testtss 1');

    expect(response.status).toBe(201);
    expect(response.body.newProduct).toHaveProperty("name", "Celana keren");
    expect(response.body.newProduct).toHaveProperty(
      "description",
      "selalu memeberikan kenyamanan di setiap situasi"
    );
    expect(response.body.newProduct).toHaveProperty("price", 156828);
    expect(response.body.newProduct).toHaveProperty("stock", 3);
  });
  test("Gagal menjalankan fitur karena belum login", async () => {
    const data = {
        name: "Celana keren",
        description: "selalu memeberikan kenyamanan di setiap situasi",
        price: 156828,
        stock: 3,
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4T6NPj3_gxgdGQeEqMUDmyzOW9sUmtHWN7g&s",
        categoryId: 2,
    };
    const response = await request(app).post("/products").send(data);

    console.log(response.body, 'testtss belum login');
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid token");
  });
  test("Gagal menjalankan fitur karena token yang diberikan tidak valid", async () => {
    const data = {
        name: "Celana keren",
        description: "selalu memeberikan kenyamanan di setiap situasi",
        price: 156828,
        stock: 3,
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4T6NPj3_gxgdGQeEqMUDmyzOW9sUmtHWN7g&s",
        categoryId: 2,
    };
    const response = await request(app)
      .post("/products")
      .set("Authorization", `Bearer ${falseToken}`)
      .send(data);

    //   console.log(response.body, 'testtss')
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid token");
  });

  test("Gagal ketika request body tidak sesuai (validation required)", async () => {
    const data = {
        name: "",
        description: "selalu memeberikan kenyamanan di setiap situasi",
        price: 156828,
        stock: 3,
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4T6NPj3_gxgdGQeEqMUDmyzOW9sUmtHWN7g&s",
        categoryId: 2,
    };
    const response = await request(app)
      .post("/products")
      .set("Authorization", `Bearer ${sellerToken}`)
      .send(data);

    //   console.log(response.body, 'testtss')
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Name is required");
  });
});

describe("Membuat Testing untuk Update Main Entity (PUT /products/:id)", () => {
  const productId = 1;
  test("Berhasil mengupdate data Entitas Utama berdasarkan params id yang diberikan", async () => {
    const data = {
        name: "Celana keren",
        description: "selalu memeberikan kenyamanan di setiap situasi",
        price: 156828,
        stock: 3,
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4T6NPj3_gxgdGQeEqMUDmyzOW9sUmtHWN7g&s",
        categoryId: 2,
    };

    const response = await request(app)
      .put(`/products/${productId}`)
      .set("Authorization", `Bearer ${sellerToken}`)
      .send(data);

    console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "status",
      `Successfully to update product`
    );
  });

  test("Gagal menjalankan fitur karena belum login", async () => {
    const data = {
        name: "Celana keren",
        description: "selalu memeberikan kenyamanan di setiap situasi",
        price: 156828,
        stock: 3,
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4T6NPj3_gxgdGQeEqMUDmyzOW9sUmtHWN7g&s",
        categoryId: 2,
    };

    const response = await request(app)
      .put(`/products/${productId}`)
      .send(data);
    // console.log(response.body)
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid token");
  });

  test("Gagal menjalankan fitur karena token yang diberikan tidak valid", async () => {
    const data = {
        name: "Celana keren",
        description: "selalu memeberikan kenyamanan di setiap situasi",
        price: 156828,
        stock: 3,
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4T6NPj3_gxgdGQeEqMUDmyzOW9sUmtHWN7g&s",
        categoryId: 2,
    };

    const response = await request(app)
      .put(`/products/${productId}`)
      .set("Authorization", `Bearer ${falseToken}`)
      .send(data);
    // console.log(response.body)
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid token");
  });

  test("Gagal karena id entity yang dikirim tidak terdapat di database", async () => {
    const data = {
        name: "Celana keren",
        description: "selalu memeberikan kenyamanan di setiap situasi",
        price: 156828,
        stock: 3,
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4T6NPj3_gxgdGQeEqMUDmyzOW9sUmtHWN7g&s",
        categoryId: 2,
    };
    const invalidId = 99;
    const response = await request(app)
      .put(`/products/${invalidId}`)
      .set("Authorization", `Bearer ${sellerToken}`)
      .send(data);

    // console.log(response.body)
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Product is not found");
  });


  test("Gagal ketika request body yang diberikan tidak sesuai", async () => {
    const data = {
        name: "",
        description: "selalu memeberikan kenyamanan di setiap situasi",
        price: 156828,
        stock: 3,
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4T6NPj3_gxgdGQeEqMUDmyzOW9sUmtHWN7g&s",
        categoryId: 2,
    };
    const response = await request(app)
      .put(`/products/${productId}`)
      .set("Authorization", `Bearer ${sellerToken}`)
      .send(data);

    // console.log(response.body, 'testtsss')
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Name is required");
  });
});

describe("Membuat Testing untuk Delete Main Entity (DELETE /products/:id)", () => {
  const productId = 1;
  test("Berhasil menghapus data Entitas Utama berdasarkan params id yang diberikan", async () => {
    const response = await request(app)
      .delete(`/products/${productId}`)
      .set("Authorization", `Bearer ${sellerToken}`);

    // console.log(response.body, 'testss delete');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "status",
      `Successfully to delete product`
    );
  });

  test("Gagal menjalankan fitur karena belum login", async () => {
    const response = await request(app).delete(`/products/${productId}`);

    // console.log(response.body, 'testss delete')
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid token");
  });

  test("Gagal menjalankan fitur karena token yang diberikan tidak valid", async () => {
    const response = await request(app)
      .delete(`/products/${productId}`)
      .set("Authorization", `Bearer ${falseToken}`);

    // console.log(response.body, 'testss delete')

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid token");
  });

  test("Gagal karena id produk yang dikirim tidak terdapat di database", async () => {
    const invalidId = 567;
    const response = await request(app)
      .delete(`/products/${invalidId}`)
      .set("Authorization", `Bearer ${sellerToken}`);

    // console.log(response.body, 'test delete');

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Product is not found");
  });

})
