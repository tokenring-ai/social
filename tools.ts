import createPost from "./tools/createPost.ts";
import getCurrentAccount from "./tools/getCurrentAccount.ts";
import getCurrentPost from "./tools/getCurrentPost.ts";
import getRecentPosts from "./tools/getRecentPosts.ts";
import selectPost from "./tools/selectPost.ts";

export default [
  getCurrentAccount,
  getRecentPosts,
  getCurrentPost,
  selectPost,
  createPost,
];
