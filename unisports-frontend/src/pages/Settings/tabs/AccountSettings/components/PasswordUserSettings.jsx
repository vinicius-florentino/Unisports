import React, { useState } from "react";
import { Box, Grid2 as Grid, TextField, Button, Stack } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import api from "../../../../../api";
import { toast } from "react-toastify";

export const PasswordUserSettings = () => {
    const [errors, setErrors] = useState({});

    const { mutate, isPending } = useMutation({
        mutationFn: (data) => {
            return api.put("/settings/account/password", { ...data });
        },
        onError: (error) => {
            const { message, errors } = error.response.data;
            setErrors(errors);
            toast.error(message);
        },
        onSuccess: (data) => {
            const { message } = data.data;
            setErrors({});
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
            <Box component="form" id="passwordForm" noValidate onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            name="current_password"
                            label="Senha"
                            required
                            type="password"
                            disabled={isPending}
                            error={!!errors?.current_password}
                            helperText={!!errors?.current_password && errors?.current_password[0]}
                        />
                    </Grid>
                    <Grid size={{ xs: 0, md: 6 }}></Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            name="new_password"
                            label="Nova senha"
                            type="password"
                            required
                            disabled={isPending}
                            error={!!errors?.new_password}
                            helperText={!!errors?.new_password && errors?.new_password[0]}
                        />
                    </Grid>
                    <Grid size={{ xs: 0, md: 6 }}></Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            name="new_password_confirmation"
                            label="Confirme sua senha"
                            type="password"
                            required
                            disabled={isPending}
                            error={!!errors?.new_password_confirmation}
                            helperText={!!errors?.new_password_confirmation && errors?.new_password_confirmation[0]}
                        />
                    </Grid>
                    <Grid size={12}>
                        <Button variant="contained" type="submit" disabled={isPending}>
                            Atualizar
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Stack>
    );
};
