"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import Thread from "../models/thread.model";
import { FilterQuery, SortOrder } from "mongoose";

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

export async function fetchUserPosts(userId: string) {
  try {
    connectToDB();
    //Find all threads authored by the user with the given UserId

    //TO DO POPULATE COMMUNTIIES

    const threads = await User.findOne({ id: userId }).populate({
      path: "threads",
      model: Thread,
      populate: {
        path: "children",
        model: Thread,
        populate: {
          path: "author",
          model: User,
          select: "name image id",
        },
      },
    });
    return threads;
  } catch (error: any) {
    throw new Error(`Failed to fetch post ${error.message}`);
  }
}

export async function fetchUsers({
  userId,
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: {
  userId: string;
  searchString?: string; //it means it's optional
  pageNumber?: number;
  pageSize?: number;
  sortBy: SortOrder; //mongodb data type
}) {
  try {
    connectToDB();

    const skipAmount = (pageNumber - 1) * pageSize;
    const regex = new RegExp(searchString, "i"); // We are making a regular expression | the "i" means it's case insensitive

    const query: FilterQuery<typeof User> = {
      id: { $ne: userId }, //this will filter out our current user
    };

    if (searchString.trim() !== "") {
      //get rid of the blank spaces and the beggining & end of a string AND prevent empty strings.
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } }, //this will search by either username/name
      ];
    }

    const sortOptions = { createdAt: sortBy }; //Sorts it based on date in descending order

    const usersQuery = User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    const totalUserCount = await User.countDocuments(query); // count total number of documents

    const users = await usersQuery.exec(); // after creating the querry with execute it

    const isNext = totalUserCount > skipAmount + users.length;

    return { users, isNext };
  } catch (error: any) {
    throw new Error(`Failed to fetch Users ${error.message}`);
  }
}

export async function getActivity(userId: string) {
  try {
    connectToDB();

    //find all threads created by a user

    const userThreads = await Thread.find({ author: userId }); //get all threads where the author is the current user

    //Collect all the child thread ids (replies) from the children field

    const childThreadIds = userThreads.reduce((acc, userThread) => {
      return acc.concat(userThread.children);
    }, []); //accumulates all the children comments of the post in a single array

    const replies = await Thread.find({
      _id: { $in: childThreadIds },
      author: { $ne: userId },
    }).populate({
      path: "author",
      model: User,
      select: "name image _id",
    });

    return replies;
  } catch (error: any) {
    throw new Error(`Failed to fetch activites ${error.message}`);
  }
}
