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
import { DeleteGalleryImageDialog } from "../modals/DeleteGalleryImageDialog";

export default function GalleryTableActions({ data, eventId }) {

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

    return (
        <>
            <GridActionsCellItem
                icon={<Icon>more_vert</Icon>}
                label="Ações"
                onClick={handleClick}
            />
            {openDeleteDialog && (
                <DeleteGalleryImageDialog
                    index={data?.index}
                    eventId={eventId}
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
