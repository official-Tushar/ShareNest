import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { addFeed } from "../utils/feedSlice";
import { useEffect } from "react";
import UserCard from "./UserCard";
import noFeedImage from "../assets/images/no-feed.png"

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();

  const getFeed = async () => {
    if (feed && feed.length > 0) return;
    try {
      const res = await axios.get(BASE_URL + "/user/feed", {
        withCredentials: true,
      });
      dispatch(addFeed(res.data));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  if (!feed) return;

  if (feed.length === 0)
    return (
      <div className="flex flex-col mt-8 items-center justify-center w-full h-[100vh]">
        <img src={noFeedImage} alt="no-feed" className="xl:w-1/5 lg:w-1/4 md:w-1/3 sm:w-3/7 w-1/2 mb-3" />
        <h1 className="text-sm sm:text-lg md:text-xl font-bold text-white">
          You are all caught up!
        </h1>
        <h2 className="text-gray-200 md:text-lg sm:text-sm text-xs">
          No new faces for now.
        </h2>
      </div>
    );

  return (
    feed && (
      <div className="mt-26 mb-8 w-9/10 md:w-3/4 lg:w-7/10 mx-auto">
        <UserCard user={feed[0]} />
      </div>
    )
  );
};

export default Feed;
