const userUtils = require("./user");
const registerUser = require("./register");

const users = [
	{
		firstName: "Jan",
		lastName: "Kowalski",
		role: "doctor",
		username: "doctor1",
		password: "password",
		age: "40",
		gender: "male",
		address: "ul. Warszawska 1",
		phoneNumber: "123456789",
		specialization: "cardiology",
	},
	{
		firstName: "Anna",
		lastName: "Nowak",
		role: "doctor",
		username: "doctor2",
		password: "password",
		age: "35",
		gender: "female",
		address: "ul. Krakowska 2",
		phoneNumber: "987654321",
		specialization: "dermatology",
	},
	{
		firstName: "Janina",
		lastName: "Kowalska",
		role: "patient",
		username: "patient1",
		password: "password",
		age: "60",
		gender: "female",
		address: "ul. Gdańska 3",
		phoneNumber: "111222333",
	},
	{
		firstName: "Andrzej",
		lastName: "Nowakowski",
		role: "patient",
		username: "patient2",
		password: "password",
		age: "25",
		gender: "male",
		address: "ul. Poznańska 4",
		phoneNumber: "444555666",
	},
];

async function registerDefaultUser() {
	for (const user of users) {
		const hashedPassword = await userUtils.encryptPassword(user.password);
		if (user.role === "doctor") {
			await registerUser(user.firstName, user.lastName, user.role, user.username, hashedPassword, user.age, user.gender, user.address, user.phoneNumber, user.specialization);
		} else {
			await registerUser(user.firstName, user.lastName, user.role, user.username, hashedPassword, user.age, user.gender, user.address, user.phoneNumber);
		}
	}
}

registerDefaultUser()