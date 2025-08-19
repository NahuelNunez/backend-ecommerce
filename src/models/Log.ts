import { Schema, model } from "mongoose"

const logSchema = new Schema(
  {
    id: { type: Number, required: true, unique: true },
    userId: { type: Number, required: true },
    action: {
      type: String,
      enum: [
        "CREATE_PRODUCT",
        "UPDATE_PRODUCT",
        "DELETE_PRODUCT",
        "ENABLE_PRODUCT",
        "DISABLE_PRODUCT",
        "CREATE_CATEGORY", 
        "UPDATE_CATEGORY", 
        "DELETE_CATEGORY",
        "ENABLE_CATEGORY",
        "DISABLE_CATEGORY",
         
      ],
      required: true,
    },
    resourceId: { type: Number, required: true }, 
    resourceName: { type: String, required: true },
    description: { type: String, required: true },
  },
  {
    timestamps: true,
  },
)

logSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret._id
    delete ret.__v
  },
})

export const Log = model("logs", logSchema)
