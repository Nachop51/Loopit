import "./Content.css";
import Laptop from "../../../assets/mockup.png";
import Card from "./Card";
import TitleAnimation from "./TitleAnimation";

import { useNavigate } from "react-router-dom";
import { FiCopy, FiDownload, FiShare2 } from "react-icons/fi";

const Content = ({ userStatus, openModal }) => {
  const navigate = useNavigate();

  const goApp = (link) => {
    navigate(link);
  };

  return (
    <main className="main">
      <section className="intro">
        <article className="intro-text">
          <h1 className="intro-text__title">
            Discover new <br /> solutions <u>daily.</u>
          </h1>
          <p className="intro-text__p">
            Loopit is a social media platform for programmers to share their
            code with the world. Create a profile, upload your code, and share
            it with your friends and followers.
          </p>
          <div className="intro-text__button-container">
            <button
              className="intro-text__button btn btn-animation btn-primary"
              onClick={() => {
                if (userStatus) goApp("/l");
                else openModal();
              }}
            >
              Go to app
            </button>
            <button
              className="intro-text__button btn btn-animation"
              onClick={() => goApp("/public")}
            >
              Preview
            </button>
          </div>
        </article>
        <article className="intro-images">
          {/* <img className="intro-images__phone" src={Phone} alt="Phone" /> */}
          <img className="intro-images__laptop" src={Laptop} alt="Laptop" />
        </article>
      </section>
      <section className="features">
        <TitleAnimation title="Awesome features!" width={17} />
        <div className="row">
          <Card
            label="Follow other programmers"
            text="Follow other programmers and see their latest loops."
          >
            <FiShare2 className="feature-icon" />
          </Card>
          <Card
            label="Easily search code"
            text="Search for code by language, title, or username."
          >
            <FiCopy className="feature-icon" />
          </Card>
          <Card
            label="Save your favorite solutions"
            text="Save loops to your profile to view later."
          >
            <FiDownload className="feature-icon" />
          </Card>
        </div>
      </section>
    </main>
  );
};

export default Content;
