import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { addFeed } from "../utils/feedSlice";
import { useEffect, useState } from "react";
import UserCard from "./UserCard";
import { CiSearch } from "react-icons/ci";
import noFeedImage from "../assets/images/no-feed.png";
import { FaLocationDot } from "react-icons/fa6";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();

  const [inputValue, setInputValue] = useState(""); // Local input state
  const [cityFilter, setCityFilter] = useState(""); // Actual filter used
  const [loading, setLoading] = useState(false);

  const [citySuggestions, setCitySuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentChunk, setCurrentChunk] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [page, setPage] = useState(1);
  const [isLastChunk, setIsLastChunk] = useState(false);
  const [pendingPage, setPendingPage] = useState(null);
  // const [navDirection, setNavDirection] = useState("forward");
  const limit = 5;

  // Remove allCities and its useEffect
  // Add backend-driven city suggestion fetching
  useEffect(() => {
    if (!inputValue || inputValue.length < 2) {
      setCitySuggestions([]);
      return;
    }
    const handler = setTimeout(() => {
      const url =
        BASE_URL + `/api/city/suggest?q=${encodeURIComponent(inputValue)}`;
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          setCitySuggestions(
            data.map((c) => ({
              label: `${c.name}`,
              id: `${c.name}`,
            }))
          );
        })
        .catch(() => setCitySuggestions([]));
    }, 400); // 400ms debounce

    return () => clearTimeout(handler);
  }, [inputValue]);

  const getFeedChunk = async (
    city = "",
    pageNum = 1,
    direction = "forward"
  ) => {
    setLoading(true);
    try {
      const url = city
        ? `${BASE_URL}/user/feed?city=${encodeURIComponent(
            city
          )}&page=${pageNum}&limit=${limit}`
        : `${BASE_URL}/user/feed?page=${pageNum}&limit=${limit}`;
      const res = await axios.get(url, { withCredentials: true });
      if (res.data.length > 0) {
        setCurrentChunk(res.data);
        setIsLastChunk(res.data.length < limit);
        if (direction === "backward") {
          setCurrentIndex(res.data.length - 1);
        } else {
          setCurrentIndex(0);
        }
        setPage(pageNum);
        dispatch(addFeed(res.data));
      } else if (direction === "forward") {
        setIsLastChunk(true);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      setPendingPage(null);
    }
  };

  useEffect(() => {
    setPage(1); // Always reset page to 1
    // setNavDirection("forward"); // Always reset direction to forward
    getFeedChunk(cityFilter, 1, "forward");
    // eslint-disable-next-line
  }, [cityFilter]);

  const handleNext = () => {
    if (currentIndex < currentChunk.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (!isLastChunk && !pendingPage) {
      setPendingPage(page + 1);
      // setNavDirection("forward");
      // Do NOT setPage here!
      getFeedChunk(cityFilter, page + 1, "forward");
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (page > 1 && !pendingPage) {
      setPendingPage(page - 1);
      // setNavDirection("backward");
      // Do NOT setPage here!
      getFeedChunk(cityFilter, page - 1, "backward");
    }
  };

  if (loading)
    return (
      <div className="flex flex-col mt-8 items-center justify-center w-full h-[100vh]">
        <span className="loading loading-spinner loading-xl"></span>
        <h1 className="text-lg font-bold text-white">Loading...</h1>
      </div>
    );

  if (!feed) return;

  if (currentChunk.length === 0 && page === 1 && !loading)
    return (
      <>
        <div className="flex justify-center w-full mt-22 mb-0 relative">
          <input
            className="border border-gray-400 rounded-l-full sm:p-2 sm:pl-4 pl-2 p-1 italic focus:outline-none focus:ring-0.5 focus:ring-white focus:border-white w-1/2 sm:w-1/4 text-xs sm:text-sm md:text-[16px]"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} // allow click selection
            type="text"
            placeholder="Filter by city name"
          />
          <button
            className="border border-gray-400 rounded-r-full justify-items-center bg-base-300 cursor-pointer sm:px-4 xs:px-3 px-2"
            onClick={() => {
              setCityFilter(inputValue);
            }}
          >
            <CiSearch className="sm:text-3xl xs:text-2xl text-xl" />
          </button>

          {showSuggestions && citySuggestions.length > 0 && (
            <div className="absolute top-full mt-1 bg-base-300 rounded-md shadow-md w-1/2 sm:w-1/4 z-10">
              <ul>
                {citySuggestions.map((city) => (
                  <li
                    key={city.id}
                    className="text-xs sm:text-sm md:text-[16px] px-2 py-1 sm:px-4 sm:py-2 hover:bg-base-300 cursor-pointer text-white bg-base-200"
                    onMouseDown={() => {
                      setCityFilter(city.label);
                      setInputValue(city.label);
                      setShowSuggestions(false);
                    }}
                  >
                    {city.label}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {cityFilter && (
          <div className="flex justify-center mt-2">
            <div className="bg-accent text-white font-medium px-2 py-0.5 sm:px-3 sm:py-1 rounded-full flex items-center gap-2">
              <FaLocationDot className="text-white text-xs sm:text-sm md:text-[16px]" />
              <span className="text-xs sm:text-sm md:text-[16px]">
                {cityFilter}
              </span>
              <button
                className="text-white text-sm sm:text-lg hover:text-gray-300 cursor-pointer"
                onClick={() => {
                  setCityFilter("");
                  setInputValue("");
                }}
              >
                X
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col mt-0 items-center justify-center w-full h-[85vh]">
          <img
            src={noFeedImage}
            alt="no-feed"
            className="xl:w-1/5 lg:w-1/4 md:w-1/3 sm:w-3/7 w-1/2 mb-3"
          />
          <h1 className="text-sm sm:text-lg md:text-xl font-bold text-white">
            {cityFilter
              ? "No profiles found for this city."
              : "You are all caught up!"}
          </h1>
          {!cityFilter && (
            <h2 className="text-gray-200 md:text-lg sm:text-sm text-xs">
              No new faces for now.
            </h2>
          )}
        </div>
      </>
    );

  return (
    <>
      <div className="flex justify-center w-full mt-22 mb-2 relative">
        <input
          className="border border-gray-400 rounded-l-full sm:p-2 sm:pl-4 pl-2 p-1 italic focus:outline-none focus:ring-0.5 focus:ring-white focus:border-white w-1/2 sm:w-1/4 text-xs sm:text-sm md:text-[16px]"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} // allow click selection
          type="text"
          placeholder="Filter by city name"
        />
        <button
          className="border border-gray-400 rounded-r-full justify-items-center bg-base-300 cursor-pointer sm:px-4 xs:px-3 px-2"
          onClick={() => setCityFilter(inputValue)}
        >
          <CiSearch className="sm:text-3xl xs:text-2xl text-xl" />
        </button>

        {showSuggestions && citySuggestions.length > 0 && (
          <div className="absolute top-full mt-1 bg-base-300 rounded-md shadow-md w-1/2 sm:w-1/4 z-10">
            <ul>
              {citySuggestions.map((city) => (
                <li
                  key={city.id}
                  className="text-xs sm:text-sm md:text-[16px] px-2 py-1 sm:px-4 sm:py-2 hover:bg-base-300 cursor-pointer text-white bg-base-200"
                  onMouseDown={() => {
                    setCityFilter(city.label);
                    setInputValue(city.label);
                    setShowSuggestions(false);
                  }}
                >
                  {city.label}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {cityFilter && (
        <div className="flex justify-center mt-2">
          <div className="bg-accent text-white font-medium px-2 py-0.5 sm:px-3 sm:py-1 rounded-full flex items-center gap-2">
            <FaLocationDot className="text-white text-xs sm:text-sm md:text-[16px]" />
            <span className="text-xs sm:text-sm md:text-[16px]">
              {cityFilter}
            </span>
            <button
              className="text-white text-sm sm:text-lg hover:text-gray-300 cursor-pointer"
              onClick={() => {
                setCityFilter("");
                setInputValue("");
              }}
            >
              X
            </button>
          </div>
        </div>
      )}

      <div className="mt-6 mb-8 w-11/12 md:w-3/4 lg:w-4/5 mx-auto">
        {currentChunk.length > 0 && (
          <UserCard user={currentChunk[currentIndex]} />
        )}
        {currentChunk.length > 0 && (
          <div className="flex justify-center gap-4 mt-4">
            <button
              className="btn"
              onClick={handlePrev}
              disabled={page === 1 && currentIndex === 0}
            >
              &lt;
            </button>
            <button
              className="btn"
              onClick={handleNext}
              disabled={isLastChunk && currentIndex === currentChunk.length - 1}
            >
              &gt;
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Feed;
