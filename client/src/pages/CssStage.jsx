import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_USER_PROGRESS } from "../utils/queries";

function CssStage() {
  const navigate = useNavigate();
  const { data } = useQuery(GET_USER_PROGRESS);

  useEffect(() => {
    if (data) {
      const progress = data.me.progress;
      // If user hasn't completed HTML, redirect them
      if (!progress.includes("HTML")) {
        navigate("/html");
      }
    }
  }, [data, navigate]);

  return (
    <div>
      <h2>CSS Stage</h2>
      <p>Solve the CSS challenges to unlock the next stage!</p>
      {/* Add your CSS challenge logic here */}
    </div>
  );
}

export default CssStage;
