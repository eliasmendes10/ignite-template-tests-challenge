import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { AppError } from "@shared/errors/AppError";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Authenticate User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(
      inMemoryUsersRepository
    );
  });

  it("Should be able to authenticate a user", async () => {
    const password = "123456";
    const { email } = await createUserUseCase.execute({
      name: "Test User",
      email: "email.teste@teste.com",
      password: password,
    });

    expect(
      await authenticateUserUseCase.execute({
        email,
        password,
      })
    ).toHaveProperty("token");
  });

  it("Should not be able to authenticate a no-existent email", () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "test@test.com",
        password: "123456",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("Should not be able to authenticate a user with incorrect password", async () => {
    const password = "123456";
    const { email } = await createUserUseCase.execute({
      name: "Test User",
      email: "email.teste@teste.com",
      password: password,
    });

    expect(async () => {
      await authenticateUserUseCase.execute({
        email,
        password: "pass_error",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});
