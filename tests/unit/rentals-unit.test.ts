import rentalsRepository from "repositories/rentals-repository";
import usersRepository from "repositories/users-repository";
import { faker } from "@faker-js/faker";
import moviesRepository from "repositories/movies-repository";
import rentalsService from "services/rentals-service";




beforeEach(() => {
  jest.clearAllMocks();

});


describe("Rentals Service Unit Tests", () => {

  it("should be return erro when user not send", () => {

    const users = jest.spyOn(usersRepository, "getById").mockImplementation((): any => {
      return undefined;
    });

    const result = rentalsService.getUserForRental(55555555);
    expect(users).toBeCalledTimes(1);
    expect(result).rejects.toEqual({

      name: "NotFoundError",
      message: "User not found."
    });
  })

  it("should return an error when the film is for over 18y but the user is under 18y", () => {

    const user = {
      id: 3,
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      cpf: faker.lorem.text(),
      birthDate: new Date()
    }

    jest.spyOn(moviesRepository, "getById").mockImplementation((): any => {
      return {
        id: 6,
        name: "007 Skyfall",
        adultsOnly: true

      }
    })

    const error = rentalsService.checkMoviesValidForRental([6], user)
    expect(error).rejects.toEqual({
      name: "InsufficientAgeError",
      message: "Cannot see that movie."
    })
  })



  it("should be return error when movieId not sended", () => {

    const user = {
      id: 1,
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      cpf: faker.lorem.text(),
      birthDate: new Date()

    }

    jest.spyOn(moviesRepository, "getById").mockImplementation((): any => {
      return undefined
    })
    const error = rentalsService.checkMoviesValidForRental([12345], user)
    expect(error).rejects.toEqual({
      name: "NotFoundError",
      message: "Movie not found."
    })
  })



  it("should return an error when movieId is already rented", () => {

    const user = {
      id: 2,
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      cpf: faker.lorem.text(),
      birthDate: new Date()

    }

    jest.spyOn(moviesRepository, "getById").mockImplementation((): any => {
      return {
        id: 5,
        name: "007 Skyfall",
        adultsOnly: false,
        rentalId: 1
      }
    })

    const error = rentalsService.checkMoviesValidForRental([5], user)
    expect(error).rejects.toEqual({
      name: "MovieInRentalError",
      message: "Movie already in a rental."
    })

  })
  it("Should be return error when user have a open rental ", () => {

    const user = jest.spyOn(rentalsRepository, "getRentalsByUserId").mockImplementation((): any => {
      return [{
        id: 1,
        date: Date.now(),
        endDate: Date.now(),
        userId: 1,
        closed: false
      }]
    })

    const error = rentalsService.checkUserAbleToRental(1)
    expect(user).toBeCalledTimes(1)
    expect(error).rejects.toEqual({
      name: "PendentRentalError",
      message: "The user already have a rental!"
    })
  })





})