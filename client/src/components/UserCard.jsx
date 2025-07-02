import { useDispatch } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { removeFeed } from "../utils/feedSlice";
import { FaLocationDot } from "react-icons/fa6";

const UserCard = ({ user, isFriend = false, onMessage, onGoBack }) => {
  const {
    _id,
    firstName,
    lastName,
    photoUrl,
    about,
    age,
    gender,
    preferences,
    city,
  } = user;
  const dispatch = useDispatch();

  const handleSentRequest = async (status, userId) => {
    try {
      await axios.post(
        BASE_URL + "/request/send/" + status + "/" + userId,
        {},
        { withCredentials: true }
      );
      dispatch(removeFeed(userId));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="card sm:card-side bg-base-300 h-full shadow-sm mx-auto w-full">
      <figure className="p-5 w-full sm:w-9/20 lg:w-1/3">
        <img src={photoUrl} alt="photo" className="rounded-xl w-full" />
      </figure>
      <div className="card-body items-center text-center w-full sm:w-2/5">
        <h2 className="card-title font-bold uppercase text-xl md:text-2xl">
          {firstName + " " + lastName}
        </h2>
        {city && (
          <div className="flex items-center gap-2">
            <FaLocationDot className="text-white text-sm sm:text-[16px] md:text-lg" />
            <p className="text-sm sm:text-[16px] md:text-lg">{city}</p>
          </div>
        )}

        {(age || gender) && (
          <span className="text-xs sm:text-sm md:text-[16px]">
            {[age, gender].filter(Boolean).join(", ")}
          </span>
        )}
        {about !== "This is the default about of the user" && (
          <p className="text-xs md:text-sm">{about}</p>
        )}
        {preferences?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2 justify-center">
            {preferences.map((pref, index) => (
              <button
                key={index}
                className="bg-blue-500 text-white px-3 py-1 rounded-full hover:bg-blue-600 text-xs md:text-sm"
              >
                {pref}
              </button>
            ))}
          </div>
        )}
        <div className="card-actions mt-2">
        {isFriend ? (
          <>
            <button
              className="btn btn-primary text-xs md:text-sm"
              onClick={() => onMessage(user._id)}
            >
              Message
            </button>
            <button
              className="btn btn-secondary text-xs md:text-sm"
              onClick={onGoBack}
            >
              Go Back
            </button>
          </>
        ) : (
          <>
            <button
              className="btn btn-primary text-xs md:text-sm"
              onClick={() => handleSentRequest("ignored", user._id)}
            >
              Ignore
            </button>
            <button
              className="btn btn-secondary text-xs md:text-sm"
              onClick={() => handleSentRequest("interested", user._id)}
            >
              Interested
            </button>
          </>
        )}
      </div>
      </div>
    </div>
  );
};

export default UserCard;
