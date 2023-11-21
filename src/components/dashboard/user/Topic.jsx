import React from "react";
import { useParams } from "react-router-dom";
import Profile from "./Profile";
import Documents from "./Documents";
import Recommendations from "./Recommendations";
import Applications from "./Applications";
import Shortlisted from "./profile/Shortlisted";

const Topic = () => {
  const { topic_url } = useParams();

  return (
    <div>
      {topic_url === "profile" && <Profile />}
      {/* {topic_url === "applications" && <Applications />} */}
      {topic_url === "documents" && <Documents />}
      {topic_url === "recommendations" && <Recommendations />}
      {topic_url === "shortlisted" && <Shortlisted />}
    </div>
  );
};

export default Topic;
