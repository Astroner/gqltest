const axios = require('axios')

const subs = Symbol("subs")
const data = Symbol("data")
const loaded = Symbol("loaded")

module.exports = class Loadable {
    constructor(requestParams){

        this[subs] = [];

        axios(requestParams)
            .then(response => {
                this[data] = response.data;
                this[loaded] = true
                this[subs].forEach(i => i(response.data))
            })
            .catch(console.log)
    }

    getData(){
        return new Promise(resolve => {
            if(this[loaded]){
                resolve(this[data])
            }else{
                this[subs].push(resolve)
            }
        })
    }

}