const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password')
    process.exit(1)
}   
const password = process.argv[2]
const url =
  `mongodb+srv://fullstack:${password}@cluster0.lbdnpsa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length == 3) {
    queryPhonebook()
}
else {
    addToPhonebook()
}
function queryPhonebook() {
    Person.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(person => {
            console.log(person.name, person.number)
        })
        mongoose.connection.close()
    })

}
function addToPhonebook() {
    if (process.argv.length < 5) {
        console.log('give password, name and number')
        process.exit(1)
    }
    const name = process.argv[3]
    const number = process.argv[4]
    const person1 = new Person({
        name: name,
        number: number
    })
    person1.save().then(result => {
    console.log(`Added ${name} ${number} to phonebook`)
    mongoose.connection.close()
})
}

