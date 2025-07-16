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
import UploadMaterials from "../pages/Dashboard/TutorDashboard/UploadMaterials/UploadMaterials";
import MyMaterials from "../pages/Dashboard/TutorDashboard/MyMaterials/MyMaterials";
import AdminMaterialsView from "../pages/Dashboard/AdminDashboard/AdminMaterialsView/AdminMaterialsView";
import StudySessions from "../pages/HomePage/StudySessions/StudySessions ";
import Payment from "../pages/Payment/Payment";
import MyBookedSessions from "../pages/Dashboard/StudentDashboard/MyBookedSessions/MyBookedSessions";
import PaymentHistory from "../pages/Dashboard/StudentDashboard/PaymentHistory/PaymentHistory";
import CreateNote from "../pages/Dashboard/StudentDashboard/CreateNote/CreateNote";
import ManageNotes from "../pages/Dashboard/StudentDashboard/ManageNotes/ManageNotes";
import StudyMaterials from "../pages/Dashboard/StudentDashboard/StudyMaterials/StudyMaterials";
import DashboardHome from "../pages/Dashboard/DashboardHome/DashboardHome";


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
            },
            {
                path: 'tutors',
                element: <AllTutors></AllTutors>
            },
            {
                path: 'study-sessions',
                element: <StudySessions></StudySessions>
            },
            {
                path: 'payment',
                element: <Payment></Payment>
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
                index: true,
                element: <DashboardHome />
            },
            {
                path: 'pending-tutors',
                element: <PrivateRoutes><TutorManagement></TutorManagement></PrivateRoutes>
            },
            {
                path: 'manage-users',
                element: <PrivateRoutes><AllTutors></AllTutors></PrivateRoutes>
            },
            {
                path: 'view-users',
                element: <PrivateRoutes><AllUsers></AllUsers></PrivateRoutes>
            },
            {
                path: 'create-study-session',
                element: <PrivateRoutes><CreateSession></CreateSession></PrivateRoutes>
            },
            {
                path: 'view-study-sessions',
                element: <PrivateRoutes><MyStudySessions></MyStudySessions></PrivateRoutes>
            },
            {
                path: 'admin-view-study-sessions',
                element: <PrivateRoutes><AdminStudySessions></AdminStudySessions></PrivateRoutes>
            },
            {
                path: 'update-session/:id',
                element: <PrivateRoutes><UpdateStudySession></UpdateStudySession></PrivateRoutes>
            },
            {
                path: 'upload-materials',
                element: <PrivateRoutes><UploadMaterials></UploadMaterials></PrivateRoutes>
            },
            {
                path: 'view-materials',
                element: <PrivateRoutes><MyMaterials></MyMaterials></PrivateRoutes>
            },
            {
                path: 'admin-view-materials',
                element: <PrivateRoutes><AdminMaterialsView></AdminMaterialsView></PrivateRoutes>
            },
            {
                path: 'booked-sessions',
                element: <PrivateRoutes><MyBookedSessions></MyBookedSessions></PrivateRoutes>
            },
            {
                path: 'payment-history',
                element: <PrivateRoutes><PaymentHistory></PaymentHistory></PrivateRoutes>
            },
            {
                path: 'create-note',
                element: <PrivateRoutes><CreateNote></CreateNote></PrivateRoutes>
            },
            {
                path: 'manage-notes',
                element: <PrivateRoutes><ManageNotes></ManageNotes></PrivateRoutes>
            },
            {
                path: 'study-materials',
                element: <PrivateRoutes><StudyMaterials></StudyMaterials></PrivateRoutes>
            }

        ]
    }
])