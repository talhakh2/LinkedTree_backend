import mongoose from 'mongoose';

const PriceSchema = new mongoose.Schema(
    {
        
        monthlyPlan: {
            planName: {
                type: String,
                default: 'Monthly Plan'
            },
            price:
            {   
                type: Number,
                default: 49
            },
            for_2_to_4: {
                type: Number,
                default: 44
            },
            for_5_Plus: {
                type: Number,
                default: 39
            },
            discount: {
                type: Number,
                default: 0
            },
            features: {
                feature1: {
                    type: Boolean,
                    default: true
                },
                feature2: {
                    type: Boolean,
                    default: true
                },
                feature3: {
                    type: Boolean,
                    default: true
                },
                feature4: {
                    type: Boolean,
                    default: true
                },
            }

        },

        yearlyPlan: {
            planName: {
                type: String,
                default: 'Yearly Plan'
            },
            price:
            {   
                type: Number,
                default: 588
            },
            for_2_to_4: {
                type: Number,
                default: 528
            },
            for_5_Plus: {
                type: Number,
                default: 468
            },
            discount: {
                type: Number,
                default: 0
            },
            features: {
                feature1: {
                    type: Boolean,
                    default: true
                },
                feature2: {
                    type: Boolean,
                    default: true
                },
                feature3: {
                    type: Boolean,
                    default: true
                },
                feature4: {
                    type: Boolean,
                    default: true
                },
            }

        }
    },

    {
        timestamps: true,
    }
);

const Price = mongoose.model('Price', PriceSchema);

export default Price;
