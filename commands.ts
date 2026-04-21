import accountGet from "./commands/social/account/get.ts";
import postClear from "./commands/social/post/clear.ts";
import postGet from "./commands/social/post/get.ts";
import postInfo from "./commands/social/post/info.ts";
import postList from "./commands/social/post/list.ts";
import postSelect from "./commands/social/post/select.ts";
import providerGet from "./commands/social/provider/get.ts";
import providerReset from "./commands/social/provider/reset.ts";
import providerSelect from "./commands/social/provider/select.ts";
import providerSet from "./commands/social/provider/set.ts";

export default [providerGet, providerSet, providerSelect, providerReset, accountGet, postList, postGet, postSelect, postInfo, postClear];
