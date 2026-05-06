const router = require("express").Router();
const auth = require("../middleware/auth");
const {
  createPost,
  getPosts,
  getSinglePost,
  votePost
} = require("../controllers/postController");

router.post("/", auth, createPost);
router.get("/", getPosts);
router.get("/:id", getSinglePost);
router.post("/:id/vote", auth, votePost);


module.exports = router;