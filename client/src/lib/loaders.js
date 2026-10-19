
import { defer } from "react-router-dom";
import apiRequest from "./apiRequest";

export const singlePageLoader = async ({ params }) => {
  const res = await apiRequest("/posts/" + params.id);
  return res.data;
};

export const listPageLoader = async ({ request }) => {
  const url = new URL(request.url);
  const query = url.searchParams.toString();

  const postPromise = apiRequest(
    query ? `/posts?${query}` : "/posts"
  );

  return defer({
    postResponse: postPromise,
  });
};

export const profilePageLoader = async () => {
  const postPromise = apiRequest("/users/profilePosts");
  const chatPromise = apiRequest("/chats");

  return defer({
    postResponse: postPromise,
    chatResponse: chatPromise,
  });
};
