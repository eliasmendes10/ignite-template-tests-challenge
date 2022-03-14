import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let createUserUseCase: CreateUserUseCase;
let showUserProfile: ShowUserProfileUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Show User Profile", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    showUserProfile = new ShowUserProfileUseCase(inMemoryUsersRepository);
  });

  it("Should be able to show a user profile", async () => {
    const user = await createUserUseCase.execute({
      name: "Test User",
      email: "email.teste@teste.com",
      password: "123456",
    });

    expect(async () => {
      await showUserProfile.execute(user.id);
    }).toHaveProperty("name");
  });

  it("Should not be able to show a inexistent user profile", () => {
    expect(async () => {
      await showUserProfile.execute("1234");
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});
