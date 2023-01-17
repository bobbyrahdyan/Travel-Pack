import { createBrowserRouter, Navigate } from "react-router-dom"
import App from "../App"
import { HomePage } from "../pages/HomePage"
import { LoginPage } from "../pages/LoginPage"
import { RegisterPage } from "../pages/RegisterPage"
import { DestinationDetailPage } from "../pages/DestinationDetailPage"
import { DestinationInformation } from "../components/DestinationDetailPage/DestinationInformation"
import { DestinationReview } from "../components/DestinationDetailPage/DestinationReview"
import ErrorPage from "../pages/ErrorPage"
import FindTravel from "../pages/FindTravel"
import MyTravelStep from "../pages/MyTravelStep"
import Forum from "../pages/Forum"
import ForumDetail from "../pages/ForumDetail"
import TravelItenerary from "../pages/TravelItenerary"
import TravelStep from "../pages/TravelStep"
import FindDestination from "../components/CityPages/FindDestination"
import TravelCards from "../components/CityPages/TravelCards"
import { ProfilePage } from "../pages/ProfilePage"

function Protect({ children }) {
  const access_token = localStorage.getItem("access_token")
  if (!access_token) return <Navigate to="/login" replace />
  return children
}

function Authorized({ children }) {
  const access_token = localStorage.getItem("access_token")
  if (access_token) return <Navigate to="/" replace />
  return children
}
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <HomePage />,
      },
      {
        path: "profile",
        element:
          <Protect>
            <ProfilePage />
          </Protect>,
      },
      {
        path: "find-byCity/:citySlug/",
        element: <FindDestination />,
        errorElement: <ErrorPage />,
        children: [
          {
            path: ":type",
            element: <TravelCards />,
          },
        ],
      },
      {
        path: "find-travel",
        element: <FindTravel />,
        errorElement: <ErrorPage />,
      },
      {
        path: "travel-step",
        element: (
          <Protect>
            <TravelStep />
          </Protect>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: "travel-step/generated",
        element: (
          <Protect>
            <TravelItenerary />
          </Protect>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: "my-travel-step",
        element: (
          <Protect>
            <MyTravelStep />
          </Protect>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: "forum",
        element: (
          <Protect>
            <Forum />
          </Protect>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: "forum/:slug",
        element: (
          <Protect>
            <ForumDetail />
          </Protect>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: ":type/:slug",
        element: <DestinationDetailPage />,
        children: [
          {
            path: "",
            element: <DestinationInformation />,
            errorElement: <ErrorPage />,
          },
          {
            path: "review",
            element: <DestinationReview />,
            errorElement: <ErrorPage />,
          },
          // {
          //   path: "covid",
          //   element: <DestinationCovid />,
          //   errorElement: <ErrorPage />,
          // },
        ],
      },
    ],
  },
  {
    path: "/login",
    element: (
      <Authorized>
        <LoginPage />
      </Authorized>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
    errorElement: <ErrorPage />,
  },
])

export default router
