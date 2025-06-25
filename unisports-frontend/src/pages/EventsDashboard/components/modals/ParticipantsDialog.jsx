import React from "react";
import { Box, Button, DialogContent, DialogActions, Avatar, Stack, Typography, Icon } from "@mui/material";
import { CustomDialog } from "../../../../components/Dialogs/CustomDialog";
import api from "../../../../api";
import { CustomDataGrid } from "../../../../components/DataGrid/CustomDataGrid";
import { useQuery } from "@tanstack/react-query";
import ParticipantsTableActions from "../table/ParticipantsTableActions";
import useAuth from "../../../../hooks/useAuth";

const genColumns = (user) => [
    {
        field: "name",
        headerName: "Participante",
        flex: 1,
        renderCell: (params) => (
            <Stack flexDirection="row" gap={2} justifyContent="start" alignItems="center" height="100%">
                <Avatar
                    src={
                        params?.row?.user?.image_path
                            ? import.meta.env.VITE_STORAGE_BASE_URL + params?.row?.user?.image_path
                            : ""
                    }
                />
                <Typography>{params?.row?.user?.name}</Typography>
                {user.id === params?.row?.user_id && (
                    <Typography fontSize="var(--xs-font-size)">{"(Este é você)"}</Typography>
                )}
            </Stack>
        ),
    },
    {
        field: "phone",
        headerName: "Telefone",
        flex: 1,
        renderCell: (params) => (
            <Stack flexDirection="row" gap={2} justifyContent="start" alignItems="center" height="100%">
                <Typography>{params?.row?.user?.phone}</Typography>
            </Stack>
        ),
    },
    {
        field: "is_paid",
        headerName: "Pago",
        flex: 1,
        type: "boolean",
        renderCell: (params) => {
            if (!!params?.row?.is_paid) {
                return <Icon sx={{ color: "var(--success-color)" }}>check</Icon>;
            } else {
                return <Icon sx={{ color: "var(--danger-color)" }}>close</Icon>;
            }
        },
    },
    {
        field: "actions",
        type: "actions",
        width: 80,
        getActions: (params) => [<ParticipantsTableActions data={params.row} isCreatorRow={user.id === params?.row?.user_id}/>],
    },
];

export const ParticipantsDialog = ({ open, handleClose, id }) => {
    
    const { user } = useAuth();

    const { data, isLoading, isRefetching } = useQuery({
        queryKey: ["EVENT_DASHBOARD_PARTICIPANTS", id],
        queryFn: async () => {
            const response = await api.get(`/events/dashboard/${id}/participants`);
            return response.data;
        },
        enabled: !!open && !!id,
    });

    return (
        <CustomDialog open={open} handleClose={handleClose} title="Ver Participantes" maxWidth="md">
            <DialogContent>
                <Box sx={{ width: "100%" }}>
                    <CustomDataGrid
                        rows={data?.data ?? []}
                        getRowId={(row) => row.id}
                        columns={genColumns(user)}
                        loading={isLoading || isRefetching}
                        initialState={{
                            pagination: {
                                paginationModel: { pageSize: 25 },
                            },
                        }}
                        disableColumnMenu
                        pageSizeOptions={[25, 50, 100]}
                        disableRowSelectionOnClick
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={handleClose}>
                    Voltar
                </Button>
            </DialogActions>
        </CustomDialog>
    );
};
