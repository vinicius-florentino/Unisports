import * as React from "react";
import { styled } from "@mui/material/styles";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import { Icon, Avatar, Typography } from "@mui/material";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

const drawerWidth = 300;

const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    padding: "16px",
    ...theme.mixins.toolbar,
    justifyContent: "space-between",
}));

export const ParticipantsListDrawer = ({ data, open, handleClose }) => {
    return (
        <Drawer
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                    width: drawerWidth,
                    boxSizing: "border-box",
                },
            }}
            anchor="right"
            open={open}
            onClose={handleClose}
        >
            <DrawerHeader>
                <Typography fontWeight={700}>Participantes</Typography>
                <IconButton onClick={handleClose}>
                    <Icon>close</Icon>
                </IconButton>
            </DrawerHeader>
            <Divider />
            <List>
                {data?.map((dt, index) => (
                    <ListItem key={index} disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                <Avatar
                                    alt={`${dt.user.name} ${index === 0 ? "(criador)" : ""}` || "Usuário"}
                                    src={
                                        import.meta.env.VITE_STORAGE_BASE_URL + dt.user.image_path ||
                                        "/static/images/avatar/1.jpg"
                                    }
                                    sx={{
                                        ...(index === 0 && {
                                            // width: 46,
                                            // height: 46,
                                            border: "3px solid var(--warning-color) !important",
                                        }),
                                    }}
                                />
                            </ListItemIcon>
                            <ListItemText primary={`${dt.user.name} ${index === 0 ? "(criador)" : ""}`} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Drawer>
    );
};
