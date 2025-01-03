import { fakerPL as faker } from '@faker-js/faker'


export function generatePersona() {
    return {
        fullName: faker.person.fullName(),
        age: faker.number.int({min: 18, max: 90}),
        job: faker.person.jobTitle(),
        bio: faker.person.bio(),
    };
}

console.log(generatePersona())