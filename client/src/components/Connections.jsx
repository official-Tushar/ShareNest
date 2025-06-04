import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect } from "react";
import { addConnection } from "../utils/connectionSlice";
import { useDispatch, useSelector } from "react-redux";
import noConnectionImage from "../assets/images/no-connection.png";
import { BsFillSendFill } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { Link } from 'react-router-dom';

const Connections = () => {
  const dispatch = useDispatch();
  const connections = useSelector((store) => store.connection);
  const fetchConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });

      console.log(res.data.data);
      dispatch(addConnection(res.data.data));
    } catch (error) {
      // handle error
      console.error(error);
    }
  };
  useEffect(() => {
    fetchConnections();
  }, []);

  if (!connections) return;

  if (connections.length === 0) {
    return (
      <div className="flex flex-col mt-8 items-center justify-center w-full h-[100vh]">
        <img
          src={noConnectionImage}
          alt="no-connection"
          className="xl:w-1/5 lg:w-1/4 md:w-1/3 sm:w-3/7 w-1/2 mb-3"
        />
        <h1 className="text-sm sm:text-lg md:text-xl font-bold text-white">
          Oops!! Looks like you are flying Solo for Now
        </h1>
        <h2 className="text-gray-200 md:text-lg sm:text-sm text-xs">
          Reach out, someone's waiting to connect!
        </h2>
      </div>
    );
  }
  console.log(connections[0].firstName);

  return (
    <div className="mt-26 mb-8">
      <h1 className="text-xl md:text-2xl font-bold text-center my-3">
        Connections
      </h1>

      {connections.map((connection) => {
        const { _id, firstName, lastName, photoUrl, age, gender, city } =
          connection;
        return (
          <div
            key={_id}
            className="card sm:card-side bg-base-300 shadow-sm w-3/4 md:w-3/5 lg:w-11/20 mx-auto my-3"
          >
            <div className="p-5">
              <figure>
                <img
                  className="rounded-full w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32"
                  src={photoUrl}
                  alt="user"
                />
              </figure>
            </div>
            <div className="flex flex-row items-center w-9/10 justify-around mx-auto">
              <div className="card-body">
                <div className="card-title text-[16px] sm:text-lg lg:text-xl font-bold">
                  {firstName + " " + lastName}
                </div>
                {city && (
                  <div className="italic text-sm sm:text-[16px] lg:text-lg">
                    {city}
                  </div>
                )}
                {(age || gender) && (
                  <div className="text-xs sm:text-sm lg:text-[16px]">
                    {[age, gender].filter(Boolean).join(", ")}
                  </div>
                )}
              </div>
              <div className="card-actions mx-5 flex flex-col items-center justify-center">
                <Link to={"/chat/" + _id}>
                  <button className="btn btn-primary h-fit py-2 hidden xs:flex">
                    Message <BsFillSendFill />
                  </button>
                </Link>
                <Link to={"/chat/" + _id}>
                  <button className="btn btn-primary h-fit py-2 xs:hidden block">
                    <BsFillSendFill />
                  </button>
                </Link>
                <Link to={`/profile/view/${_id}`}>
                  <button className="btn btn-primary h-fit py-2 hidden xs:flex">
                    View Profile <CgProfile className="text-lg"/>
                  </button>
                </Link>
                <Link to={`/profile/view/${_id}`}>
                  <button className="btn btn-primary h-fit py-2 xs:hidden block">
                    <CgProfile className="text-lg"/>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Connections;
