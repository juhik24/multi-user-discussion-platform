const Comment = require("../models/Comment");

exports.addComment = async (req, res) => {
  try {
    const { content } = req.body;

    const comment = await Comment.create({
      content,
      post: req.params.postId,
      author: req.user.id
    });

    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({
      post: req.params.postId
    }).populate("author", "name");

    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ msg: "Comment not found" });
    }

    // only author can delete
    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    await comment.deleteOne();

    res.json({ msg: "Comment deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};