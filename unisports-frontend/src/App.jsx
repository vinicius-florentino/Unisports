import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import theme from "./css/mui-theme/theme";
import 'material-icons/iconfont/outlined.css';
import 'material-icons/iconfont/filled.css';

import { RouterProvider } from "react-router-dom";
import { router } from "./router";

import { AuthProvider } from "./contexts/AuthContext";

import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import "dayjs/locale/pt-br";

import 'swiper/css';
import './css/root.css';

const queryClient = new QueryClient();
const muiTheme = createTheme(theme);

export default function App() {
    return (
        <ThemeProvider theme={muiTheme}>
            <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar />
            <AuthProvider>
                <QueryClientProvider client={queryClient}>
                    <RouterProvider router={router} />
                </QueryClientProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}
