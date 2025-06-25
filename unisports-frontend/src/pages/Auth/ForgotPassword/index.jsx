import { useState } from "react";
import { AuthLayout } from "../../../layouts/AuthLayout";
import { Box, Grid2 as Grid, TextField, Button, Stack, Link, Alert } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../../api";

const Content = () => {
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState({});

    const { mutate, isPending } = useMutation({
        mutationFn: (data) => {
            return api.post("/password/send-reset-link", data);
        },
        onError: (error) => {
            const { message, errors } = error.response.data;

            setErrors(errors);
            toast.error(message);
        },
        onSuccess: (data) => {
            const { message, status } = data.data;
            
            setMessage({
                value: message,
                severity: status,
            });
            toast.success(message);
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
            {message.value ? (
                <Alert severity={message.severity}>{message.value}</Alert>
            ) : (
                <Box component="form" noValidate onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
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
                            <Button variant="contained" fullWidth type="submit" disabled={isPending}>
                                Enviar
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            )}
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

export const ForgotPassword = () => {
    return (
        <AuthLayout>
            <Content />
        </AuthLayout>
    );
};
