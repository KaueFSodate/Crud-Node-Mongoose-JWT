const mongoose = require('mongoose')


async function main(){

    try {
        mongoose.connect("mongodb://127.0.0.1:27017/OLX")
        console.log("Conectado ao mongoose")
    } catch (error) {
        console.log(error)
    }
}

main()

module.exports = mongoose