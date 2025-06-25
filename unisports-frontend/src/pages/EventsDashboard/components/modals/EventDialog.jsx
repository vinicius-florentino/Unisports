import React, { useState, useRef } from "react";
import { Box, Grid2 as Grid, TextField, Button, DialogContent, DialogActions, FormControlLabel, Checkbox } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SelectSport } from "../../../../components/Selects/SelectSport";
import { AutocompletePlaces } from "../../../../components/Autocompletes/AutocompletePlaces";
import { CustomDialog } from "../../../../components/Dialogs/CustomDialog";
import api from "../../../../api";
import PriceFormatMask from "../../../../utils/PriceFormatMask";
import dayjs from "dayjs";

export const EventDialog = ({ open, handleClose, data }) => {

    const [errors, setErrors] = useState({});
    const queryClient = useQueryClient();
    const [location, setLocation] = useState(data?.location || undefined);
    const start_at = useRef(data?.start_at ? dayjs(data.start_at) : undefined);
    const finishes_at = useRef(data?.finishes_at ? dayjs(data.finishes_at) : undefined);
    const splitPriceByParticipants = useRef(!!data?.split_price_by_participants);

    const { mutate, isPending } = useMutation({
        mutationFn: (newData) => (!data ? api.post("/events/dashboard", newData) : api.put(`/events/dashboard/${data.id}`, newData)),
        onError: (error) => {
            const { message, errors } = error.response.data;
            setErrors(errors);
            toast.error(message);
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries("EVENTS_DASHBOARD");
            const { message } = data.data;
            toast.success(message);
            handleClose();
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        if (!!data.price) {
            data.price = data.price.replace("R$", "").trim().replace(/\./g, "").replace(/,/g, ".") ?? null;
        }
        data.split_price_by_participants = splitPriceByParticipants.current;
        if (!!location) {
            data.location = location;
        }
        if (dayjs.isDayjs(start_at.current) && start_at.current.isValid()) {
            data.start_at = start_at.current.toISOString() ?? null;
        }
        if (dayjs.isDayjs(finishes_at.current) && finishes_at.current.isValid()) {
            data.finishes_at = finishes_at.current.toISOString() ?? null;
        }
        mutate(data);
    };

    return (
        <CustomDialog
            open={open}
            handleClose={handleClose}
            component="form"
            onSubmit={handleSubmit}
            title={data ? "Editar evento" : "Criar evento"}
        >
            <DialogContent>
                <Box sx={{ width: "100%", my: 1 }}>
                    <Grid container spacing={2}>
                        <Grid size={12}>
                            <TextField
                                name="title"
                                label="Titulo"
                                defaultValue={data?.title}
                                required
                                autoFocus
                                error={!!errors?.title}
                                helperText={!!errors?.title && errors?.title[0]}
                            />
                        </Grid>
                        <Grid size={12}>
                            <TextField
                                name="description"
                                label="Descrição"
                                error={!!errors?.description}
                                helperText={!!errors?.description && errors?.description[0]}
                                multiline
                                rows={4}
                                defaultValue={data?.description}
                                required
                            />
                        </Grid>
                        <Grid size={{ md: 6, xs: 12 }}>
                            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
                                <DateTimePicker
                                    name="start_at"
                                    label="Data de início"
                                    defaultValue={start_at.current}
                                    onChange={(v) => {
                                        start_at.current = v;
                                    }}
                                    minDateTime={dayjs()}
                                    maxDateTime={data?.finishes_at ? dayjs(data?.finishes_at) : undefined}
                                    slotProps={{
                                        textField: {
                                            required: true,
                                            error: !!errors?.start_at,
                                            helperText: !!errors?.start_at && errors?.start_at[0],
                                        },
                                    }}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid size={{ md: 6, xs: 12 }}>
                            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
                                <DateTimePicker
                                    name="finishes_at"
                                    label="Data de fim"
                                    defaultValue={finishes_at.current}
                                    onChange={(v) => {
                                        finishes_at.current = v;
                                    }}
                                    minDateTime={data?.start_at ? dayjs(data?.start_at) : undefined}
                                    slotProps={{
                                        textField: {
                                            error: !!errors?.finishes_at,
                                            helperText: !!errors?.finishes_at && errors?.finishes_at[0],
                                        },
                                    }}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid size={{ md: 6, xs: 12 }}>
                            <SelectSport defaultValue={data?.sport_id || ""} />
                        </Grid>
                        <Grid size={{ md: 6, xs: 12 }}>
                            <TextField
                                name="max_participants"
                                defaultValue={data?.max_participants}
                                label="Máximo de participantes"
                                type="number"
                                error={!!errors?.max_participants}
                                helperText={!!errors?.max_participants && errors?.max_participants[0]}
                                slotProps={{ htmlInput: { min: 1 } }}
                            />
                        </Grid>
                        <Grid size={12}>
                            <AutocompletePlaces onChange={setLocation} defaultValue={data?.location} />
                        </Grid>
                        <Grid size={12}>
                            <TextField
                                label="Preço"
                                name="price"
                                defaultValue={data?.price}
                                error={!!errors?.price}
                                helperText={!!errors?.price && errors?.price[0]}
                                slotProps={{ input: { inputComponent: PriceFormatMask } }}
                            />
                        </Grid>
                        <Grid size={12}>
                            <FormControlLabel
                                control={<Checkbox defaultChecked={data?.split_price_by_participants} onChange={(e) => {
                                    splitPriceByParticipants.current = e.target.checked
                                }}/>}
                                label="Dividir o preço pela quantidade de participantes"
                            />
                        </Grid>
                    </Grid>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={handleClose}>
                    Voltar
                </Button>
                <Button variant="contained" type="submit" disabled={isPending}>
                    {isPending ? "Salvando..." : "Salvar"}
                </Button>
            </DialogActions>
        </CustomDialog>
    );
};
