import mongoose from 'mongoose';

const gameManagement = new mongoose.Schema(
    {
        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            default: null
        },
        resturantName: {
            type: String,
            default: ''
        },
        resturantAddress: {
            type: String,
            default: ''
        },
        brandName: {
            type: String,
            default: ''
        },
        logo: {
            type: String,
            default: ''
        },
        options: {
            option1: {
                type: String,
                default: ''
            },
            option2: {
                type: String,
                default: ''
            },
            option3: {
                type: String,
                default: ''
            },
            option4: {
                type: String,
                default: ''
            },
            option5: {
                type: String,
                default: ''
            },
            option6: {
                type: String,
                default: ''
            },
            option7: {
                type: String,
                default: ''
            },
            option8: {
                type: String,
                default: ''
            },
            option1frequency: {
                type: Number,
                default: 0
            },
            option2frequency: {
                type: Number,
                default: 0
            },
            option3frequency: {
                type: Number,
                default: 0
            },
            option4frequency: {
                type: Number,
                default: 0
            },
            option5frequency: {
                type: Number,
                default: 0
            },
            option6frequency: {
                type: Number,
                default: 0
            },
            option7frequency: {
                type: Number,
                default: 0
            },
            option8frequency: {
                type: Number,
                default: 0
            }
        },
        wheelColorPair: {
            color1: {
                type: String,
                default: '#8497FC'
            },
            color2: {
                type: String,
                default: '#FDFDAF'
            }
        },
        buttonColor: {
            type: String,
            default: '#8497FC'
        },
        visitedMembers: {
            type: Number,
            default: 0
        },
        instagramClicks: {
            type: Number,
            default: 0
        },
        facebookClicks: {
            type: Number,
            default: 0
        },
        twitterClicks: {
            type: Number,
            default: 0
        },
        googleMapsClicks: {
            type: Number,
            default: 0
        },
        instagram: {
            type: String,
            default: ''
        },
        tiktok: {
            type: String,
            default: ''
        },
        facebook: {
            type: String,
            default: ''
        },
        googleMaps: {
            type: String,
            default: ''
        },
        twitter: {
            type: String,
            default: ''
        },
        content: {
            type: String,
            default: ''
        }
    },
    {
        timestamps: true,
    }
);

const Game = mongoose.model('Game', gameManagement);

export default Game;