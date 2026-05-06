const Post = require("../models/Post");

exports.createPost = async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    const post = await Post.create({
      title,
      content,
      tags,
      author: req.user.id
    });

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const { search, tag } = req.query;

    let query = {};

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    if (tag) {
      query.tags = tag;
    }

    const posts = await Post.find(query)
      .populate("author", "name")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSinglePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "name");

    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.votePost = async (req, res) => {
  try {
    const { type } = req.body;
    const userId = req.user.id;

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });

    const hasUp = post.upvotes.includes(userId);
    const hasDown = post.downvotes.includes(userId);

    if (type === "up") {
      // toggle upvote
      if (hasUp) {
        post.upvotes.pull(userId);
      } else {
        post.upvotes.push(userId);
        if (hasDown) post.downvotes.pull(userId);
      }
    } else if (type === "down") {
      // toggle downvote
      if (hasDown) {
        post.downvotes.pull(userId);
      } else {
        post.downvotes.push(userId);
        if (hasUp) post.upvotes.pull(userId);
      }
    } else {
      return res.status(400).json({ msg: "Invalid vote type" });
    }

    await post.save();

    res.json({
      upvotes: post.upvotes.length,
      downvotes: post.downvotes.length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};