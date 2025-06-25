import { useState } from "react";
import { Icon, MenuItem, Menu, Popover, ListItemIcon, Typography } from "@mui/material";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { DeleteParticipantDialog } from "../modals/DeleteParticipantDialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../../api";

export default function ParticipantsTableActions({ data, isCreatorRow }) {

    const queryClient = useQueryClient();
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;

    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const { mutate, isPending } = useMutation({
        mutationFn: async () => {
            return await api.put(`/events/dashboard/${data?.event_id}/participants/${data?.id}`, {
                is_paid: !data?.is_paid,
            });
        },
        onError: (error) => {
            const { message } = error.response.data;
            toast.error(message);
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries("EVENT_DASHBOARD_PARTICIPANTS", data?.event_id);
            const { message } = data.data;
            toast.success(message);
        },
    });

    return (
        <>
            <GridActionsCellItem icon={<Icon>more_vert</Icon>} label="Ações" onClick={handleClick} />
            {openDeleteDialog && (
                <DeleteParticipantDialog
                    id={data?.id}
                    eventId={data?.event_id}
                    open={openDeleteDialog}
                    handleClose={() => setOpenDeleteDialog(false)}
                />
            )}
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
            >
                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{ "aria-labelledby": "basic-button" }}
                >
                    {!!data?.is_paid ? (
                        <MenuItem
                            onClick={() => {
                                mutate();
                            }}
                            disabled={isPending}
                        >
                            <ListItemIcon sx={{ color: "var(--danger-color)" }}>
                                <Icon fontSize="small">close</Icon>
                            </ListItemIcon>
                            <Typography sx={{ color: "var(--danger-color)" }}>Marcar como não pago</Typography>
                        </MenuItem>
                    ) : (
                        <MenuItem
                            onClick={() => {
                                mutate();
                            }}
                            disabled={isPending}
                        >
                            <ListItemIcon sx={{ color: "var(--success-color)" }}>
                                <Icon fontSize="small">check</Icon>
                            </ListItemIcon>
                            <Typography sx={{ color: "var(--success-color)" }}>Marcar como pago</Typography>
                        </MenuItem>
                    )}

                    <MenuItem
                        onClick={() => {
                            setOpenDeleteDialog(true);
                        }}
                        disabled={isCreatorRow}
                    >
                        <ListItemIcon>
                            <Icon fontSize="small" sx={{ color: "var(--danger-color)" }}>
                                delete
                            </Icon>
                        </ListItemIcon>
                        <Typography sx={{ color: "var(--danger-color)" }}>Excluir</Typography>
                    </MenuItem>
                </Menu>
            </Popover>
        </>
    );
}
