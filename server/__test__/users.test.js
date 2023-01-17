const request = require("supertest");
const { server: app } = require("../app.js");
const { hashPassword } = require("../helpers/bcryptjs.js");
const { sequelize } = require("../models");
const { queryInterface } = sequelize;
let access_token


beforeAll(async () => {
  await queryInterface.bulkInsert("Users", [
    {
      fullName: "bobby2",
      phoneNumber: "08111",
      email: "bobby2@gmail.com",
      password: hashPassword("12345"),
      isPremium: false,
      role: "Customer",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      fullName: "bobby22",
      phoneNumber: "08111",
      email: "bobby22@gmail.com",
      password: hashPassword("12345"),
      isPremium: false,
      role: "Customer",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      fullName: "bobby222",
      phoneNumber: "08111",
      email: "bobby222@gmail.com",
      password: hashPassword("12345"),
      isPremium: false,
      role: "Customer",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      fullName: "bobby2222",
      phoneNumber: "08111",
      email: "bobby2222@gmail.com",
      password: hashPassword("12345"),
      isPremium: false,
      role: "Customer",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      fullName: "bobby666",
      phoneNumber: "08111",
      email: "bobby666@gmail.com",
      password: hashPassword("12345"),
      isPremium: false,
      role: "Customer",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      fullName: "bobby25",
      phoneNumber: "08111",
      email: "bobby25@gmail.com",
      password: hashPassword("12345"),
      isPremium: false,
      role: "Admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  await sequelize.queryInterface.bulkInsert(
    "Users",
    require("../data/users.json").map((ele) => {
      ele.createdAt = ele.updatedAt = new Date();
      return ele;
    })
  );
});

afterAll(async () => {
  await sequelize.queryInterface.bulkDelete("Users", null, {
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });
});

describe("Register customer account in /register", () => {
  test("Success to register customer account", async () => {
    const res = await request(app)
      .post("/register")
      .send({
        fullName: "bobby3",
        phoneNumber: "08111",
        email: "bobby3@gmail.com",
        password: hashPassword("12345"),
        isPremium: false,
        role: "Customer",
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("message", expect.any(String));
  });
  test("Email is undefined", async () => {
    const res = await request(app)
      .post("/register")
      .send({
        fullName: "bobby3",
        phoneNumber: "08111",
        password: hashPassword("12345"),
        isPremium: false,
        role: "Customer",
      });
    expect(res.status).toBe(400);
    expect(res.body.msg).toBe("Email is required");
  });
  test("Password is undefined", async () => {
    const res = await request(app).post("/register").send({
      fullName: "bobby3",
      phoneNumber: "08111",
      email: "bobby3@gmail.com",
      isPremium: false,
      role: "Customer",
    });
    expect(res.status).toBe(400);
    expect(res.body.msg).toBe("Password is required");
  });
  test("Email is empty", async () => {
    const res = await request(app)
      .post("/register")
      .send({
        fullName: "bobby3",
        phoneNumber: "08111",
        email: "",
        password: hashPassword("12345"),
        isPremium: false,
        role: "Customer",
      });
    expect(res.status).toBe(400);
    expect(res.body.msg).toBe("Email format is not valid");
  });
  test("Password is empty", async () => {
    const res = await request(app).post("/register").send({
      fullName: "bobby3",
      phoneNumber: "08111",
      email: "bobby5@gmail.com",
      password: "",
      isPremium: false,
      role: "Customer",
    });
    expect(res.status).toBe(400);
    expect(res.body.msg).toBe("Minimum password length must be 5 letter");
  });
  test("Register duplicate email address", async () => {
    await request(app)
      .post("/register")
      .send({
        fullName: "bobby4",
        phoneNumber: "08111",
        email: "bobby4@gmail.com",
        password: hashPassword("12345"),
        isPremium: false,
        role: "Customer",
      });
    const res = await request(app)
      .post("/register")
      .send({
        fullName: "bobby4",
        phoneNumber: "08111",
        email: "bobby4@gmail.com",
        password: hashPassword("12345"),
        isPremium: false,
        role: "Customer",
      });
    expect(res.status).toBe(400);
    expect(res.body.msg).toBe("This Email Already Registered");
  });
  test("Email format not valid", async () => {
    const res = await request(app)
      .post("/register")
      .send({
        fullName: "bobby3",
        phoneNumber: "08111",
        email: "bobby3",
        password: hashPassword("12345"),
        isPremium: false,
        role: "Customer",
      });
    expect(res.status).toBe(400);
    expect(res.body.msg).toBe("Email format is not valid");
  });
});

describe("Login customer /login", () => {
  test("Success login as customer", async () => {
    await request(app).post("/register").send({
      fullName: "bobby10",
      phoneNumber: "08111",
      email: "bobby10@gmail.com",
      password: "12345",
      isPremium: false,
      role: "Customer",
    });
    const res = await request(app).post("/login").send({
      email: "bobby10@gmail.com",
      password: "12345",
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("access_token", expect.any(String));
  });
  test("Password is false", async () => {
    await request(app).post("/register").send({
      fullName: "bobby11",
      phoneNumber: "08111",
      email: "bobby11@gmail.com",
      password: "12345",
      isPremium: false,
      role: "Customer",
    });
    const res = await request(app).post("/login").send({
      email: "bobby11@gmail.com",
      password: "1234",
    });

    expect(res.status).toBe(401);
    expect(res.body.msg).toBe("Invalid Email/Password");
  });
  test("Email is false", async () => {
    await request(app).post("/register").send({
      fullName: "bobby12",
      phoneNumber: "08111",
      email: "bobby12@gmail.com",
      password: "12345",
      isPremium: false,
      role: "Customer",
    });
    const res = await request(app).post("/login").send({
      email: "bobby123@gmail.com",
      password: "12345",
    });

    expect(res.status).toBe(401);
    expect(res.body.msg).toBe("Invalid Email/Password");
  });
  test("Email is undefined", async () => {
    await request(app).post("/register").send({
      fullName: "bobby13",
      phoneNumber: "08111",
      email: "bobby13@gmail.com",
      password: "12345",
      isPremium: false,
      role: "Customer",
    });
    const res = await request(app).post("/login").send({
      email: "",
      password: "12345",
    });

    expect(res.status).toBe(400);
    expect(res.body.msg).toBe("Email and Password is Required");
  });
  test("Password is undefined", async () => {
    await request(app).post("/register").send({
      fullName: "bobby14",
      phoneNumber: "08111",
      email: "bobby14@gmail.com",
      password: "12345",
      isPremium: false,
      role: "Customer",
    });
    const res = await request(app).post("/login").send({
      email: "bobby14@gmail.com",
      password: "",
    });

    expect(res.status).toBe(400);
    expect(res.body.msg).toBe("Email and Password is Required");
  });
});

describe("GET User By Id", () => {
  describe("Success fetch user details", () => {
    it("should return object of that user detail", async () => {
      const body = { email: "bobby25@gmail.com", password: "12345" };
      let res = await request(app).post("/login").send(body);
      access_token = res.body.access_token;

      res = await request(app)
        .get("/users")
        .set("access_token", access_token);

      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.userById).toHaveProperty("id", expect.any(Number));
      expect(res.body.userById).toHaveProperty("fullName", expect.any(String));
      expect(res.body.userById).toHaveProperty(
        "phoneNumber",
        expect.any(String)
      );
      expect(res.body.userById).toHaveProperty("email", expect.any(String));
      expect(res.body.userById).toHaveProperty(
        "isPremium",
        expect.any(Boolean)
      );
      expect(res.body.userById).toHaveProperty("role", expect.any(String));
      expect(res.body.userById).toHaveProperty("createdAt", expect.any(String));
      expect(res.body.userById).toHaveProperty("updatedAt", expect.any(String));
    });
  });
});

describe("PUT Update User", () => {
  describe("Success change user data", () => {
    it("should return object with message", async () => {
      let passwordChange = { password: "123456" };
      res = await request(app)
        .put("/users")
        .send(passwordChange)
        .set("access_token", access_token);

      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message", "User successfully updated");
    });
  });

  describe("Failed change user password", () => {
    it("should return object with message", async () => {
      let passwordChange = { password: "" };
      res = await request(app)
        .put("/users")
        .send(passwordChange)
        .set("access_token", access_token);

      expect(res.status).toBe(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("msg", "Email and Password is Required");
    });
  });

  describe("Failed change user password because less than 5 word", () => {
    it("should return object with message", async () => {
      let passwordChange = { password: "1234" };
      res = await request(app)
        .put("/users")
        .send(passwordChange)
        .set("access_token", access_token);

      expect(res.status).toBe(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty(
        "msg",
        "Minimum password length must be 5 letter"
      );
    });
  });

  describe("Failed change user full name", () => {
    it("should return object with message", async () => {
      let nameChange = {
        fullName: "",
        phoneNumber: "08111945586",
        email: "bobby@gmail.com",
        password: "12345",
      };
      res = await request(app)
        .put("/users")
        .send(nameChange)
        .set("access_token", access_token);

      expect(res.status).toBe(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("msg", "Name is required");
    });
  });

  describe("Failed change user phone number", () => {
    it("should return object with message", async () => {
      let numberChange = {
        fullName: "Bobby",
        phoneNumber: "",
        email: "bobby@gmail.com",
        password: "12345",
      };
      res = await request(app)
        .put("/users")
        .send(numberChange)
        .set("access_token", access_token);

      expect(res.status).toBe(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("msg", "Phone number is required");
    });
  });

  describe("Failed change user email", () => {
    it("should return object with message", async () => {
      let emailChange = {
        fullName: "Bobby",
        phoneNumber: "08111",
        email: "",
        password: "12345",
      };
      res = await request(app)
        .put("/users")
        .send(emailChange)
        .set("access_token", access_token);

      expect(res.status).toBe(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("msg", "Email format is not valid");
    });
  });

  describe("Failed change user email because duplication", () => {
    it("should return object with message", async () => {
      let emailChange = {
        fullName: "Bobby",
        phoneNumber: "08111",
        email: "bobby22@gmail.com",
        password: "12345",
      };
      res = await request(app)
        .put("/users")
        .send(emailChange)
        .set("access_token", access_token);

      expect(res.status).toBe(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("msg", "This Email Already Registered");
    });
  });
});

describe("PATCH - Update User Status To Premium", () => {
  describe("Success change user premium status", () => {
    it("should return object with message", async () => {
      res = await request(app)
        .patch("/users/activatePremium")
        .set("access_token", access_token);

      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty(
        "message",
        "User status has been updated to premium"
      );
    });
  });

  describe("Failed change user premium status because already premium", () => {
    it("should return object with message", async () => {
      res = await request(app)
        .patch("/users/activatePremium")
        .set("access_token", access_token);
      res = await request(app)
        .patch("/users/activatePremium")
        .set("access_token", access_token);

      expect(res.status).toBe(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("msg", "User status already premium");
    });
  });
});

describe("PATCH - Update User Status From Premium To Not", () => {
  describe("Success change user premium status", () => {
    it("should return object with message", async () => {
      res = await request(app)
        .patch("/users/deactivatePremium")
        .set("access_token", access_token);

      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty(
        "message",
        "User status no longer premium"
      );
    });
  });

  describe("Failed change user premium status because already not premium", () => {
    it("should return object with message", async () => {
      res = await request(app)
        .patch("/users/deactivatePremium")
        .set("access_token", access_token);
      res = await request(app)
        .patch("/users/deactivatePremium")
        .set("access_token", access_token);

      expect(res.status).toBe(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("msg", "User status already not premium");
    });
  });
});

describe("PATCH - Incrementing User Point By 1", () => {
  describe("Success change user point value", () => {
    it("should return object with message", async () => {
      res = await request(app)
        .patch("/users/incrimentPoint")
        .set("access_token", access_token);

      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty(
        "message",
        "User point has been incrimented by 1"
      );
    });
  });
});
