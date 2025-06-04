import { useSelector} from "react-redux";
import { useNavigate } from "react-router-dom";
import pageNotFound from "../assets/images/page-not-found.png";

const PageNotFound = () => {
  const user = useSelector((store) => store.user);
  const navigate = useNavigate();
  const handleClick = () => {
    if(!user){
      navigate("/login");
    }
    else{
      navigate("/");
    }
  }
  return (
  <div className="flex flex-col mt-26 mb-8 items-center justify-center w-full">
    <img src={pageNotFound} alt = "pageNotFound" className="xl:w-1/5 lg:w-1/4 md:w-1/3 sm:w-3/7 w-1/2 mb-3"/>
    <br/>
    <button className="btn btn-primary h-fit py-1 sm:py-2 text-xs md:text-sm" onClick={handleClick}>
      Go to Feed
    </button>
  </div>
)};

export default PageNotFound;
