import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { addRequest, removeRequest } from "../utils/requestSlice";
import { useState, useEffect } from "react";
import noRequestsFound from "../assets/images/no-new-requests.png"
import { TiTick } from "react-icons/ti";
import { ImCross } from "react-icons/im";

const Requests = () => {
  const [expandedId, setExpandedId] = useState(null);
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();

  const reviewRequest = async (status, _id) => {
    try {
      await axios.post(
        `${BASE_URL}/request/review/${status}/${_id}`,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequest(_id));
    } catch (err) {
      console.log(err);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/requests/received", {
        withCredentials: true,
      });
      dispatch(addRequest(res.data.data));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (!requests) return null;

  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center w-full mt-26 mb-8">
        <img src={noRequestsFound} alt="no-new-requests" className="w-1/4 sm:w-1/6 lg:w-1/8 mb-3"/>
        <h1 className="text-sm sm:text-lg md:text-xl font-bold text-white">
          Nothing new has come in yet.
        </h1>
        <h2 className="text-gray-200 md:text-lg sm:text-sm text-xs">
          You're all clear.
        </h2>
      </div>
    );
  }

  return (
    <div className="mt-26 mb-8">
      <h1 className="text-xl md:text-2xl font-bold text-center my-3">
        Connection Requests
      </h1>

      {requests.map((req) => {
        const {
          _id,
          photoUrl,
          firstName,
          lastName,
          city,
          age,
          about,
          gender,
          preferences,
        } = req.fromUserId;

        const isExpanded = expandedId === req._id;

        return (
          <div key={_id} className="w-9/10 md:w-2/3 lg:w-3/5 xl:w-1/2 mx-auto my-5">
            {/* Card */}
            <div className="card sm:card-side bg-base-300 shadow-sm">
              <div className="sm:p-5 pt-5">
                <figure>
                  <img
                    className="rounded-full w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32"
                    src={photoUrl}
                    alt="user"
                  />
                </figure>
              </div>
              <div className="card-body my-auto mx-auto">
                <div className="card-title text-[16px] sm:text-lg lg:text-xl font-bold sm:mx-0 mx-auto">
                  {firstName + " " + lastName}
                </div>
                {city && <div className="italic text-sm sm:text-[16px] lg:text-lg sm:mx-0 mx-auto">{city}</div>}
                {(age || gender) && (
                  <div className="text-xs sm:text-sm lg:text-[16px] sm:mx-0 mx-auto">{[age, gender].filter(Boolean).join(", ")}</div>
                )}
              </div>
              <div className="sm:my-auto card-actions px-5 hidden xs:flex mb-5">
                <button
                  className="btn btn-secondary h-fit py-2"
                  onClick={() => reviewRequest("accepted", req._id)}
                >
                  Accept
                </button>
                <button
                  className="btn btn-primary h-fit py-2"
                  onClick={() => reviewRequest("rejected", req._id)}
                >
                  Reject
                </button>
              </div>

              <div className="card-actions px-5 xs:hidden flex mb-5">
                <button
                  className="btn btn-secondary h-fit py-2"
                  onClick={() => reviewRequest("accepted", req._id)}
                >
                  <TiTick />
                </button>
                <button
                  className="btn btn-primary h-fit py-2"
                  onClick={() => reviewRequest("rejected", req._id)}
                >
                  <ImCross />
                </button>
              </div>
              {/* Show More */}
            <p
              className="italic cursor-pointer text-sm text-blue-600 hover:underline absolute bottom-4 right-4"
              onClick={() =>
                setExpandedId(isExpanded ? null : req._id)
              }
            >
              {isExpanded ? "Show Less" : "Show More"}
            </p>
            </div>

            

            {/* Expanded Section */}
            {isExpanded && (
              <div className="mt-2 bg-base-100 border rounded-2xl border-black">
                {about !== "This is the default about of the user" && (
                  <>
                    <p className="font-semibold bg-base-300 px-4 py-2 rounded-t-2xl text-sm sm:text-[16px] lg:text-lg">About</p>
                    <p className="mb-2 p-3 text-xs sm:text-sm lg:text-[16px]">{about}</p>
                  </>
                )}
                {preferences.length > 0 && (
                  <>
                    <p className="font-semibold mb-1 bg-base-300 px-4 py-2 text-sm sm:text-[16px] lg:text-lg">Preferences</p>
                    <div className="flex flex-wrap gap-2 p-3">
                      {preferences.map((pref, index) => (
                        <span
                          key={index}
                          className="bg-blue-500 text-white px-3 py-2 rounded-full hover:bg-blue-600 text-xs sm:text-sm lg:text-[16px]"
                        >
                          {pref}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Requests;
