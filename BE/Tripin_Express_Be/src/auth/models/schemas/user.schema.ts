import { SchemaOptions } from "../../../db/models/schema-options"

export interface User {
  _id: string;
  email: string;
  password: string;
  name: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

export const userSchemaOptions: SchemaOptions<User> = {
  schemaInfo: {
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Email is invalid",
      ],
    },
    password: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: [true, "Name is required"]
    }
  },
  timestamp: true
};
