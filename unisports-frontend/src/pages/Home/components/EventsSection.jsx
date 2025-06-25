import { useRef, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    Stack,
    Pagination,
    Typography,
    Paper,
    InputBase,
    Icon,
    IconButton,
    Divider,
    Popover,
    Alert,
    Grid2 as Grid,
    Button,
} from "@mui/material";
import { HorizontalEventCard } from "../../../components/Card/HorizontalEventCard";
import api from "../../../api";
import { SelectSport } from "../../../components/Selects/SelectSport";
import { Loading } from "../../../components/Loading";
import { Link } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const EventsSection = () => {
    const [page, setPage] = useState(1);
    const actualPage = useRef(1);
    const search = useRef(null);
    const sportId = useRef(null);
    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;

    const {
        data: events,
        isPending,
        refetch,
    } = useQuery({
        queryKey: ["EVENTS"],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (search.current) {
                params.append("search", search.current);
            }
            if (actualPage.current) {
                params.append("page", actualPage.current);
            }
            if (sportId.current) {
                params.append("sport_id", sportId.current);
            }

            const response = await api.get(`/events`, { params });
            return response.data;
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        search.current = data.search ?? null;
        actualPage.current = 1;
        refetch();
    };

    useEffect(() => {
        setPage(actualPage.current);
    }, [actualPage.current]);

    return (
        <Stack gap={4} alignItems="center">
            <Stack alignItems="flex-start" sx={{ width: "100%" }}>
                <Paper component="form" sx={{ p: 0.5, display: "flex", alignItems: "center", maxWidth: 400 }} onSubmit={handleSubmit}>
                    <InputBase
                        sx={{ ml: 1, flex: 1 }}
                        placeholder="Buscar evento"
                        inputProps={{ "aria-label": "buscar evento" }}
                        name="search"
                    />
                    <IconButton type="submit" sx={{ p: "10px" }} aria-label="pesquisar" title="Pesquisar">
                        <Icon>search</Icon>
                    </IconButton>
                    <Divider sx={{ height: 28, mx: 0.5 }} orientation="vertical" />
                    <IconButton sx={{ p: "10px" }} aria-label="filtrar" onClick={handleClick} title="Filtrar">
                        <Icon>filter_alt</Icon>
                    </IconButton>
                    <Popover
                        id={id}
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "left",
                        }}
                        slotProps={{
                            paper: { sx: { minWidth: 300, p: 2 } },
                        }}
                    >
                        <Grid container spacing={2}>
                            <Grid size={12}>
                                <SelectSport
                                    onChange={(e) => {
                                        sportId.current = e.target.value;
                                        refetch();
                                    }}
                                    defaultValue={sportId.current}
                                />
                            </Grid>
                            <Grid size={12}>
                                <Button
                                    variant="outlined"
                                    onClick={() => {
                                        sportId.current = null;
                                        refetch();
                                        handleClose();
                                    }}
                                    disabled={!sportId.current || isPending}
                                >
                                    Limpar
                                </Button>
                            </Grid>
                        </Grid>
                    </Popover>
                </Paper>
            </Stack>

            {!isPending ? (
                events?.data?.data?.length > 0 ? (
                    <>
                        <Grid container spacing={2} sx={{ width: "100%" }} alignItems="stretch">
                            {events.data.data.map((event, index) => (
                                <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
                                    <Link onClick={() => navigate(`/event/${event.id}`)} style={{ textDecoration: 'none', cursor: "pointer" }}>
                                        <HorizontalEventCard data={event} />
                                    </Link>
                                </Grid>
                            ))}
                        </Grid>
                        <Pagination
                            count={events.data.last_page}
                            color="primary"
                            disabled={isPending}
                            page={page}
                            onChange={(e, v) => {
                                actualPage.current = v;
                                refetch();
                            }}
                        />
                        <Typography fontSize="var(--xs-font-size)">Foram encontrados {events.data.total} resultado(s).</Typography>
                    </>
                ) : (
                    <Alert severity="info" sx={{ width: "100%" }}>
                        Nenhum resultado encontrado
                    </Alert>
                )
            ) : (
                <Loading />
            )}
        </Stack>
    );
};
