import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let authenticateUserUseCase: AuthenticateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;


describe("Authenticate user", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to authenticate a user", async () => {
    const user = {
      name: "Name Test",
      email: "email@test.com",
      password: "test"
    }

    await createUserUseCase.execute(user);

    const response = await authenticateUserUseCase.execute({
      email: "email@test.com",
      password: "test"
    });

    expect(response).toHaveProperty("token");
    expect(response).toHaveProperty("user");
    expect(response.user).toHaveProperty("id");
  });

  it("should not be able to authenticate with incorrect email or password", () => {
    expect(async () => {
      const user = {
        name: "Name Test",
        email: "email@test.com",
        password: "test"
      }

      await createUserUseCase.execute(user);

      await authenticateUserUseCase.execute({
        email: "email@test.com",
        password: "err"
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
