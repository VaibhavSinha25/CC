// Network.jsx
import React, { useEffect, useState } from "react";
import PostCard from "../components/PostCard";
import Group from "../components/Group"; // Import the Group component
import axios from "axios";
import { format, parseISO } from "date-fns";
import ProjectCard from "../components/ProjectCard";

const Network = () => {
  const [posts, setPost] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [activeTab, setActiveTab] = useState("posts");

  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  const fetchPosts = async (pageNum) => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/post/getAll-post?page=${pageNum}`
      );
      const newPost = res.data.post;
      if (newPost.length === 0) {
        setHasMore(false); // No more notices to fetch
        return;
      }

      setPost((prev) => [...prev, ...newPost]);
      setPage(pageNum);
      console.log("Post are:-", newPost);
    } catch (err) {
      console.error("Error fetching notices:", err);
    }
  };

  const groups = [
    { name: "Cat Lovers", members: 150, topic: "Cats and Kittens" },
    { name: "Kittens Club", members: 200, topic: "All About Kittens" },
    // Add more groups as needed
  ];

  // Add sample projects data (you can replace this with actual API call)
  const projects = [
    {
      title: "AI-Powered Chat Application",
      description:
        "A real-time chat application built with React and Node.js, featuring AI-powered chat suggestions.",
      projectUrl: "https://demo-project.com",
      githubUrl: "https://github.com/project",
      mediaUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
      likes: 42,
      comments: [],
    },
    // Add more projects as needed
  ];

  return (
    <div className="min-h-screen py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row space-y-8 lg:space-y-0 lg:space-x-8">
        {/* Enhanced Toggle Buttons */}
        <div className="lg:w-3/4 w-full">
          <div className="bg-gray-50/50 backdrop-blur-xl rounded-2xl shadow-sm p-2 mb-6 inline-flex items-center gap-2 border border-gray-100">
            <button
              onClick={() => setActiveTab("posts")}
              className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                activeTab === "posts"
                  ? "bg-white text-blue-600 shadow-md shadow-blue-100 transform scale-[1.02] border border-gray-100"
                  : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
              }`}
            >
              <svg
                className={`w-4 h-4 ${
                  activeTab === "posts" ? "text-blue-600" : "text-gray-500"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v12a2 2 0 01-2 2z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 2v4M8 2v4M3 10h18"
                />
              </svg>
              Posts
              {activeTab === "posts" && (
                <span className="ml-1 px-2 py-0.5 text-xs bg-blue-50 text-blue-600 rounded-full">
                  {posts.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("projects")}
              className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                activeTab === "projects"
                  ? "bg-white text-blue-600 shadow-md shadow-blue-100 transform scale-[1.02] border border-gray-100"
                  : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
              }`}
            >
              <svg
                className={`w-4 h-4 ${
                  activeTab === "projects" ? "text-blue-600" : "text-gray-500"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                />
              </svg>
              Projects
              {activeTab === "projects" && (
                <span className="ml-1 px-2 py-0.5 text-xs bg-blue-50 text-blue-600 rounded-full">
                  {projects.length}
                </span>
              )}
            </button>
          </div>

          {/* Content Area */}
          <div className="flex flex-col space-y-6">
            {activeTab === "posts"
              ? // Posts Content
                posts?.map((post, index) => (
                  <PostCard
                    key={index}
                    postId={post._id}
                    userId={post?.author?._id}
                    avatar={post.author.profileImage}
                    username={post?.author?.fullName}
                    time={format(
                      parseISO(post?.createdAt),
                      "dd MMM yyyy, hh:mm a"
                    )}
                    content={post.caption}
                    imageUrl={post.mediaUrl}
                    likes={post.likes}
                    comments={post.comments}
                  />
                ))
              : // Projects Content
                projects.map((project, index) => (
                  <ProjectCard key={index} {...project} />
                ))}
          </div>
        </div>

        {/* Separator Line */}
        <div className="hidden lg:block w-px bg-gray-200 h-full" />

        {/* Right Column for Groups - Sticky Container */}
        <div className="lg:w-1/4 w-full">
          <div className="sticky top-4">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="font-bold text-xl text-gray-900 mb-4">
                Join Community Groups
              </h2>
              {/* Scrollable Container */}
              <div className="max-h-[calc(100vh-12rem)] overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                {groups.map((group, index) => (
                  <Group key={index} group={group} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Network;

// Add this CSS to your global styles or component
const styles = `
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #CBD5E1 transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #CBD5E1;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #94A3B8;
}
`;
