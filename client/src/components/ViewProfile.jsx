import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import UserCard from "../components/UserCard";

const ViewProfile = () => {
  const [isFriend, setIsFriend] = useState(false);
  const { targetUserId } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/profile/view/${targetUserId}`, {
        withCredentials: true,
      });
      setUser(res.data);
      setIsFriend(res.data.isFriend);
    } catch (err) {
      setError(
        err.response?.data?.error || "Failed to load profile. Try again later."
      );
      console.error("Error fetching profile:", err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [targetUserId]);

  const handleMessage = (userId) => {
    navigate(`/chat/${userId}`);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (error) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-red-500 font-semibold text-lg">
        {error}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="mt-24 px-5 max-w-[90%] mx-auto mb-8">
      <h1 className="text-center text:xl md:text-2xl mb-6">
        <span className="italic">Meet</span> <span className="font-semibold">{user.firstName} {user.lastName} </span>
      </h1>
      <UserCard
        user={user}
        isFriend={isFriend}
        onMessage={handleMessage}
        onGoBack={handleGoBack}
      />
    </div>
  );
};

export default ViewProfile;
