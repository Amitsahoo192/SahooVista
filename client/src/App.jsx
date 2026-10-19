
import HomePage from "./routes/homePage/homePage";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import ListPage from "./routes/listPage/listPage";
import { Layout, RequireAuth } from "./routes/layout/layout";
import SinglePage from "./routes/singlePage/singlePage";
import ProfilePage from "./routes/profilePage/profilePage";
import Login from "./routes/login/login";
import Register from "./routes/register/register";
import ProfileUpdatePage from "./routes/profileUpdatePage/profileUpdatePage";
import NewPostPage from "./routes/newPostPage/newPostPage";
import AboutPage from "./routes/aboutPage/AboutPage";
import ContactPage from "./routes/contactPage/ContactPage";
import AgentsPage from "./routes/agentPage/AgentPage";
import EditPostPage from "./routes/editPostpage/editPostPage";

import {
  listPageLoader,
  singlePageLoader,
  profilePageLoader,
} from "./lib/loaders";

import apiRequest from "./lib/apiRequest";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <HomePage />,
        },
        {
          path: "/list",
          element: <ListPage />,
          loader: listPageLoader,
        },

        // Static pages
        {
          path: "/about",
          element: <AboutPage />,
        },
        {
          path: "/contact",
          element: <ContactPage />,
        },
        {
          path: "/agents",
          element: <AgentsPage />,
        },

        // Property details
        {
          path: "/:id",
          element: <SinglePage />,
          loader: singlePageLoader,
        },

        // Authentication pages
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/register",
          element: <Register />,
        },
      ],
    },

    // Protected routes
    {
      path: "/",
      element: <RequireAuth />,
      children: [
        {
          path: "/profile",
          element: <ProfilePage />,
          loader: profilePageLoader,
        },
        {
          path: "/profile/update",
          element: <ProfileUpdatePage />,
        },
        {
          path: "/add",
          element: <NewPostPage />,
        },
        {
          path: "/edit/:id",
          element: <EditPostPage />,
          loader: async ({ params }) => {
            const response = await apiRequest.get(
              `/posts/${params.id}`
            );

            return response.data;
          },
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
