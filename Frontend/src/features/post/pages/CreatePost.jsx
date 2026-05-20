import { useState } from "react";
import { CirclePlus } from "lucide-react";
import { usePost } from "../hooks/usePost";
import { useNavigate } from "react-router";

import "../styles/createPost.scss";

const CreatePost = () => {
  const { handleCreatePost, loading } = usePost();

  const [caption, setCaption] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleFile = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!file || !caption) {
      setError("All fields are required");
      return;
    }

    const user = await handleCreatePost({
      imageFile: file,
      caption,
    });

    if (!user) {
      console.log("User not loaded yet");
      return;
    }

    navigate("/");
  };

  if (loading) {
    return (
      <main>
        <h1>Post creating...</h1>
      </main>
    );
  }

  return (
    <section className="create-post-container">
      <h2>Create Post</h2>
      <p>Share your moments with the world!</p>

      <form onSubmit={handleSubmit}>
        <label className="upload-box">
          {preview ? (
            <img src={preview} alt="preview" />
          ) : (
            <div className="placeholder">
              <CirclePlus />
              <p>Upload Image</p>
            </div>
          )}
          <input hidden type="file" onChange={handleFile} />
        </label>

        <textarea
          placeholder="Write your caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />

        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={!file || loading}>
          {loading ? "Posting...." : "Post"}
        </button>
      </form>
    </section>
  );
};

export default CreatePost;
