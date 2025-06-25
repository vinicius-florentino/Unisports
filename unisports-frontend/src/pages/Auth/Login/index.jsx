import { useState } from "react";
import { AuthLayout } from "../../../layouts/AuthLayout";
import { Box, Grid2 as Grid, TextField, Button, Stack, Link, Alert } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../../api";
import useAuth from "../../../hooks/useAuth";

const Content = () => {
    
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState({});
    const { updateUser, updateToken } = useAuth();

    const { mutate, isPending } = useMutation({
        mutationFn: (data) => {
            return api.post("/login", data);
        },
        onError: (error) => {
            const { message, status, errors } = error.response.data;

            setErrors(errors);
            setMessage({ value: message, severity: status });
            toast.error(message);
        },
        onSuccess: (data) => {
            const { message } = data.data;
            const { token, user } = data.data.data;
            updateUser(user);
            updateToken(token);
            toast.success(message);
            navigate("/");
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
            <Box component="form" noValidate onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    {!!message.value && !errors && (
                        <Grid size={12}>
                            <Alert severity={message.severity}>{message.value}</Alert>
                        </Grid>
                    )}
                    <Grid size={12}>
                        <TextField
                            name="email"
                            label="Email"
                            type="email"
                            autoFocus
                            required
                            disabled={isPending}
                            error={!!errors?.email}
                            helperText={!!errors?.email && errors?.email[0]}
                        />
                    </Grid>
                    <Grid size={12}>
                        <TextField
                            name="password"
                            label="Senha"
                            type="password"
                            required
                            disabled={isPending}
                            error={!!errors?.password}
                            helperText={!!errors?.password && errors?.password[0]}
                        />
                    </Grid>
                    <Grid size={12} textAlign={"right"}>
                        <Link component="button" onClick={() => navigate("/password/send-reset-link")}>
                            Esqueci minha senha
                        </Link>
                    </Grid>
                    <Grid size={12}>
                        <Button variant="contained" fullWidth type="submit" disabled={isPending}>
                            Entrar
                        </Button>
                    </Grid>
                </Grid>
            </Box>
            <Stack alignItems="center" spacing={1}>
                <Link component="button" onClick={() => navigate("/register")}>
                    Registre-se
                </Link>
                <Link component="button" onClick={() => navigate("/")}>
                    Página inicial
                </Link>
            </Stack>
        </Stack>
    );
};

export const Login = () => {
    return (
        <AuthLayout>
            <Content />
        </AuthLayout>
    );
};
