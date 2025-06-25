import {
    Box,
    Grid2 as Grid,
    TextField,
    Button,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    Typography,
    DialogActions,
} from "@mui/material";
import api from "../../../../../api";
import { toast } from "react-toastify";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../../../hooks/useAuth";

export const DeleteAccount = () => {
    const [errors, setErrors] = useState({});
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const { cleanup } = useAuth();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setErrors({});
    };

    const { mutate, isPending } = useMutation({
        mutationFn: (data) => {
            return api.put("/settings/account/delete", data);
        },
        onError: (error) => {
            const { message, errors } = error.response.data;
            setErrors(errors);
            toast.error(message);
        },
        onSuccess: (data) => {
            const { message } = data.data;
            toast.success(message);
            handleClose();
            cleanup();
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
        <>
            <Box>
                <Grid container spacing={0} rowSpacing={2}>
                    <Grid size={12}>
                        <Typography>
                            Depois que sua conta for excluída, todos os seus dados referentes serão excluídos
                            permanentemente. Por favor digite sua senha para confirmar que deseja excluir
                            permanentemente sua conta.
                        </Typography>
                    </Grid>
                    <Button color="error" variant="outlined" disabled={isPending} onClick={handleClickOpen}>
                        Excluir conta
                    </Button>
                </Grid>
            </Box>
            {open && (
                <Dialog open={open} onClose={handleClose} component="form" noValidate onSubmit={handleSubmit}>
                    <DialogTitle>Excluir conta</DialogTitle>
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{ position: "absolute", right: 16, top: 12 }}
                    ></IconButton>
                    <DialogContent>
                        <Grid container spacing={2}>
                            <Grid size={12}>
                                <TextField
                                    required
                                    type="password"
                                    name="password"
                                    label="Senha"
                                    error={!!errors.password}
                                    helperText={errors.password}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="outlined" onClick={handleClose}>
                            Voltar
                        </Button>
                        <Button disabled={isPending} type="submit" variant="outlined" color="error">
                            Excluir
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </>
    );
};
