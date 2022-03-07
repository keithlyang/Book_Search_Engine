const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async ( parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({_id: context.user.id }).select('-v-password')

                return userData;
            }

            throw new AuthenticationError ("You aren't logged in!");
        },
    },
    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args)
            
            const token = signToken(user);

            return {
                token, user
            };
        },
        login: async (parent, {email, password }) => {
            const user = await User.findOne({ email});

            if (!user) {
                throw new AuthenticationError("Incorrect INFORMATION!!!");
            }

            const correctPw = await user.isCorrecPassword(password)

            if (!correctPw) {
                throw new AuthenticationError("Incorrect INFORMATION!!!");
            }

            const token = signToken(user);
            return {token, user};
        },
        saveBook: async (parent, {bookData}, context) => {
            if (context.user) {
                const updatedUser = await User.findByIdAndUpdate(
                    { _id: context.user.id },
                    { $pull: { savedBooks: bookData } },
                    { new: true }
                )
                return updatedUser;
            }
            throw new AuthenticationError("You aren't logged in!");
        },
        removeBook: async (parent, {boodId }, context ) => {
            if (context.user) {
                const user = await User.findByIdAndUpdate(
                    { _id: user.id },
                    { $pull: { savedBooks: { bookId: bookId} } },
                    { new: true }
                )
                return updatedUser;
            }
        }
    }
}

module.exports = resolvers;