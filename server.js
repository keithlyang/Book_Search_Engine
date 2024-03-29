const express = require('express');
const path = require('path');
const { ApolloServer } = require('apollo-server-express');
const db = require('./config/connection');
const { typeDefs, resolvers } = require('./schema')

const app = express();
const PORT = process.env.PORT || 3001;
const server = new ApolloServer ({
  typeDefs,
  resolvers,
})

server.applyMiddleware({ app });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get('*', (req, res) => {
  res.sendFile(path.join(_dirname, '../client/build/index.html'))
})

db.once('open', () => {
  app.listen(PORT, () => console.log(`Now listening on localhost:${PORT}${server.graphqlPath}`));
});