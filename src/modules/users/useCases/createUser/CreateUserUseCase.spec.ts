import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase"

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Create User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  })

  it("should be able to create a new user", async () => {
    const user = {
      name: "Name Test",
      email: "email@test.com",
      password: "test"
    }

    const userResponse = await createUserUseCase.execute(user);

    expect(userResponse).toHaveProperty("id");
  });

  it("should not be able to create a user with existing email", () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "Existing name",
        email: "existing@email.com",
        password: "test",
      });

      const user = await createUserUseCase.execute({
        name: "Existing name",
        email: "existing@email.com",
        password: "test",
      });
    }).rejects.toBeInstanceOf(AppError);
  });
})
