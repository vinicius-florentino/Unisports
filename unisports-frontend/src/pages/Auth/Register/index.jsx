import React, { useState } from "react";
import { AuthLayout } from "../../../layouts/AuthLayout";
import { Box, Grid2 as Grid, TextField, Button, Stack, Link } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { IMaskInput } from "react-imask";
import { toast } from "react-toastify";
import api from "../../../api";
import useAuth from "../../../hooks/useAuth";

const TextMaskCustom = React.forwardRef(function TextMaskCustom(props, ref) {
    const { onChange, ...other } = props;
    return (
        <IMaskInput
            {...other}
            mask="+00 (00) 00000-0000"
            definitions={{
                "#": /[1-9]/,
            }}
            inputRef={ref}
            onAccept={(value) =>
                onChange({ target: { name: props.name, value } })
            }
            overwrite
        />
    );
});

const Content = () => {
    
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const {updateUser, updateToken} = useAuth();

    const { mutate, isPending } = useMutation({
        mutationFn: (data) => {
            return api.post("/register", data);
        },
        onError: (error) => {
            const { message, errors } = error.response.data;

            setErrors(errors);
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
                    <Grid size={12}>    
                        <TextField
                            name="name"
                            label="Nome"
                            autoFocus
                            required
                            disabled={isPending}
                            error={!!errors?.name}
                            helperText={!!errors?.name && errors?.name[0]}
                        />
                    </Grid>
                    <Grid size={12}>
                        <TextField
                            name="email"
                            label="Email"
                            type="email"
                            required
                            disabled={isPending}
                            error={!!errors?.email}
                            helperText={!!errors?.email && errors?.email[0]}
                        />
                    </Grid>
                    <Grid size={12}>
                        <TextField
                            name="phone"
                            label="Número de celular"
                            disabled={isPending}
                            error={!!errors?.phone}
                            helperText={!!errors?.phone && errors?.phone[0]}
                            slotProps={{
                                input: {
                                    inputComponent: TextMaskCustom,
                                },
                            }}
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
                            Cadastrar
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

export const Register = () => {
    return (
        <AuthLayout>
            <Content />
        </AuthLayout>
    );
};
