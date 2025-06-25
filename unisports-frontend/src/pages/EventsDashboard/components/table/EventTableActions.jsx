import { useState } from "react";
import {
    Icon,
    MenuItem,
    Menu,
    Popover,
    ListItemIcon,
    Typography,
} from "@mui/material";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { EventDialog } from "../modals/EventDialog";
import { DeleteEventDialog } from "../modals/DeleteEventDialog";
import { ParticipantsDialog } from "../modals/ParticipantsDialog";
import { GalleryDialog } from "../modals/GalleryDialog";

export default function EventTableActions({ data }) {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;

    const [openDialog, setOpenDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openParticipantsDialog, setOpenParticipantsDialog] = useState(false);
    const [openGalleryDialog, setOpenGalleryDialog] = useState(false);

    return (
        <>
            <GridActionsCellItem
                icon={<Icon>more_vert</Icon>}
                label="Ações"
                onClick={handleClick}
            />
            {openDialog && (
                <EventDialog
                    data={data}
                    open={openDialog}
                    handleClose={() => setOpenDialog(false)}
                />
            )}
            {openDeleteDialog && (
                <DeleteEventDialog
                    id={data?.id}
                    open={openDeleteDialog}
                    handleClose={() => setOpenDeleteDialog(false)}
                />
            )}
            {openParticipantsDialog && (
                <ParticipantsDialog
                    open={openParticipantsDialog}
                    handleClose={() => setOpenParticipantsDialog(false)}
                    id={data?.id}
                />
            )}
            {openGalleryDialog && (
                <GalleryDialog
                    open={openGalleryDialog}
                    handleClose={() => setOpenGalleryDialog(false)}
                    id={data?.id}
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
                    <MenuItem
                        onClick={() => {
                            setOpenParticipantsDialog(true);
                        }}
                    >
                        <ListItemIcon>
                            <Icon fontSize="small">group</Icon>
                        </ListItemIcon>
                        <Typography>Ver Participantes</Typography>
                    </MenuItem>
                    <MenuItem
                        onClick={() => {
                            setOpenGalleryDialog(true);
                        }}
                    >
                        <ListItemIcon>
                            <Icon fontSize="small">photo_library</Icon>
                        </ListItemIcon>
                        <Typography>Ver Galeria</Typography>
                    </MenuItem>
                    <MenuItem
                        onClick={() => {
                            setOpenDialog(true);
                        }}
                    >
                        <ListItemIcon>
                            <Icon fontSize="small">edit</Icon>
                        </ListItemIcon>
                        <Typography>Editar</Typography>
                    </MenuItem>
                    <MenuItem
                        onClick={() => {
                            setOpenDeleteDialog(true);
                        }}
                    >
                        <ListItemIcon>
                            <Icon
                                fontSize="small"
                                sx={{ color: "var(--danger-color)" }}
                            >
                                delete
                            </Icon>
                        </ListItemIcon>
                        <Typography sx={{ color: "var(--danger-color)" }}>
                            Excluir
                        </Typography>
                    </MenuItem>
                </Menu>
            </Popover>
        </>
    );
}
