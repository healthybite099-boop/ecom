import mongoose, { Schema } from "mongoose";

const ProductSchema = new Schema(
    {
        // Basic Info
        name: { type: String, required: true },                     // Almonds, Cashew, Raisins etc.
        slug: { type: String, required: true, unique: true },       // URL-friendly identifier
        category: { type: String,  required: true },
        type: { type: String, required: true },                     // Premium, Organic, Normal
        brand: { type: String, required: true },                    // e.g., NutHarvest, Organic India

        // Identification
        sku: { type: String, required: true, unique: true },        // SKU code
        productCode: { type: String },                              // Optional internal code
        
        // Pricing
        price: { type: Number, required: true },
        discountPercentage: { type: Number, default: 0 },           // % discount (0–100)
        finalPrice: { type: Number, required: true },               // Auto-calculated or manually added

        // Stock
        weight: { type: Number, required: true },                   // Grams
        stock: { type: Number, required: true, default: 0 },
        isAvailable: { type: Boolean, default: true },

        // Nutritional Information
        nutrition: {
            calories: { type: Number },
            protein: { type: Number },
            fat: { type: Number },
            carbs: { type: Number },
            fiber: { type: Number }
        },

        // Packaging Details
        packagingType: { type: String, required: true },            // Zip pouch / Air-tight jar
        shelfLife: { type: String, required: true },                // e.g., "6 Months"

        // Origin & Quality
        originCountry: { type: String, default: "India" },
        qualityGrade: { type: String, enum: ["A", "AA", "AAA"], default: "AA" },

        // Product Images
        images: [{ type: String, required: true }],                 // Multiple images

        // Description & Tags
        description: { type: String, required: true },
        tags: [{ type: String }],                                   // e.g., "healthy", "protein rich"

        // Ratings & Reviews
        rating: { type: Number, default: 0 },                       // Overall rating
        reviewsCount: { type: Number, default: 0 },

        // Status
        status: { type: String, enum: ["Active", "Inactive"], default: "Active" },

        defaultdata: { type: String, required: true, default: "DryFruitProduct" }
    },
    { timestamps: true }
);

const ProductModel =
    mongoose.models.DryFruitProduct2 ||
    mongoose.model("DryFruitProduct2", ProductSchema);

export default ProductModel;
