import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function VideoList() {
  const [videos, setVideos] = useState([]);

  const importVideos = () => {
    fetch("http://localhost:8080/")
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        setVideos(res);
      })
      .catch((e) => {
        console.log(e.message);
      });
  };

  useEffect(() => importVideos());

  return (
    <>
      {videos.length > 0 && (
        <ul className="list-group">
          {videos.map((video, index) => (
            <Link
              key={index}
              to={"/watch/" + video}
              className="link-underline link-underline-opacity-0 link-underline-opacity-75-hover"
            >
              <li key={index} className="list-group-item">
                {video.replaceAll("-", " ")}
              </li>
            </Link>
          ))}
        </ul>
      )}
    </>
  );
}

function App() {
  return (
    <>
      <VideoList />
      <Link to="/upload">
        <button className="btn btn-dark ms-5 mt-4 link-underline link-underline-opacity-0">
          UPLOAD
        </button>
      </Link>
    </>
  );
}

export default App;
