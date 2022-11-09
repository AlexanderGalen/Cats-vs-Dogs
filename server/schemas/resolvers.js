const { AuthenticationError } = require('apollo-server-express');
const { User, Team, Word, Game, Move, WordList } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        user: async (parent, { userId }) => {
            return User.findOne({ _id: userId });
        },
        words: async () => {
            const allWords = await Word.find();
            let chosenWords = [];
            while (chosenWords.length < 25) {
                const word = allWords[Math.floor(Math.random() * allWords.length)];
                if (!chosenWords.includes(word)) chosenWords.push(word);
            }
            console.log(chosenWords)
            return chosenWords;
        },
        game: async (parent, { gameId }) => {
            return Game.findOne({ _id: gameId })
                .populate(
                    {
                        path: 'teamCat',
                        populate: {
                            path: 'users',
                            model: 'User'
                        }
                    })
                .populate({
                    path: 'teamDog',
                    populate: {
                        path: 'users',
                        model: 'User'
                    }
                })
                .populate({
                    path: 'wordList',
                    model: 'WordList',
                    populate: {
                        path: 'allWords',
                        model: 'Word'
                    }
                });
        }
    },

    Mutation: {
        addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);
            return { token, user };
        },

        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('No user with this email found!');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect password!');
            }

            const token = signToken(user);
            return { token, user };
        },

        addGame: async (parent, { name }) => {
            return Game.create({ name });
        },

        // wordIds should be an array of 25 word IDs, like 
        // ["636aec484933eeb2c7a668c3", "636aec484933eeb2c7a668c4", etc.]
        addWordList: async (parent, { wordIds }) => {
            const words = wordIds.map((wordId) => new Object({ _id: wordId }));
            return WordList.create({
                allWords: words
            });
        },

        addTeamCat: async (parent, { userIds }) => {
            const users = userIds.map((userId) => new Object({ _id: userId }));
            return Team.create(
                { 
                    isTeamCat: true, 
                    users: users
                });
        },

        addTeamDog: async (parent, { userIds }) => {
            const users = userIds.map((userId) => new Object({ _id: userId }));
            return Team.create(
                { 
                    isTeamCat: false, 
                    users: users
                });
        },

        updateGame: async (parent, { gameId, teamCatId, teamDogId, wordListId }) => {
            return Game.findOneAndUpdate(
                { _id: gameId },
                {
                    teamCat: { _id: teamCatId },
                    teamDog: { _id: teamDogId },
                    wordList: { _id: wordListId }
                },
                { new: true }
            );
        },
    }
};

module.exports = resolvers;