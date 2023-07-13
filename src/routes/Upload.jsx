import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Upload = () => {
  const [file, setFile] = useState(null);

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const onFileUpload = () => {
    if (!file.type.includes("video")) {
      alert("file isn't in video format");
    } else {
      const formData = new FormData();

      formData.append("vid", file, file.name);

      axios
        .post("http://localhost:8080/upload", formData)
        .then((res) => alert(res.data.message))
        .catch((e) => {
          alert(e.response.data.message);
        });
    }
  };

  const CurrentFile = ({ className }) => {
    if (file) {
      return (
        <div className={className}>
          <h2>File Details:</h2>
          <p>File Name: {file.name}</p>
          <p>File Type: {file.type}</p>
          <p>
            Last Modified:
            {" " + file.lastModifiedDate.toDateString()}
          </p>
        </div>
      );
    } else {
      return <h4 className={className}>Please choose a file.</h4>;
    }
  };

  return (
    <>
      <h1 className="display-4 ms-4 mt-3">Upload Video</h1>
      <input
        className="ms-5 mt-3 d-block"
        type="file"
        onChange={onFileChange}
      />
      <CurrentFile className="ms-5 mt-4" />
      {file && (
        <Link to="/" className="link-underline link-underline-opacity-0">
          <button
            onClick={onFileUpload}
            className="btn btn-dark d-block mx-auto"
          >
            UPLOAD
          </button>
        </Link>
      )}
    </>
  );
};

export default Upload;
