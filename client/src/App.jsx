import { BrowserRouter, Route, Routes } from "react-router-dom";
import Body from "./components/Body";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Feed from "./components/Feed";
import { Provider } from "react-redux";
import appStore from "./utils/appStore";
import Connections from "./components/Connections";
import Requests from "./components/Requests";
import PageNotFound from "./components/PageNotFound";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ScrollToTop from "./components/ScrollToTop";
import Chat from "./components/Chat";
import ViewProfile from "./components/ViewProfile";


function App() {
  return (
    <div>
    <Provider store={appStore}>
      <BrowserRouter basename="/">
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Body/>}>
            <Route path="/" element={<Feed/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/profile" element={<Profile/>}/>
            <Route path="/user/connections" element={<Connections/>}/>
            <Route path="/user/requests/received" element={<Requests/>}/>
            <Route path="/profile/view/:targetUserId" element={<ViewProfile />} />
            <Route path="/chat/:targetUserId" element={<Chat/>}/>
            <Route path="*" element={<PageNotFound />} />
          </Route>
        </Routes>
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          toastClassName="custom-toast"
          bodyClassName="custom-toast-body"
        />
      </BrowserRouter>
    </Provider>
    </div>

  );
}

export default App;
