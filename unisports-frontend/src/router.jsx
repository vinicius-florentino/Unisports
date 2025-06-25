import { createBrowserRouter } from "react-router-dom";

import { Login } from "./pages/Auth/Login";
import { Register } from "./pages/Auth/Register";
import { ForgotPassword } from "./pages/Auth/ForgotPassword";
import { ResetPassword } from "./pages/Auth/ResetPassword";
import { VerifyEmail } from "./pages/Auth/VerifyEmail";
import Event from "./pages/Event/Index";
import { Home } from "./pages/Home";
import { Settings } from "./pages/Settings";
import { EventsDashboard } from "./pages/EventsDashboard";
import { Help } from "./pages/Help";
import { Terms } from "./pages/Terms"
import { EventsParticipating } from "./pages/EventsParticipating/Index"
export const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/register",
        element: <Register />,
    },
    {
        path: "/settings",
        element: <Settings />,
    },
    {
        path: "/password/send-reset-link",
        element: <ForgotPassword />,
    },
    {
        path: "/password/reset",
        element: <ResetPassword />,
    },
    {
        path: "/email/verify",
        element: <VerifyEmail />,
    },
    {
        path: "/events/dashboard",
        element: <EventsDashboard/>
    },
    {
        path: "/events/participating",
        element: <EventsParticipating/>
    },
    {
        path: "/event/:id",
        element: <Event/>
    },
    {
        path: "/help",
        element: <Help />,
    },
    {
        path: "/Terms",
        element: <Terms />,
    },
]);
