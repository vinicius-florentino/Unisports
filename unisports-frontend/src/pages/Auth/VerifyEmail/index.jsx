import { AuthLayout } from "../../../layouts/AuthLayout";
import { useQuery } from "@tanstack/react-query";
import api from "../../../api";
import { useLocation } from "react-router-dom";
import { Alert, Link } from "@mui/material";
import { Loading } from "../../../components/Loading";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { useEffect } from "react";
import { toast } from "react-toastify";

const Content = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");
    const { updateUser } = useAuth();

    const { data, error, isPending, isError, isSuccess } = useQuery({
        queryKey: ["VERIFY_EMAIL"],
        queryFn: async () => {
            return await api.get(`/email/verify?token=${token}`).then((response) => response.data);
        }
    });

    useEffect (() => {
        if (isSuccess && data){
            const { message } = data;
            updateUser(data.data);
            toast.success(message);
        }
    }, [isSuccess, data])

    if (isPending) {
        return <Loading />;
    }

    if (isError) {
        return (
            <>
                <Alert severity={error?.response?.data?.status}>{error?.response?.data?.message}</Alert>
                <Link component="button" onClick={() => navigate("/")}>
                    Voltar para página inicial
                </Link>
            </>
        );
    }

    if (isSuccess) {
        return (
            <>
                <Alert severity={data?.status}>{data?.message}</Alert>
                <Link component="button" onClick={() => navigate("/")}>
                    Voltar para página inicial
                </Link>
            </>
        );
    }
};

export const VerifyEmail = () => {
    return (
        <AuthLayout>
            <Content />
        </AuthLayout>
    );
};
