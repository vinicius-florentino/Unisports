import * as React from "react";
import {
    Grid2 as Grid,
    Icon,
    Button,
    Typography,
    Avatar,
    AvatarGroup,
    Tooltip,
    Alert,
    Stack,
    IconButton,
    Box,
    Tabs,
    useTheme,
    Tab,
} from "@mui/material";
import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";
import api from "../../api";
import { useState } from "react";
import { useParams } from "react-router-dom";
import NavigationLayout from "../../layouts/NavigationLayout";
import JoinLeaveModal from "./components/modals/JoinLeaveModal";
import useAuth from "../../hooks/useAuth";
import PageBox from "../../components/PageBox";
import { Loading } from "../../components/Loading";
import { ParticipantsListDrawer } from "./components/ParticipantsListDrawer";
import PropTypes from "prop-types";
import GalleryEvent from "./components/gallery/GalleryEvent";
import { CommentsSection } from "./components/comments/CommentsSection";

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box
                    sx={{
                        py: { md: 0, xs: 3 },
                    }}
                >
                    {children}
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `vertical-tab-${index}`,
        "aria-controls": `vertical-tabpanel-${index}`,
    };
}

export default function Event() {
    const { user } = useAuth();
    const [openConfirm, setOpenConfirm] = useState(false);
    const [openParticipantsDrawer, setOpenParticipantsDrawer] = useState(false);
    const { id } = useParams();

    const [value, setValue] = useState(0);
    const theme = useTheme();

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleClose = () => {
        setOpenConfirm(false);
    };

    const { data, isLoading } = useQuery({
        queryKey: ["EVENT", id],
        queryFn: async () => {
            const response = await api.get(`/events/${id}`);
            return response.data;
        },
        enabled: !!id,
    });

    //Deveria virar um utils isso
    // const formatPhone = (phone) => {
    //     if (!phone) return "";
    //     return phone.replace(/(\d{2})(\d{2})(\d{5})(\d{4})/, "+($1) $2 $3-$4");
    // };

    const isParticipating = Boolean(
        data?.data?.participants?.some(
            (participant) => participant?.user_id === user?.id
        )
    );
    const isOwner = user?.id === data?.data?.user.id ?? null;

    if (isLoading) {
        return <Loading />;
    }

    return (
        <>
            <NavigationLayout>
                <Stack gap={2}>
                    <Stack gap={2}>
                        {isOwner && (
                            <Alert severity="info">
                                Você é o criador desse evento.
                            </Alert>
                        )}
                        <PageBox
                            prependTitleIcon={
                                data?.data?.sport ? (
                                    <Avatar title={data?.data?.sport?.title}>
                                        <Icon>{data?.data?.sport?.icon}</Icon>
                                    </Avatar>
                                ) : (
                                    <Avatar
                                        sx={{
                                            backgroundColor:
                                                "var(--light-color)",
                                        }}
                                        title={"Esporte não informado"}
                                    >
                                        <Icon>question_mark</Icon>
                                    </Avatar>
                                )
                            }
                            title={data?.data?.title}
                            titleTypographyProps={{ fontWeight: 700 }}
                        >
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12 }}>
                                    <Typography>
                                        {`${
                                            !!data?.data?.start_at
                                                ? dayjs(
                                                      data?.data?.start_at
                                                  ).format("DD/MM/YYYY HH:mm")
                                                : ""
                                        } ${
                                            !!data?.data?.finishes_at
                                                ? " - "
                                                : ""
                                        } ${
                                            !!data?.data?.finishes_at
                                                ? dayjs(
                                                      data?.data?.finishes_at
                                                  ).format("DD/MM/YYYY HH:mm")
                                                : ""
                                        }`}
                                    </Typography>
                                </Grid>
                                <Grid
                                    size={{ xs: 12, md: 6 }}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                ></Grid>
                                <Grid size={12}>
                                    <Typography>
                                        {data?.data?.description}
                                    </Typography>
                                </Grid>
                                <Grid
                                    size={12}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "flex-start",
                                        gap: 2,
                                    }}
                                >
                                    <AvatarGroup
                                        total={data?.data?.participants?.length}
                                        max={5}
                                    >
                                    {data?.data?.participants
                                        ?.sort((a, b) => {
                                            const A = a.user.id === data?.data?.user.id;
                                            const B = b.user.id === data?.data?.user.id;

                                            if (A && !B) return -1;
                                            if (!A && B) return 1;
                                            return 0;
                                        })
                                        .map((participant, index) => {
                                            return (
                                                <Tooltip
                                                    title={`${
                                                        participant.user.name
                                                    } ${
                                                        index === 0
                                                            ? "(criador)"
                                                            : ""
                                                    }`}
                                                    arrow
                                                    placement="top"
                                                    key={index}
                                                >
                                                    <Avatar
                                                        alt={
                                                            participant.user
                                                                .name ||
                                                            "Usuário"
                                                        }
                                                        src={
                                                            import.meta.env
                                                                .VITE_STORAGE_BASE_URL +
                                                                participant.user
                                                                    .image_path ||
                                                            "/static/images/avatar/1.jpg"
                                                        }
                                                        sx={{
                                                            ...(index === 0 && {
                                                                border: "3px solid var(--warning-color) !important",
                                                            }),
                                                        }}
                                                    />
                                                </Tooltip>
                                            )
                                        })}
                                    </AvatarGroup>
                                    <Typography
                                        sx={{
                                            color:
                                                !!data?.data
                                                    ?.max_participants &&
                                                data?.data?.participants
                                                    .length >=
                                                    data?.data?.max_participants
                                                    ? "var(--danger-color)"
                                                    : null,
                                        }}
                                    >
                                        {data?.data?.participants.length} /{" "}
                                        {data?.data?.max_participants
                                            ? data?.data?.max_participants
                                            : "Sem máx."}
                                    </Typography>
                                    <IconButton
                                        title="Ver participantes"
                                        onClick={() =>
                                            setOpenParticipantsDrawer(true)
                                        }
                                    >
                                        <Icon>visibility</Icon>
                                    </IconButton>
                                </Grid>
                                <Grid size={12}>
                                    <Typography>
                                        <strong>Localização:</strong>{" "}
                                        {data?.data?.location?.name &&
                                        data?.data?.location?.formatted_address
                                            ? `${data?.data?.location?.name} - ${data?.data?.location?.formatted_address}`
                                            : "Sem localização informada"}
                                    </Typography>
                                </Grid>
                                {/* <Grid size={12}>
                                <Typography>
                                    <strong>Organizador:</strong> {data?.data?.user?.name}{" "}
                                    {formatPhone(data?.data?.user?.phone)}
                                </Typography>
                            </Grid> */}
                                <Grid size={12}>
                                    <Stack>
                                        <Typography>
                                            <strong>Valor:</strong>{" "}
                                            {!!data?.data?.price
                                                ? `${
                                                      !!data?.data
                                                          ?.split_price_by_participants &&
                                                      data?.data?.participants
                                                          ?.length
                                                          ? (
                                                                data?.data
                                                                    ?.price /
                                                                data?.data
                                                                    ?.participants
                                                                    .length
                                                            ).toLocaleString(
                                                                "pt-BR",
                                                                {
                                                                    style: "currency",
                                                                    currency:
                                                                        "BRL",
                                                                }
                                                            )
                                                          : data?.data?.price.toLocaleString(
                                                                "pt-BR",
                                                                {
                                                                    style: "currency",
                                                                    currency:
                                                                        "BRL",
                                                                }
                                                            )
                                                  } p/ pessoa`
                                                : "Gratuito"}
                                        </Typography>

                                        {!!data?.data
                                            ?.split_price_by_participants && (
                                            <Stack
                                                flexDirection={"row"}
                                                alignItems="center"
                                                gap={1}
                                                sx={{
                                                    width: "100%",
                                                    opacity: 0.5,
                                                }}
                                            >
                                                {/* <Icon fontSize={"small"}>info</Icon> */}
                                                <Typography
                                                    fontSize={
                                                        "var(--xs-font-size)"
                                                    }
                                                    fontStyle={"italic"}
                                                >
                                                    Quantidade de participantes
                                                    afeta o preço p/ pessoa
                                                </Typography>
                                            </Stack>
                                        )}
                                    </Stack>
                                </Grid>
                                {!isOwner && (
                                    <Grid
                                        size={12}
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "end",
                                        }}
                                    >
                                        {/* <Tooltip title={isOwner ?? "Dono do evento não pode sair dele"} arrow placement="top">
                                <span> */}
                                        <Button
                                            variant={
                                                isParticipating
                                                    ? "outlined"
                                                    : "contained"
                                            }
                                            color={
                                                isParticipating
                                                    ? "error"
                                                    : "primary"
                                            }
                                            disabled={
                                                !!data?.data
                                                    ?.max_participants &&
                                                !isParticipating &&
                                                data?.data?.participants
                                                    .length >=
                                                    data?.data?.max_participants
                                            }
                                            onClick={() => setOpenConfirm(true)}
                                        >
                                            {isParticipating
                                                ? "Cancelar participação"
                                                : "Participar"}
                                        </Button>
                                        {/* </span>
                            </Tooltip> */}
                                    </Grid>
                                )}
                            </Grid>
                        </PageBox>
                        <JoinLeaveModal
                            open={openConfirm}
                            isParticipating={isParticipating}
                            handleClose={handleClose}
                            data={data?.data}
                        />
                        <ParticipantsListDrawer
                            data={data?.data?.participants}
                            open={openParticipantsDrawer}
                            handleClose={() => setOpenParticipantsDrawer(false)}
                        />
                    </Stack>
                    <Stack gap={2}>
                        <PageBox>
                            <Tabs
                                orientation={"horizontal"}
                                variant="scrollable"
                                value={value}
                                onChange={handleChange}
                                aria-label="Vertical tabs example"
                                sx={{ borderColor: "divider", minWidth: 200 }}
                            >
                                <Tab
                                    label="Comentários"
                                    {...a11yProps(0)}
                                    sx={{
                                        backgroundColor: "var(--white-color)",
                                    }}
                                />
                                <Tab
                                    label="Galeria"
                                    {...a11yProps(0)}
                                    sx={{
                                        backgroundColor: "var(--white-color)",
                                    }}
                                />
                            </Tabs>
                            <TabPanel value={value} index={0}>
                                <CommentsSection
                                    eventId={id}
                                    ownerId={data?.data?.user.id}
                                />
                            </TabPanel>
                            <TabPanel value={value} index={1}>
                                <GalleryEvent
                                    title={data?.data?.title}
                                    isOwner={isOwner}
                                    eventId={id}
                                />
                            </TabPanel>
                        </PageBox>
                    </Stack>
                </Stack>
            </NavigationLayout>
        </>
    );
}
