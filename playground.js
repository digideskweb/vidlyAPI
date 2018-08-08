
const Joi = require('joi');

console.log(typeof Joi);


class MyClass {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    
    get bio() {
        return `${this.name} is ${this.age} years old`;
    }
}


let mahmud = new MyClass("Mahmud", 26)
console.log(mahmud.bio);

console.log(typeof mahmud);
console.log(typeof MyClass);
