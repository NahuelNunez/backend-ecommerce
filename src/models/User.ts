import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    id: { type: Number, required: true, unique: true },
    nombre: { type: String, required: [true, "El nombre es requerido"] },
    apellido: { type: String, required: [true, "El apellido es requerido"] },
    email: { type: String, required: [true, "El email es requerido"] },
    password: { type: String, required: [true, "La contraseña es requerida"] },
    rol: {
      type: String,
      lowercase: true,
      default: "usuario",
      enum: ["admin", "usuario", "superadmin", "operador"],
    },
    inhabilitado: { type: Boolean, default: false },
    eliminado: { type: Boolean, default: false },
  },

  {
    timestamps: true,
  }
);

userSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
  },
});

export const User = model("usuarios", userSchema);
