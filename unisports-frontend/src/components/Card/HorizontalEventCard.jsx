import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Avatar, CardHeader, Icon, Stack } from "@mui/material";
import dayjs from "dayjs";

export const HorizontalEventCard = ({ data, onClick, ...rest }) => {
    return (
        <Card sx={{ width: "100%", height: "100%" }} onClick={onClick} {...rest}>
            <CardHeader
                avatar={
                    data?.sport ? (
                        <Avatar title={data?.sport?.title}>
                            <Icon>{data?.sport?.icon}</Icon>
                        </Avatar>
                    ) : (
                        <Avatar sx={{ backgroundColor: "var(--light-color)" }} title={"Esporte não informado"}>
                            <Icon>question_mark</Icon>
                        </Avatar>
                    )
                }
                titleTypographyProps={{ sx: { fontWeight: 700 } }}
                title={data?.title}
                subheader={`${!!data?.start_at ? dayjs(data?.start_at).format("DD/MM/YYYY HH:mm") : ""} ${
                    !!data?.finishes_at ? " - " : ""
                } ${!!data?.finishes_at ? dayjs(data?.finishes_at).format("DD/MM/YYYY HH:mm") : ""}`}
            />
            <CardContent>
                <Stack gap={2} justifyContent="center">
                    <Typography gutterBottom sx={{ fontSize: "var(--md-font-size)" }} noWrap>
                        {data.description}
                    </Typography>
                    <Stack gap={2}>
                        <Stack flexDirection={{ xs: "column", md: "row" }} gap={2} sx={{ width: "100%" }}>
                            {data?.location ? (
                                <Stack flexDirection={"row"} alignItems="center" gap={1} sx={{ width: { md: "50%" } }}>
                                    <Icon>place</Icon>
                                    <Typography fontSize={"var(--sm-font-size)"} noWrap>
                                        {data?.location?.name}
                                    </Typography>
                                </Stack>
                            ) : (
                                <Stack flexDirection={"row"} alignItems="center" gap={1} sx={{ width: { md: "50%" } }}>
                                    <Icon>place</Icon>
                                    <Typography fontSize={"var(--sm-font-size)"} noWrap>
                                        Local não informado
                                    </Typography>
                                </Stack>
                            )}
                            <Stack flexDirection={"row"} alignItems="center" gap={1} sx={{ width: { md: "50%" } }}>
                                <Icon>groups</Icon>
                                <Typography fontSize={"var(--sm-font-size)"} noWrap>
                                    {data?.participants_count} / {data?.max_participants ? data?.max_participants : "Sem máx."}
                                </Typography>
                            </Stack>
                        </Stack>
                        {data?.price ? (
                            <Stack gap={1}>
                                <Stack flexDirection={"row"} alignItems="center" gap={1} sx={{ width: "100%" }}>
                                    <Icon>attach_money</Icon>
                                    <Typography fontSize={"var(--sm-font-size)"} noWrap>
                                        {`${
                                            !!data?.split_price_by_participants && data?.participants_count
                                                ? (data?.price / data?.participants_count).toLocaleString("pt-BR", {
                                                      style: "currency",
                                                      currency: "BRL",
                                                  })
                                                : data?.price.toLocaleString("pt-BR", {
                                                      style: "currency",
                                                      currency: "BRL",
                                                  })
                                        }
                                    p/ pessoa`}
                                    </Typography>
                                </Stack>
                                {!!data?.split_price_by_participants && (
                                    <Stack
                                        flexDirection={"row"}
                                        alignItems="center"
                                        gap={1}
                                        sx={{ width: "100%", opacity: 0.5 }}
                                    >
                                        {/* <Icon fontSize={"small"}>info</Icon> */}
                                        <Typography fontSize={"var(--xs-font-size)"} fontStyle={"italic"}>
                                            Quantidade de participantes afeta o preço p/ pessoa
                                        </Typography>
                                    </Stack>
                                )}
                            </Stack>
                        ) : (
                            <Stack flexDirection={"row"} alignItems="center" gap={1} sx={{ width: "100%" }}>
                                <Icon>attach_money</Icon>
                                <Typography fontSize={"var(--sm-font-size)"} noWrap>
                                    Gratuito
                                </Typography>
                            </Stack>
                        )}
                    </Stack>
                    <Typography fontSize={"var(--xs-font-size)"} fontStyle={"italic"}>
                        Criado por: {data?.user?.name}
                    </Typography>
                </Stack>
            </CardContent>
        </Card>
    );
};
