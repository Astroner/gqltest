const express = require("express");
const httpGl = require("express-graphql");
const { buildSchema } = require("graphql");
const axios = require("axios");

const Clinic = require("./Clinic")
const Comment = require("./Comment")

const app = express();


const PORT = 80;
const HOST = 'localhost'

const schema = buildSchema(`

    type Location {
        id: ID!
        city: String!
        country: String!
        building: String!
    }

    type Comment {
        email: String!
        text: String!
        rate: Float!
    }

    type Type {
        id: ID!
        title: String!
        service_count: Int!
    }

    type Clinic {
        id: ID!
        title: String!
        description: String
        address: Location
        avg_rating: Float!
        images: [String]
        special_offers: [String]
        comments: [Comment]
        service_types: [Type]
    }

    type Query {
        myId: String!
        clinic(id: ID!): Clinic
        comments(clinic: ID!, rate: [Int], service_type: Int): [Comment]
    }
`)

const root = {
    myId: (_, req) => new Promise(resolve => resolve(req.ip)),
    clinic: ({ id }) => new Clinic(id),
    comments: ({ clinic, rate, service_type }) => new Promise(resolve => {
        axios.post("https://api.beautyglobalclub.com/beauty/comments/", {
            data: {
                clinic_ids: clinic,
                avg_ratings: rate,
                service_type_ids: [service_type]
            }
        })
            .then(response => resolve(response.data.results.map(comm => new Comment(comm.email, comm.body, comm.avg_rating))))
    })
}

app.use("/graphql", httpGl({
    schema,
    rootValue: root,
    graphiql: true
}))

app.listen(PORT, HOST, () => console.log(`
Started on ${HOST}:${PORT}

Open ${HOST}:${PORT}/grqphql/ for demo

`))