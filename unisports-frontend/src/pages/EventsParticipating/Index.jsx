import { useQuery } from "@tanstack/react-query";
import api from "../../api";
import NavigationLayout from "../../layouts/NavigationLayout";
import { Icon, Stack, Grid2 as Grid, Typography } from "@mui/material";
import { CustomDataGrid } from "../../components/DataGrid/CustomDataGrid";
import dayjs from "dayjs";
import PageBox from "../../components/PageBox";
import { useNavigate } from "react-router-dom";

const columns = [
    {
        field: "sport",
        headerName: "",
        headerAlign: "center",
        align: "center",
        maxWidth: 75,
        flex: 1,
        renderCell: (params) => (
            <Grid sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                <Icon>{params?.row?.sport?.icon}</Icon>
            </Grid>
        ),
    },
    { field: "title", headerName: "Título", minWidth: 150, flex: 1 },
    {
        field: "location",
        headerName: "Local",
        flex: 2,
        valueFormatter: (params) => `${params?.name || ""} ${params?.formatted_address || ""}`,
    },
    { field: "description", headerName: "Descrição", minWidth: 400, flex: 1 },
    {
        field: "price",
        headerName: "Preço",
        headerAlign: "left",
        align: "left",
        minWidth: 100,
        flex: 1,
        editable: false,
        type: "number",
        valueFormatter: (params) => {
            if (params === null || params === undefined) {
                return `${(0).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                })}`;
            }
            return `${params.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
            })}`;
        },
    },
    {
        field: "max_participants",
        headerName: "Atual/Máx. de participantes",
        type: "number",
        headerAlign: "center",
        align: "center",
        minWidth: 300,
        flex: 1,
        renderCell: (params) => {
            if (!!params.row.max_participants) {
                return (
                    <Grid sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                        <Typography>
                            {params.row.participants_count}/{params.row.max_participants}
                        </Typography>
                    </Grid>
                );
            } else {
                return (
                    <Grid sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                        <Typography>{params.row.participants_count}/Sem máx.</Typography>
                    </Grid>
                );
            }
        },
    },
    {
        field: "start_at",
        headerName: "Data de início",
        minWidth: 180,
        flex: 1,
        type: "datetime",
        valueFormatter: (params) => dayjs(params).format("DD/MM/YYYY HH:mm"),
    },
    {
        field: "finishes_at",
        headerName: "Data de fim",
        minWidth: 180,
        flex: 1,
        type: "datetime",
        valueFormatter: (params) => params ? dayjs(params).format("DD/MM/YYYY HH:mm") : "",
    },
];

const Content = () => {

    const { data, isLoading } = useQuery({
        queryKey: ["EVENTS_PARTICIPATING"],
        queryFn: async () => {
            const response = await api.get("/events/participating");
            return response.data;
        },
    });

    const navigate = useNavigate();

    const handleRowClick = (params, event, details) => {
        event.stopPropagation();
        navigate(`/event/${params.row.id}`);
    };
      
    return (
        <Stack gap={4}>
            <Grid container spacing={2} alignItems="stretch">
                <Grid size={12}>
                    <PageBox
                        title="Eventos que estou participando"
                        subTitle="Visualizar eventos de outros usuários que estou participando"
                        sx={{ height: "100%" }}
                        prependTitleIcon={<Icon>run_circle</Icon>}
                    >
                        <CustomDataGrid
                            rows={data?.data ?? []}
                            getRowId={(row) => row.id}
                            columns={columns}
                            loading={isLoading}
                            initialState={{
                                pagination: {
                                    paginationModel: { pageSize: 25 },
                                },
                            }}
                            disableColumnMenu
                            pageSizeOptions={[25, 50, 100]}
                            disableRowSelectionOnClick
                            onRowClick={handleRowClick}
                            isRowClickable={true}
                            
                        />
                    </PageBox>
                </Grid>
            </Grid>
        </Stack>
    );
};

export const EventsParticipating = () => (
    <NavigationLayout>
        <Content />
    </NavigationLayout>
);
