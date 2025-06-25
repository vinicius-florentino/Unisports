import React from "react";
import { Box, Grid2 as Grid, Typography, Button, DialogContent, DialogActions } from "@mui/material";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CustomDialog } from "../../../../components/Dialogs/CustomDialog";
import api from "../../../../api";

export const DeleteEventDialog = ({ open, handleClose, id }) => {

    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: () => api.delete(`/events/dashboard/${id}`),
        onError: (error) => {
            const { message } = error.response.data;
            toast.error(message);
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries("EVENTS_DASHBOARD");
            const { message } = data.data;
            toast.success(message);
            handleClose();
        },
    });

    return (
        <CustomDialog
            open={open}
            handleClose={handleClose}
            title={"Excluir evento"}
        >
            <DialogContent>
                <Box sx={{ width: "100%", my: 1 }}>
                    <Grid container spacing={2}>
                        <Grid size={12}>
                            <Typography>
                                Depois que seu evento for excluído, todos os dados referentes serão excluídos
                                permanentemente.
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={handleClose}>
                    Voltar
                </Button>
                <Button
                    variant="contained"
                    onClick={() => {
                        mutate();
                    }}
                    disabled={isPending}
                    color="error"
                >
                    {isPending ? "Excluindo..." : "Excluir"}
                </Button>
            </DialogActions>
        </CustomDialog>
    );
};
