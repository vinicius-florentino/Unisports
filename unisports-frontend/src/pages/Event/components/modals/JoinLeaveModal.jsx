import * as React from "react";
import { CustomDialog } from "../../../../components/Dialogs/CustomDialog";
import { Grid2 as Grid, Button, Box, Typography, DialogContent, DialogActions } from "@mui/material";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../../api";
import dayjs from "dayjs";

export default function JoinLeaveModal({ open, handleClose, data, isParticipating }) {

    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: () => (isParticipating ? api.delete(`/events/${data?.id}/leave`) : api.post(`/events/${data?.id}/join`)),
        onError: (error) => {
            handleClose();
            const { message } = error.response.data;
            toast.error(message);
        },
        onSuccess: (data) => {
            handleClose();
            queryClient.invalidateQueries("EVENT", data?.id);
            const { message } = data.data;
            toast.success(message);
        },
    });

    return (
        <CustomDialog
            open={open}
            handleClose={handleClose}
            title={isParticipating ? "Cancelar participação em evento" : "Participar de evento"}
        >
            <DialogContent>
                <Box sx={{ width: "100%", my: 1 }}>
                    <Grid container spacing={2}>
                        <Grid size={12}>
                            <Typography>
                                Deseja {!isParticipating ? "participar" : "cancelar sua participação"} do evento {data?.title} {" "}
                                que iniciará na data {dayjs(data?.start_at).format("DD/MM/YYYY HH:mm")} ?
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
                    variant={isParticipating ? "outlined" : "contained"}
                    color={isParticipating ? "error" : "primary"}
                    disabled={isPending}
                    onClick={() => mutate()}
                >
                    {isParticipating ? "Cancelar" : "Confirmar"}
                </Button>
            </DialogActions>
        </CustomDialog>
    );
}
