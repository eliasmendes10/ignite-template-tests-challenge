import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Create User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("Should be able to create a new user", async () => {
    const user = await createUserUseCase.execute({
      name: "Test User",
      email: "email.teste@teste.com",
      password: "123456",
    });

    expect(user).toHaveProperty("id");
  });

  it("Should not be able to create a new user with exists email", async () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "Test User",
        email: "email.teste@teste.com",
        password: "123456",
      });

      await createUserUseCase.execute({
        name: "Test User",
        email: "email.teste@teste.com",
        password: "123456",
      });
    }).rejects.toBeInstanceOf(CreateUserError);
  });
});
