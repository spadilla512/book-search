const { User } = require("../models");
const { signToken, AuthenticationError } = require("../utils/auth");

const resolvers = {
    Query: {
        me: async (parent, {userId}, context) => {
            return User.findOne({ _id: userId });
            },
        },
    Mutation: {
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
            if (!user) {
                throw AuthenticationError;
            }
            const correctPassword = await user.isCorrectPassword(password);
            console.log(!isCorrectPassword);
            if (!correctPassword) {
                throw AuthenticationError;
            }
            const token = signToken(user);
            return { token, user };
        },
        addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);
            return { token, user };
        },
        saveBook: async (parent, {input}, context) => {
            if (context.user) {
                const updatedUser = await User.findByIdAndUpdate(
                    {
                        _id: context.user._id,
                    },
                    {
                        $push: {
                            savedBooks: input
                        },
                    },
                    { new: true, runValidators: true}
                );
                return updatedUser;
            }
            throw AuthenticationError;
            ('You need to login');
        },
        removeBook: async (parent, { userId, bookId }, context) => {
            if (context.user) {
                return await User.findByIdAndUpdate(
                    {
                        _id: context.user._id,
                    },
                    {
                        $pull: {
                            savedBooks: {
                                bookId: bookId,
                            },
                        },
                    },
                    { new: true }
                );
            }
        },
    },
};

module.exports = resolvers;