const Loadable = require('./Loadable')
const axios = require("axios")
const Comment = require('./Comment')
const Type = require('./Type')

module.exports = class Clinic extends Loadable {
    constructor(id){
        super({
            url: `https://api.beautyglobalclub.com/beauty/clinics/${id}/`
        })
        this.id = id;
    }
    title(){
        return new Promise(resolve => {
            this.getData()
                .then(data => {
                    resolve(data.title)
                })
        })
    }
    description(){
        return new Promise(resolve => {
            this.getData()
                .then(data => resolve(data.description))
        })
    }
    addres() {
        return new Promise(resolve => {
            this.getData()
                .then(data => resolve(data.address))
        })
    }
    avg_rating() {
        return new Promise(resolve => {
            this.getData()
                .then(data => resolve(data.avg_rating))
        })
    }
    images() {
        return new Promise(resolve => {
            this.getData()
                .then(data => resolve(data.images))
        })
    }
    special_offers() {
        return new Promise(resolve => {
            this.getData()
                .then(data => resolve(data.special_offers))
        })
    }
    comments(){
        return new Promise(resolve => {
            axios.post("https://api.beautyglobalclub.com/beauty/comments/", {
                clinic_ids: [this.id]
            })
                .then(res => resolve(res.data.results.map(comm => new Comment(comm.email, comm.body, comm.avg_rating))))
        })
    }
    service_types() {
        return new Promise(resolve => {
            axios.get("https://api.beautyglobalclub.com/beauty/service-types/", {
                params: {
                    clinic_id: this.id
                }
            })
                .then(res => resolve(res.data.results.map(type => new Type(type.id, type.title, type.clinic_services_count))))
        })
    }
}