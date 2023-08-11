"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";

//update the user
export async function updateUser(
  userId: string,
  username: string,
  name: string,
  bio: string,
  image: string,
  path: string
): Promise<void> {
  //it will return a promise
  connectToDB();
  try {
    await User.findOneAndUpdate(
      {
        id: userId,
      },
      { username: username.toLowerCase(), name, bio, image, onboarded: true },
      { upsert: true } // upsert means updating + inserting
    );
    if (path === "/profile/edit") {
      revalidatePath(path); // if you are updating the profile this will revalidate it
    }
  } catch (error: any) {
    throw new Error(`Failed to create update user: ${error.message}`);
  }
}
