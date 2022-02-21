import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;
let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Get Statement Operation", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository,
    );
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("should be able to get one statement operation of an user", async () => {
    const user = await createUserUseCase.execute({
      name: "Name Test",
      email: "email@test.com",
      password: "test"
    });

    const statement = await createStatementUseCase.execute({
      user_id: user.id!,
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "new statement",
    });

    const statementOperation = await getStatementOperationUseCase.execute({
      user_id: user.id!,
      statement_id: statement.id!
    });

    expect(statementOperation).toHaveProperty("id");
  });

  it("should not be able to get one statement operation of an inexistent statement", async () => {
    await expect(async () => {
      const user = await createUserUseCase.execute({
        name: "Name Test",
        email: "email@test.com",
        password: "test"
      });

      await getStatementOperationUseCase.execute({
        user_id: user.id!,
        statement_id: "err"
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });

  it("should not be able to get one statement operation of an inexistent user", async () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        name: "Name Test",
        email: "email@test.com",
        password: "test"
      });

      const statement = await createStatementUseCase.execute({
        user_id: user.id!,
        type: OperationType.DEPOSIT,
        amount: 100,
        description: "new statement",
      });

      await getStatementOperationUseCase.execute({
        user_id: "err",
        statement_id: statement.id!
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });
});
