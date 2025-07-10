import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/HomePage/Home/Home";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/Authentication/Login/Login";
import Register from "../pages/Authentication/Register/Register";
import DashboardLayout from "../layouts/DashboardLayout";
import PrivateRoutes from "../routes/PrivateRoutes";
import BeTutorForm from "../shared/BeTutorCard/BeTutorForm";
import TutorManagement from "../pages/Dashboard/TutorManagement/TutorManagement";
import AllTutors from "../pages/Dashboard/AllTutors/AllTutors";
import AllUsers from "../pages/Dashboard/AdminDashboard/AllUsers/AllUsers";
import CreateSession from "../pages/Dashboard/TutorDashboard/CreateSession/CreateSession";
import MyStudySessions from "../pages/Dashboard/TutorDashboard/MyStudySessions/MyStudySessions";
import AdminStudySessions from "../pages/Dashboard/AdminDashboard/AdminStudySessions/AdminStudySessions";
import UpdateStudySession from "../pages/Dashboard/TutorDashboard/UpdateStudySession/UpdateStudySession";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout></RootLayout>,
        children: [
            {
                index: true,
                element: <Home></Home>
            },
            {
                path: 'become-tutor',
                element: <PrivateRoutes>
                    <BeTutorForm></BeTutorForm>
                </PrivateRoutes>
            }
        ]
    },
    {
        path: '/',
        element: <AuthLayout></AuthLayout>,
        children: [
            {
                path: 'login',
                element: <Login></Login>
            },
            {
                path: 'register',
                element: <Register></Register>
            }
        ]
    },
    {
        path: 'dashboard',
        element: <PrivateRoutes>
            <DashboardLayout></DashboardLayout>
        </PrivateRoutes>,
        children: [
            {
                path: 'pending-tutors',
                element: <TutorManagement></TutorManagement>
            },
            {
                path: 'manage-users',
                element: <AllTutors></AllTutors>
            },
            {
                path: 'view-users',
                element: <AllUsers></AllUsers>
            },
            {
                path: 'create-study-session',
                element: <CreateSession></CreateSession>
            },
            {
                path: 'view-study-sessions',
                element: <MyStudySessions></MyStudySessions>
            },
            {
                path: 'admin-view-study-sessions',
                element: <AdminStudySessions></AdminStudySessions>
            },
            {
                path: 'update-session/:id',
                element: <UpdateStudySession></UpdateStudySession>
            }
        ]
    }
])