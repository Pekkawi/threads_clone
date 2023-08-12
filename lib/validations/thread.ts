import * as z from "zod";

export const ThreadValidation = z.object({
  thread: z.string().nonempty().min(3, { message: "Minimum of 3 Charachters" }), //ensures that the profile photo is of a type string,a url and not empty
  accountId: z.string(),
});

export const CommentValidation = z.object({
  thread: z.string().nonempty().min(3, { message: "Minimum of 3 Charachters" }), //ensures that the profile photo is of a type string,a url and not empty
});
