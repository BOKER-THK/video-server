import ReactHlsPlayer from "react-hls-player";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

function Watch() {
  const params = useParams();

  return (
    <>
      <Link to="/" className="lead p-4">
        Back to List
      </Link>
      <ReactHlsPlayer
        src={"http://localhost:8080/" + params.videoName}
        autoPlay={true}
        controls={true}
        width="60%"
        height="auto"
        className="d-block mx-auto mt-5"
      />
    </>
  );
}

export default Watch;
