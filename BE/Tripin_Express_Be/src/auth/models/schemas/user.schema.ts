import { SchemaOptions } from "../../../db/models/schema-options"

export interface User {
  userId?: string;
  email: string;
  password: string;
  name: string;
  imageUrl: string; //link to blob storage for images
  createdAt: string;
  updatedAt: string;
}

export const userSchemaOptions: SchemaOptions<User> = {
  schemaInfo: {
    userId: {
      type: BigInt, // Define the column type
      primaryKey: true,        // Mark it as the primary key
      autoIncrement: true,     // Enable auto-increment
      required: true,         // Ensure it cannot be null,
      field: 'user_id'
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Email is invalid",
      ],
      field: 'email'
    },
    password: {
      type: String,
      required: true,
      field: 'password'
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      field: 'name'
    },
    imageUrl: {
      type: String,
      field: 'image_url',
      required: false
    }
  },
  timestamp: true, // Automatically adds `createdAt` and `updatedAt`
  // Optional: Customize field names
  createdAt: 'created_at',
  updatedAt: 'updated_at',
};
