const imagekit = require("../imageKit");
const Project = require("../models/Project");

exports.createProject = async (req, res) => {
  try {
    const {
      title,
      description,
      githubUrl,
      projectUrl,
      userId,
      category,
      TechStack,
      contributors,
    } = req.body;

    let mediaUrl = null;

    if (!req.file) {
      return res
        .status(400)
        .json({ message: "Missing file parameter for upload" });
    }

    const uploadedImage = await imagekit.upload({
      file: req.file.buffer,
      fileName: req.file.originalname,
      folder: "/user-project",
    });
    mediaUrl = uploadedImage.url;

    // Build project data dynamically
    const projectData = {
      title,
      description,
      githubUrl,
      projectUrl,
      userId,
      category,
      TechStack,
      mediaUrl,
    };

    if (contributors) {
      let parsedContributors = contributors;

      // Parse only if it's a string (e.g., from form-data)
      if (typeof contributors === "string") {
        try {
          parsedContributors = JSON.parse(contributors);
        } catch (e) {
          console.warn("Invalid JSON in contributors:", contributors);
          parsedContributors = [];
        }
      }

      // Only add if parsed value is a non-empty array
      if (Array.isArray(parsedContributors) && parsedContributors.length > 0) {
        projectData.contributors = parsedContributors;
      }
    }

    const project = new Project(projectData);
    await project.save();

    res.status(201).json(project);
    console.log(`Project created successfully: ${project}`);
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("userId", "fullName profileImage ")
      .sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.likeProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { userId } = req.body; // Get user ID from request

    if (!projectId || !userId) {
      return res.status(400).json({ message: "Missing projectId or userId" });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "project not found" });
    }

    const hasLiked = project.likedByUsers.includes(userId);

    if (hasLiked) {
      // If user has already liked, remove like
      project.likes -= 1;
      project.likedByUsers = project.likedByUsers.filter((id) => id !== userId);
    } else {
      // If user has not liked, add like
      project.likes += 1;
      project.likedByUsers.push(userId);
    }

    await project.save();

    res.json({
      message: hasLiked ? "Like removed" : "project liked",
      project,
      hasLiked: !hasLiked, // Send new like status
    });
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getLikes = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({ likes: project.likedByUsers });
  } catch (error) {
    console.error("Error fetching likes:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
