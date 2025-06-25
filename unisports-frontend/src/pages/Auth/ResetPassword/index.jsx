import { useState } from "react";
import { AuthLayout } from "../../../layouts/AuthLayout";
import { Box, Grid2 as Grid, TextField, Button, Stack, Link, Alert } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../../api";
import { useLocation } from "react-router-dom";

const Content = () => {
    
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");

    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState({});

    const { mutate, isPending } = useMutation({
        mutationFn: (data) => {
            return api.put("/password/reset", { token: token, ...data });
        },
        onError: (error) => {
            const { message, status, errors } = error.response.data;
            
            setErrors(errors);
            setMessage({ value: message, severity: status });
            toast.error(message);
        },
        onSuccess: (data) => {
            const { message } = data.data;

            toast.success(message);
            navigate("/login");
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        mutate(data);
    };

    return (
        <Stack spacing={2}>
            {message.value && !errors && <Alert severity={message.severity}>{message.value}</Alert>}
            <Box component="form" noValidate onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid size={12}>
                        <TextField
                            name="password"
                            label="Senha"
                            type="password"
                            required
                            autoFocus
                            disabled={isPending}
                            error={!!errors?.password}
                            helperText={!!errors?.password && errors?.password[0]}
                        />
                    </Grid>
                    <Grid size={12}>
                        <TextField
                            name="password_confirmation"
                            label="Confirmação de senha"
                            type="password"
                            required
                            disabled={isPending}
                            error={!!errors?.password_confirmation}
                            helperText={!!errors?.password_confirmation && errors?.password_confirmation[0]}
                        />
                    </Grid>
                    <Grid size={12}>
                        <Button variant="contained" fullWidth type="submit" disabled={isPending}>
                            Redefinir senha
                        </Button>
                    </Grid>
                </Grid>
            </Box>
            <Stack alignItems="center" spacing={1}>
                <Link component="button" onClick={() => navigate("/login")}>
                    Fazer login
                </Link>
                <Link component="button" onClick={() => navigate("/")}>
                    Página inicial
                </Link>
            </Stack>
        </Stack>
    );
};

export const ResetPassword = () => {
    return (
        <AuthLayout>
            <Content />
        </AuthLayout>
    );
};
