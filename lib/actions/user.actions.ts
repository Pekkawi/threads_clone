"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";

interface Params {
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
}

//update the user
export async function updateUser({
  userId,
  username,
  name,
  bio,
  image,
  path,
}: Params): Promise<void> {
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
    console.log(error);
  }
}

export async function fetchUser(userId: string) {
  try {
    connectToDB();

    return await User.findOne({ id: userId });
    // .populate({
    //   path:"communities",
    //   model:Community
    // })
  } catch (error: any) {
    throw new Error(`Failed to fetch user ${error.message}`);
  }
}
