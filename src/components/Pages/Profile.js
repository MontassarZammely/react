import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./Profile.css";

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchProfileData = async () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      if (!token || !userId) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3000/user/profile/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfileData(response.data);

        fetchUserPosts(userId);
      } catch (error) {
        console.error('Error fetching profile data:', error);
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    const fetchUserPosts = async (userId) => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`http://localhost:3000/posts`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching user posts:', error);
      }
    };

    fetchProfileData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const createPost = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(
        `http://localhost:3000/posts`,
        { content: newPostContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts([...posts, response.data]);
      setNewPostContent("");
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const fetchComments = async (postId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`http://localhost:3000/comments/post/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments(response.data); // Update comments state
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
    fetchComments(post.id); // Fetch comments for the selected post
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;

    const token = localStorage.getItem('token');
    try {
      await axios.post(
        `http://localhost:3000/comments`,
        { postId: selectedPost.id, content: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewComment("");
      fetchComments(selectedPost.id); // Refresh comments
      alert('Comment added successfully!');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  if (loading) return <p className="text-gray-500 text-center">Loading...</p>;

  return profileData ? (
    <div className="min-h-screen bg-gray-100 flex flex-col">
       {/* Navbar */}
       <div className="bg-blue-600 p-4 flex items-center justify-between text-white relative">
        <div className="text-2xl font-bold">MyApp</div>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search..."
            className="p-2 w-40 rounded bg-gray-200 text-gray-800 placeholder-gray-500"
          />
          <div className="text-lg font-semibold">Welcome, {profileData.name}!</div>
          {profileData.profilePicture && (
            <img
              src={profileData.profilePicture}
              alt="Profile"
              className="w-10 h-10 rounded-full border-2 border-white"
            />
          )}
          <button
            onClick={() => setDropdownVisible(!dropdownVisible)}
            className="p-2 bg-gray-700 hover:bg-gray-800 rounded-full"
          >
            ▼
          </button>
        </div>

        {dropdownVisible && (
          <div className="absolute top-16 right-4 mt-2 w-64 bg-white text-gray-800 rounded-lg shadow-lg dropdown-menu">
            <div className="p-4">
              <p className="text-sm"><strong>Email:</strong> {profileData.email}</p>
              {profileData.bio && <p className="text-sm mt-2"><strong>Bio:</strong> {profileData.bio}</p>}
            </div>
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-b-lg"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center p-6 mt-8">
      {profileData.profilePicture ? (
          <img
            src={profileData.profilePicture}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-blue-600 mb-4"
          />
        ) : (
          <p className="text-lg text-gray-700 mb-2">No profile picture available.</p>
        )}
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Profile Details</h2>
        <p className="text-lg text-gray-700 mb-2"><strong>Name:</strong> {profileData.name}</p>

        {/* Post Form */}
        <form onSubmit={(e) => { e.preventDefault(); createPost(); }} className="w-full max-w-md mt-6">
          <textarea
            className="w-full p-2 border border-gray-300 rounded mb-2"
            placeholder="What's on your mind?"
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Post
          </button>
        </form>

        {/* Display User's Posts */}
        {/* Display User's Posts */}
<div className="mt-6 w-full max-w-md">
  <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Posts</h3>
  {posts.length > 0 ? (
    posts.map((post, index) => (
      <div
        key={index}
        onClick={() => handlePostClick(post)}
        className="p-4 bg-white shadow mb-4 rounded hover:shadow-lg transition cursor-pointer"
      >
        <h4 className="text-lg font-bold text-gray-800 mb-2">{post.title || "Untitled Post"}</h4>
        <p className="text-gray-800">{post.content}</p>
        

        
        <p className="text-sm text-gray-500 mt-2">
          Created on: {new Date(post.createdDate).toLocaleString()}
        </p>
      </div>
    ))
  ) : (
    <p className="text-gray-500">No posts available.</p>
  )}
</div>

      </div>

      {/* Modal for Post and Comment */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Post Details</h3>
            <p className="text-gray-800 mb-4">{selectedPost.content}</p>



            {/* Comments Section */}
            <div className="mb-4">

            <textarea
              className="w-full p-2 border border-gray-300 rounded mb-4"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
                      <div className="flex justify-end space-x-2">
              <button
                onClick={() => setSelectedPost(null)}
                className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
              >
                Close
              </button>
              <button
                onClick={handleCommentSubmit}
                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
              >
                Comment
              </button>
            </div>
              <h4 className="text-lg font-semibold mb-2">Comments</h4>
              {comments.length > 0 ? (
                comments.map((comment, index) => (
                  <div key={index} className="p-2 border-b">
                    <p className="text-gray-800">{comment.content}</p>
                    <p className="text-gray-800">{comment?.user?.name}</p>
                    <p className="text-sm text-gray-500">On {new Date(comment.createdDate).toLocaleString()} </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No comments yet.</p>
              )}
            </div>

  
          </div>
        </div>
      )}
    </div>
  ) : (
    <div className="text-gray-500 text-center">You are not logged in.</div>
  );
};

export default Profile;
