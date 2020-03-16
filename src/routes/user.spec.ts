import Express, { Router, NextFunction } from "express";
import request from "supertest";
import user from "./user";
import SequelizeFixtures from "sequelize-fixtures";
import { User as UserModel } from "../models/User";

jest.mock("middlewares/checkToken", () => ({
  checkToken: (_: any, __: any, next: NextFunction) => next()
}));

jest.mock("middlewares/apiLogger", () => ({
  apiLogger: () => (_: any, __: any, next: NextFunction) => next()
}));

const initApp = () => {
  const router = Router();
  user(router);

  const app = Express();

  app.use(Express.json());
  app.use("/", router);

  return app;
};

const truncate = async () => {
  return await UserModel.destroy({ where: {}, force: true });
};

describe("User route GET /:id", () => {
  beforeEach(async () => {
    await truncate();
    jest.resetAllMocks();
  });

  it("should be return user and status 200", async () => {
    const app = initApp();
    const expectedUser = {
      id: "e12f3391-58e8-4e6a-9db4-f6fab0b728ce",
      login: "UserLogin",
      password: "123456",
      age: 22,
      isDeleted: false
    };
    const fixtures = [
      {
        model: "User",
        data: expectedUser
      }
    ];

    await SequelizeFixtures.loadFixtures(fixtures, { User: UserModel });

    const res = await request(app)
      .get("/users/e12f3391-58e8-4e6a-9db4-f6fab0b728ce")
      .accept("application/json")
      .expect(200);

    expect(res.body).toEqual(expect.objectContaining(expectedUser));
  });

  it("should be return status 400", async () => {
    const app = initApp();
    const expectedUser = {
      id: "e12f3391-58e8-4e6a-9db4-f6fab0b728ce",
      login: "UserLogin",
      password: "123456",
      age: 22,
      isDeleted: false,
      createdAt: "2020-03-16T07:26:54.375Z",
      updatedAt: "2020-03-16T07:26:54.375Z"
    };
    const fixtures = [
      {
        model: "User",
        data: expectedUser
      }
    ];

    await SequelizeFixtures.loadFixtures(fixtures, { User: UserModel });

    await request(app)
      .get("/users/9e4250f1-b8b7-4528-b78e-317fb37cebe4")
      .expect(400, { message: "User not found" });
  });
});

describe("User route POST /", () => {
  beforeEach(async () => {
    await truncate();
    jest.resetAllMocks();
  });
  it("should be return status 200 and new user", async () => {
    const app = initApp();

    await SequelizeFixtures.loadFixtures([], { User: UserModel });

    const expectedUser = {
      login: "vasya_ded",
      password: "a2ss3aaaa",
      age: 20
    };

    const res = await request(app)
      .post("/users")
      .accept("application/json")
      .set("Content-Type", "application/json")
      .send(expectedUser)
      .expect(200);

    expect(res.body).toEqual(expect.objectContaining(expectedUser));
  });
});

describe("User route PUT /:id", () => {
  beforeEach(async () => {
    await truncate();
    jest.resetAllMocks();
  });

  it("should be return status 200 and updated user", async () => {
    const app = initApp();
    const existUser = {
      id: "e12f3391-58e8-4e6a-9db4-f6fab0b728ce",
      login: "UserLogin",
      password: "123456",
      age: 22,
      isDeleted: false
    };
    const fixtures = [
      {
        model: "User",
        data: existUser
      }
    ];

    await SequelizeFixtures.loadFixtures(fixtures, { User: UserModel });

    try {
      const res = await request(app)
        .put("/users/e12f3391-58e8-4e6a-9db4-f6fab0b728ce")
        .accept("application/json")
        .set("Content-Type", "application/json")
        .send({ login: "UpdatedUserLogin", password: "12abcd3456", age: 22 })
        .expect(200);

      expect(res.body.id).toEqual("e12f3391-58e8-4e6a-9db4-f6fab0b728ce");
      expect(res.body.login).toEqual("UpdatedUserLogin");
    } catch (error) {
      console.error(error);
    }
  });
});

describe("User route DELETE /:id", () => {
  beforeEach(async () => {
    await truncate();
    jest.resetAllMocks();
  });

  it("should be return status 200 and deleted user", async () => {
    const app = initApp();
    const existUser = {
      id: "e12f3391-58e8-4e6a-9db4-f6fab0b728ce",
      login: "UserLogin",
      password: "123456",
      age: 22,
      isDeleted: false
    };
    const fixtures = [
      {
        model: "User",
        data: existUser
      }
    ];

    await SequelizeFixtures.loadFixtures(fixtures, { User: UserModel });

    try {
      const res = await request(app)
        .delete("/users/e12f3391-58e8-4e6a-9db4-f6fab0b728ce")
        .accept("application/json")
        .expect(200);

      expect(res.body.id).toEqual("e12f3391-58e8-4e6a-9db4-f6fab0b728ce");
      expect(res.body.login).toEqual("UserLogin");
      expect(res.body.isDeleted).toEqual(true);
    } catch (error) {
      console.error(error);
    }
  });

  it("should be return status 400 if user not found", async () => {
    const app = initApp();
    const existUser = {
      id: "e12f3391-58e8-4e6a-9db4-f6fab0b728ce",
      login: "UserLogin",
      password: "123456",
      age: 22,
      isDeleted: false
    };
    const fixtures = [
      {
        model: "User",
        data: existUser
      }
    ];

    await SequelizeFixtures.loadFixtures(fixtures, { User: UserModel });

    try {
      const res = await request(app)
        .delete("/users/9e4250f1-b8b7-4528-b78e-317fb37cebe4")
        .accept("application/json")
        .expect(400);
    } catch (error) {
      console.error(error);
    }
  });
});

describe("User route GET /suggest/:loginSubstring", () => {
  it("should be return found user", async () => {
    const app = initApp();
    const fixtures = [
      {
        model: "User",
        data: {
          id: "e12f3391-58e8-4e6a-9db4-f6fab0b728ce",
          login: "UserLogin",
          password: "123456",
          age: 22,
          isDeleted: false
        }
      },
      {
        model: "User",
        data: {
          id: "9e4250f1-b8b7-4528-b78e-317fb37cebe4",
          login: "userLogin",
          password: "123456",
          age: 22,
          isDeleted: false
        }
      }
    ];

    await SequelizeFixtures.loadFixtures(fixtures, { User: UserModel });

    try {
      const { body } = await request(app)
        .get("/users/suggest/user")
        .query({ limit: 2 })
        .accept("application/json")
        .expect(200);

      expect(body.length).toEqual(1);
      expect(body[0].login).toEqual("userLogin");
    } catch (error) {
      console.error(error);
    }
  });
});
