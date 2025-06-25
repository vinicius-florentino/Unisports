import React, { useState } from "react";
import { Box, Grid2 as Grid, TextField, Button, Stack, Avatar, Link, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { IMaskInput } from "react-imask";
import useAuth from "../../../../../hooks/useAuth";
import { toast } from "react-toastify";
import api from "../../../../../api";
import { styled } from "@mui/material/styles";

const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
});

const TextMaskCustom = React.forwardRef((props, ref) => {
    const { onChange, ...other } = props;
    return (
        <IMaskInput
            {...other}
            mask="+00 (00) 00000-0000"
            definitions={{ "#": /[1-9]/ }}
            inputRef={ref}
            onAccept={(value) => onChange({ target: { name: props.name, value } })}
            overwrite
        />
    );
});

export const UserSettings = () => {
    const [errors, setErrors] = useState({});
    const { user, updateUser } = useAuth();
    const { mutate, isPending } = useMutation({
        mutationFn: (data) => {
            return api.put("/settings/account", data);
        },
        onError: (error) => {
            const { message, errors } = error.response.data;
            setErrors(errors);
            toast.error(message);
        },
        onSuccess: (data) => {
            const { message } = data.data;
            updateUser(data.data.data);
            toast.success(message);
        },
    });

    const { mutate: mutateImage, isPending: isPendingImage } = useMutation({
        mutationFn: (data) => {
            return api.post("/settings/account/image", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
        },
        onError: (error) => {
            const { message, errors } = error.response.data;
            setErrors(errors);
            toast.error(message);
        },
        onSuccess: (data) => {
            const { message } = data.data;
            updateUser(data.data.data);
            toast.success(message);
        },
    });

    const { mutate: deleteImage, isPending: isPendingDeleteImage } = useMutation({
        mutationFn: () => {
            return api.delete("/settings/account/image");
        },
        onError: (error) => {
            const { message, errors } = error.response.data;
            setErrors(errors);
            toast.error(message);
        },
        onSuccess: (data) => {
            const { message } = data.data;
            updateUser(data.data.data);
            toast.success(message);
        },
    });

    const { mutate: sendVerifyEmailLink, isPending: isPendingVerifyEmailLink } = useMutation({
        mutationFn: () => {
            return api.post("/email/send-verify-link");
        },
        onError: (error) => {
            const { message } = error.response.data;
            toast.error(message);
        },
        onSuccess: (data) => {
            const { message } = data.data;
            toast.success(message);
        },
    });

    const handleImageChange = (event) => {
        const file = event.target.files[0];

        if (file) {
            const formData = new FormData();
            formData.append("image", file);
            mutateImage(formData);
        }
    };

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
                        <Stack
                            sx={{ width: "100%" }}
                            flexDirection={{ xs: "column", md: "row" }}
                            alignItems={{ xs: "center" }}
                            gap={2}
                        >
                            <Avatar
                                sx={{ width: "120px", height: "120px", fontSize: 40 }}
                                imgProps={{ sx: { objectFit: "fill" } }}
                                src={user?.image_path ? import.meta.env.VITE_STORAGE_BASE_URL + user.image_path : ""}
                            />
                            <Stack gap={0} alignItems={"start"} justifyContent={"center"}>
                                <Button component="label" variant="text" disabled={isPendingImage}>
                                    {user?.image_path ? "Editar imagem" : "Adicionar imagem"}
                                    <VisuallyHiddenInput
                                        type="file"
                                        onChange={handleImageChange}
                                        accept="jpeg,png,jpg"
                                    />
                                </Button>
                                {user?.image_path && (
                                    <Button
                                        variant="text"
                                        color="error"
                                        onClick={() => deleteImage()}
                                        disabled={isPendingDeleteImage}
                                    >
                                        Excluir imagem
                                    </Button>
                                )}
                            </Stack>
                        </Stack>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            name="name"
                            label="Nome"
                            disabled={isPending}
                            defaultValue={user?.name}
                            error={!!errors?.name}
                            helperText={errors?.name?.[0]}
                            required
                        />
                    </Grid>
                    <Grid size={{ xs: 0, md: 6 }}></Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            name="email"
                            label="Email"
                            type="email"
                            defaultValue={user?.email}
                            disabled={isPending}
                            error={!!errors?.email}
                            helperText={errors?.email?.[0]}
                            required
                        />
                        {!user?.email_verified_at && (
                            <Stack direction="row" alignItems="center" mt={1} gap={1}>
                                <Typography sx={{ fontSize: "var(--xs-font-size)" }}>Email não verificado.</Typography>
                                <Link
                                    component="button"
                                    onClick={sendVerifyEmailLink}
                                    disabled={isPendingVerifyEmailLink}
                                    sx={{ fontSize: "var(--xs-font-size)" }}
                                >
                                    Reenviar email de verificação.
                                </Link>
                            </Stack>
                        )}
                    </Grid>
                    <Grid size={{ xs: 0, md: 6 }}></Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            name="phone"
                            label="Número de celular"
                            disabled={isPending}
                            defaultValue={user?.phone}
                            error={!!errors?.phone}
                            helperText={errors?.phone}
                            slotProps={{
                                input: {
                                    inputComponent: TextMaskCustom,
                                },
                            }}
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
