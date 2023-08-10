import * as z from "zod";

export const userValidation = z.object({
  profile_photo: z.string().url().nonempty(), //ensures that the profile photo is of a type string,a url and not empty
  name: z.string().min(3, { message: "minimum 3 charachters" }).max(30),
  user_name: z.string().min(3).max(30),
  bio: z.string().min(3).max(1000),
});
