import * as React from "react";
import { styled } from "@mui/material/styles";
import { useLocation, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import useAuth from "../hooks/useAuth";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import api from "../api";
import { useQueryClient } from "@tanstack/react-query";
import { Icon, Stack } from "@mui/material";
import Collapse from "@mui/material/Collapse";
import { useState } from "react";
const drawerWidth = 240;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up("sm")]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    height: 64,
    ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    ...(open && {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
    }),
    ...(!open && {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
    }),
}));

export default function NavigationLayout({ children }) {

    const queryClient = useQueryClient();
    const location = useLocation();
    const navigate = useNavigate();
    const { user, cleanup } = useAuth();
    const [openCollapse, setOpenCollapse] = useState(location.pathname === "/events/dashboard" || location.pathname === "/events/participating" ? true : false);
    const [open, setOpen] = React.useState(() => {
        const storedOpen = sessionStorage.getItem("open");
        return storedOpen === "true";
    });

    React.useEffect(() => {
        sessionStorage.setItem("open", open.toString());
    }, [open]);

    const [anchorEl, setAnchorEl] = React.useState(null);
    const openMenu = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const { mutate: handleLogout, isPending: isPendingLogout } = useMutation({
        mutationFn: async () => {
            return await api.delete("/logout");
        },
        onError: (error) => {
            const { message } = error.response.data;
            toast.error(message);
        },
        onSuccess: (data) => {
            const { message } = data.data;
            cleanup();
            toast.success(message);
            navigate("/");
            queryClient.resetQueries();
        },
    });

    const pages = [
        {
            title: "Início",
            href: "/",
            disabled: false,
            show: true,
            activeIcon: (
                <Icon
                    sx={{ color: "var(--white-color)" }}
                    baseClassName="material-icons"
                >
                    home
                </Icon>
            ),
            inactiveIcon: (
                <Icon sx={{ color: "var(--white-color)" }}>home</Icon>
            ),
        },
        {
            title: "Meus eventos",
            disabled: false,
            subItens: [
                {
                    title: "Criados",
                    href: "/events/dashboard",
                    disabled: false,
                    show: !!user,
                    activeIcon: (
                        <Icon
                            sx={{ color: "var(--white-color)" }}
                            baseClassName="material-icons"
                        >
                            dashboard
                        </Icon>
                    ),
                    inactiveIcon: (
                        <Icon sx={{ color: "var(--white-color)" }}>
                            dashboard
                        </Icon>
                    ),
                },
                {
                    title: "Participando",
                    href: "/events/participating",
                    disabled: false,
                    show: !!user,
                    activeIcon: (
                        <Icon
                            sx={{ color: "var(--white-color)" }}
                            baseClassName="material-icons"
                        >
                            run_circle
                        </Icon>
                    ),
                    inactiveIcon: (
                        <Icon sx={{ color: "var(--white-color)" }}>
                            run_circle
                        </Icon>
                    ),
                },
            ],
            show: !!user,
            activeIcon: (
                <Icon
                    sx={{ color: "var(--white-color)" }}
                    baseClassName="material-icons"
                >
                    emoji_events
                </Icon>
            ),
            inactiveIcon: (
                <Icon sx={{ color: "var(--white-color)" }}>emoji_events</Icon>
            ),
        },
        {
            title: "Ajuda",
            href: "/help",
            disabled: false,
            show: true,
            activeIcon: (
                <Icon
                    sx={{ color: "var(--white-color)" }}
                    baseClassName="material-icons"
                >
                    help_center_icon
                </Icon>
            ),
            inactiveIcon: (
                <Icon sx={{ color: "var(--white-color)" }}>
                    help_center_icon
                </Icon>
            ),
        },
        {
            title: "Termos",
            href: "/terms",
            disabled: false,
            show: true,
            activeIcon: (
                <Icon
                    sx={{ color: "var(--white-color)" }}
                    baseClassName="material-icons"
                >
                    article_icon
                </Icon>
            ),
            inactiveIcon: (
                <Icon sx={{ color: "var(--white-color)" }}>article_icon</Icon>
            ),
        },
    ];

    return (
        <Stack flexDirection="row" width="100%" sx={{ overflowX: "hidden" }}>
            <Box sx={{ flexGrow: 0 }}>
                {" "}
                <Drawer
                    variant="permanent"
                    open={open}
                    PaperProps={{
                        elevation: 8,
                        sx: {
                            backgroundColor: "var(--primary-color)",
                        },
                    }}
                >
                    <DrawerHeader>
                        {!open ? (
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                onClick={handleDrawerOpen}
                                title="Expandir menu"
                                sx={{ margin: "0 auto" }}
                            >
                                <Icon sx={{ color: "var(--white-color)" }}>
                                    menu
                                </Icon>
                            </IconButton>
                        ) : (
                            <IconButton
                                onClick={handleDrawerClose}
                                title="Reduzir menu"
                            >
                                <Icon sx={{ color: "var(--white-color)" }}>
                                    turn_left
                                </Icon>
                            </IconButton>
                        )}
                    </DrawerHeader>
                    <Divider />
                    <List sx={{ p: 0 }}>
                        {pages.map((page, index) => {
                            return (
                                <>
                                    <ListItem
                                        key={page.title}
                                        disablePadding
                                        sx={{
                                            display: page.show
                                                ? "block"
                                                : "none",
                                            borderLeft:
                                                page.href === location.pathname
                                                    ? "3px solid var(--secondary-color)"
                                                    : "3px solid transparent",
                                        }}
                                    >
                                        <ListItemButton
                                            sx={{
                                                minHeight: 48,
                                                justifyContent: open
                                                    ? "initial"
                                                    : "center",
                                                px: 2.5,
                                            }}
                                            title={page.title}
                                            selected={
                                                page.href === location.pathname
                                            }
                                            onClick={() =>
                                                page.title === "Meus eventos"
                                                    ? setOpenCollapse(
                                                          !openCollapse
                                                      )
                                                    : navigate(page.href)
                                            }
                                            disabled={page.disabled}
                                        >
                                            <ListItemIcon
                                                sx={{
                                                    minWidth: 0,
                                                    mr: open ? 3 : "auto",
                                                    justifyContent: "center",
                                                    color: "var(--white-color)",
                                                }}
                                            >
                                                {page.href === location.pathname
                                                    ? page.activeIcon
                                                    : page.inactiveIcon}
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={page.title}
                                                sx={{ opacity: open ? 1 : 0 }}
                                                primaryTypographyProps={{
                                                    color: "var(--white-color)",
                                                    fontWeight:
                                                        page.href ===
                                                        location.pathname
                                                            ? 500
                                                            : "",
                                                }}
                                            />
                                            {page.title === "Meus eventos" ? (
                                                openCollapse ? (
                                                    <Icon
                                                        sx={{
                                                            color: "var(--white-color)",
                                                        }}
                                                    >
                                                        expand_less
                                                    </Icon>
                                                ) : (
                                                    <Icon
                                                        sx={{
                                                            color: "var(--white-color)",
                                                        }}
                                                    >
                                                        expand_more
                                                    </Icon>
                                                )
                                            ) : null}
                                        </ListItemButton>
                                    </ListItem>
                                    {page?.subItens &&
                                        page.subItens.map(
                                            (subItem, subIndex) => {
                                                return (
                                                    <Collapse
                                                        in={openCollapse}
                                                        timeout="auto"
                                                        unmountOnExit
                                                        key={subIndex}
                                                        sx={{ ml: "2.5px" }}
                                                    >
                                                        <List
                                                            component="div"
                                                            disablePadding
                                                        >
                                                            <ListItemButton
                                                                sx={{
                                                                    minHeight: 48,
                                                                    justifyContent:
                                                                        open
                                                                            ? "initial"
                                                                            : "center",
                                                                    px: 2.5,
                                                                    ml:
                                                                        openCollapse &&
                                                                        open
                                                                            ? 3
                                                                            : 0,
                                                                    borderLeft:
                                                                        subItem.href ===
                                                                        location.pathname
                                                                            ? "3px solid var(--secondary-color)"
                                                                            : "3px solid transparent",
                                                                }}
                                                                onClick={() =>
                                                                    navigate(
                                                                        subItem.href
                                                                    )
                                                                }
                                                                selected={
                                                                    location.pathname ===
                                                                    subItem.href
                                                                }
                                                                disabled={
                                                                    subItem.disabled
                                                                }
                                                            >
                                                                <ListItemIcon
                                                                    sx={{
                                                                        minWidth: 0,
                                                                        mr: open
                                                                            ? 3
                                                                            : "auto",
                                                                        justifyContent:
                                                                            "center",
                                                                        color: "var(--white-color)",
                                                                    }}
                                                                >
                                                                    {subItem.href ===
                                                                    location.pathname
                                                                        ? subItem.activeIcon
                                                                        : subItem.inactiveIcon}
                                                                </ListItemIcon>
                                                                {open && (
                                                                    <ListItemText
                                                                        primary={
                                                                            subItem.title
                                                                        }
                                                                        sx={{
                                                                            opacity:
                                                                                open
                                                                                    ? 1
                                                                                    : 0,
                                                                        }}
                                                                        primaryTypographyProps={{
                                                                            color: "var(--white-color)",
                                                                            fontWeight:
                                                                                location.pathname ===
                                                                                subItem.href
                                                                                    ? 500
                                                                                    : "",
                                                                        }}
                                                                    />
                                                                )}
                                                            </ListItemButton>
                                                        </List>
                                                    </Collapse>
                                                );
                                            }
                                        )}
                                </>
                            );
                        })}
                    </List>
                    <Box
                        sx={{ mt: "auto", mb: 2, px: 2 }}
                        display="flex"
                        flexDirection={open ? "row" : "column-reverse"}
                        justifyContent={open ? "space-between" : "center"}
                        alignItems="center"
                        gap={2}
                    >
                        {!!user ? (
                            <>
                                <IconButton
                                    onClick={handleClick}
                                    title={user?.name}
                                >
                                    <Avatar
                                        sx={{ margin: "0 auto" }}
                                        src={
                                            user?.image_path
                                                ? import.meta.env
                                                      .VITE_STORAGE_BASE_URL +
                                                  user.image_path
                                                : ""
                                        }
                                    />
                                </IconButton>
                                {open && (
                                    <Typography
                                        sx={{
                                            color: "var(--white-color)",
                                            flexGrow: 1,
                                            textAlign: "left",
                                        }}
                                        noWrap
                                    >
                                        {user?.name}
                                    </Typography>
                                )}
                                <Menu
                                    id="basic-menu"
                                    anchorEl={anchorEl}
                                    open={openMenu}
                                    onClose={handleClose}
                                    MenuListProps={{
                                        "aria-labelledby": "basic-button",
                                    }}
                                    sx={{ maxWidth: 300 }}
                                    anchorOrigin={{
                                        vertical: "top",
                                        horizontal: "right",
                                    }}
                                    transformOrigin={{
                                        vertical: "top",
                                        horizontal: "left",
                                    }}
                                >
                                    <MenuItem divider>
                                        <ListItemText
                                            primaryTypographyProps={{
                                                fontWeight: 700,
                                                noWrap: true,
                                            }}
                                        >
                                            {user?.name}
                                        </ListItemText>
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() => navigate("/settings")}
                                    >
                                        <ListItemIcon>
                                            <Icon fontSize="small">
                                                settings
                                            </Icon>
                                        </ListItemIcon>
                                        <ListItemText>
                                            Configurações
                                        </ListItemText>
                                    </MenuItem>
                                    <MenuItem
                                        onClick={handleLogout}
                                        disabled={isPendingLogout}
                                    >
                                        <ListItemIcon
                                            sx={{
                                                color: "var(--danger-color)",
                                            }}
                                        >
                                            <Icon fontSize="small">logout</Icon>
                                        </ListItemIcon>
                                        <ListItemText
                                            primaryTypographyProps={{
                                                color: "var(--danger-color)",
                                            }}
                                        >
                                            Encerrar sessão
                                        </ListItemText>
                                    </MenuItem>
                                </Menu>
                            </>
                        ) : (
                            <>
                                {open ? (
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        sx={{ color: "var(--white-color)" }}
                                        fullWidth
                                        startIcon={<Icon>login</Icon>}
                                        title="Entrar"
                                        onClick={() => navigate("/login")}
                                    >
                                        {open ? "Entrar" : ""}
                                    </Button>
                                ) : (
                                    <IconButton
                                        sx={{
                                            color: "var(--white-color)",
                                            backgroundColor:
                                                "var(--secondary-color)",
                                        }}
                                        title="Entrar"
                                        onClick={() => navigate("/login")}
                                    >
                                        <Icon>login</Icon>
                                    </IconButton>
                                )}
                            </>
                        )}
                    </Box>
                </Drawer>
            </Box>

            <Box
                component="main"
                sx={{
                    p: 4,
                    flexGrow: 1,
                    overflowX: "auto",
                    minWidth: 0,
                }}
            >
                {children}
            </Box>
        </Stack>
    );
}
