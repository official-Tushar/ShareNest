import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { removeUser } from "../utils/userSlice";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { clearFeed } from "../utils/feedSlice";

const Navbar = () => {
  const user = useSelector((store) => store.user);
  console.log(user);
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, {
        withCredentials: true,
      });
      dispatch(removeUser());
      dispatch(clearFeed());
      return navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="navbar bg-base-300 shadow-sm fixed top-0 z-10">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost">
          <img src="/logo-SplitNest.png" alt="logo" className="hidden sm:inline md:w-55 md:h-10 sm:w-44 sm:h-8"/>
          <img src="/logo-SplitNest-sm.png" alt="sm-logo" className="inline sm:hidden h-7/8"/>
        </Link>
      </div>

      {user && (
        <>
          <p className="hidden sm:inline sm:text-sm md:text-[16px]">Welcome, {user?.firstName || user?.data?.firstName}</p>
          <div className="dropdown dropdown-end mx-5">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="h-9/10 sm:w-10 rounded-full">
                <img alt="User Avatar" src={user?.photoUrl || user?.data?.photoUrl} />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-200 rounded-box z-1 mt-3 w-40 p-2 shadow"
            >
              <li>
                <Link to="/profile" className="justify-between text-sm">
                  Profile
                </Link>
              </li>
              <li>
                <Link to='/user/connections' className="text-sm">Connections</Link>
              </li>
              <li>
                <Link to='/user/requests/received' className="text-sm">Requests</Link>
              </li>
              <li>
                <a onClick={handleLogout} className="text-sm cursor-pointer">Logout</a>
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default Navbar;
