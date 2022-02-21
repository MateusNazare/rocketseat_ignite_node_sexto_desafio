import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let showUserProfileUseCase: ShowUserProfileUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;


describe("Authenticate user", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to show a user", async () => {
    const user = {
      name: "Name Test",
      email: "email@test.com",
      password: "test"
    }

    const userResponse = await createUserUseCase.execute(user);

    const users = await showUserProfileUseCase.execute(userResponse.id!);

    expect(users).toHaveProperty("id");
  });

  it("should not be able to show a inexistent user", () => {
    expect(async () => {
      await showUserProfileUseCase.execute("err");
    }).rejects.toBeInstanceOf(AppError);
  });
});
