import React, { useState } from "react";
import {
    Button,
    DialogContent,
    DialogActions,
    Stack,
    Avatar,
    Box,
    Icon,
    Typography,
} from "@mui/material";
import { CustomDialog } from "../../../../components/Dialogs/CustomDialog";
import api from "../../../../api";
import { CustomDataGrid } from "../../../../components/DataGrid/CustomDataGrid";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import GalleryTableActions from "../table/GalleryTableActions";
import { ViewImageModal } from "../../../../components/Modals/ViewImageModal";
import { styled } from "@mui/material/styles";
import { toast } from "react-toastify";

const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
});

const genColumns = (eventId) => [
    {
        field: "image_path",
        headerName: "Imagem",
        flex: 1,
        headerAlign: "center",
        renderCell: (params) => (
            <Stack
                flexDirection="row"
                gap={2}
                justifyContent="center"
                alignItems="center"
                height="100%"
            >
                <Avatar
                    src={
                        params?.row?.image_path
                            ? import.meta.env.VITE_STORAGE_BASE_URL +
                              params?.row?.image_path
                            : ""
                    }
                />
            </Stack>
        ),
    },
    {
        field: "actions",
        type: "actions",
        width: 80,
        getActions: (params) => [<GalleryTableActions data={params?.row} eventId={eventId}/>],
    },
];

export const GalleryDialog = ({ open, handleClose, id }) => {
    const [openViewImage, setOpenViewImage] = useState(false);
    const [selectedImage, setSelectedImage] = useState();
    const queryClient = useQueryClient();

    const { data, isLoading, isRefetching } = useQuery({
        queryKey: ["EVENT_DASHBOARD_GALLERY", id],
        queryFn: async () => {
            const response = await api.get(
                `/events/dashboard/${id}/gallery/images`
            );
            return response.data;
        },
        enabled: !!open && !!id,
        select: (data) => {
            const newData = data?.data?.image_paths?.map(
                (imagePath, index) => ({
                    index,
                    image_path: imagePath,
                })
            );
            return newData;
        },
    });

    const { mutate: mutateImage, isPending: isPendingImage } = useMutation({
        mutationFn: (data) => {
            return api.post(`/events/dashboard/${id}/gallery/images`, data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
        },
        onError: (error) => {
            const { message } = error.response.data;
            toast.error(message);
        },
        onSuccess: (data) => {
            const { message } = data.data;
            queryClient.invalidateQueries("EVENT_DASHBOARD_GALLERY", id);
            toast.success(message);
        },
    });

    const handleImageChange = (event) => {
        const file = event.target.files[0];

        if (file) {
            const formData = new FormData();
            formData.append("image", file);
            mutateImage(formData);
        }
    };

    const handleRowClick = (params, event, details) => {
        setSelectedImage(params?.row?.image_path);
        setOpenViewImage(true);
    };

    return (
        <CustomDialog
            open={open}
            handleClose={handleClose}
            title="Ver Galeria"
            maxWidth="md"
        >
            <DialogContent>
                <Stack gap={2}>
                    <Box>
                        <Button
                            component="label"
                            variant="text"
                            disabled={isPendingImage}
                            startIcon={<Icon>add</Icon>}
                        >
                            Adicionar imagem
                            <VisuallyHiddenInput
                                type="file"
                                onChange={handleImageChange}
                                accept="jpeg,png,jpg"
                            />
                        </Button>
                    </Box>
                    <CustomDataGrid
                        rows={data ?? []}
                        getRowId={(row) => row?.image_path}
                        columns={genColumns(id)}
                        loading={isLoading || isRefetching}
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
                    <ViewImageModal
                        open={openViewImage}
                        handleClose={() => setOpenViewImage(false)}
                        imagePath={selectedImage}
                    />
                    <Box>
                        <Typography sx={{display: "flex", gap: 1, alignItems: "center", fontSize: "var(--sm-font-size)", fontWeight: 300}}>
                            <Icon fontSize="inherit">info</Icon>Para expandir a imagem clique na
                            linha referente.
                        </Typography>
                    </Box>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={handleClose}>
                    Voltar
                </Button>
            </DialogActions>
        </CustomDialog>
    );
};
