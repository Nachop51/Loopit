import useAuth from "../hooks/useAuth";
import LoadingSpinner from "../assets/Loading.gif";
import Logo from "./Logo";
import Nav from "./NavBar";
import Footer from "./Footer";
import ErrorPage from "./404";
import LoopitApp from "./Loopit";
import CreateLoop from "./pages/CreateLoop";
import Saved from "./pages/Saved/";
import Account from "./pages/Account";
import Comments from "./pages/Comments";
import Users from "./pages/Users";
import SearchLoops from "./SearchLoops";

import { Routes, Route } from "react-router-dom";

const Appliaction = ({ userStatus, id }) => {
  useAuth(userStatus);

  if (!userStatus) {
    return (
      <>
        <img src={LoadingSpinner} alt="Spinner" className="spinner" />
      </>
    );
  }

  return (
    <>
      <Nav>
        <Logo link="/l" oC="navbar-logo" />
      </Nav>
      <Routes>
        <Route index element={<LoopitApp />} />
        <Route path="create-loop" element={<CreateLoop user_id={id} />} />
        <Route path="saved" element={<Saved />} />
        <Route path="account" element={<Account />} />
        <Route path="users">
          <Route path=":username" element={<Users />} />
          <Route path="*" element={<ErrorPage />} />
        </Route>
        <Route path="comments">
          <Route path=":id" element={<Comments />} />
          <Route path="*" element={<ErrorPage />} />
        </Route>
        <Route path="search">
          <Route path=":term" element={<SearchLoops />} />
          <Route path="*" element={<ErrorPage />} />
        </Route>
        <Route path="*" element={<ErrorPage />} />
      </Routes>
      <Footer />
    </>
  );
};

export default Appliaction;
