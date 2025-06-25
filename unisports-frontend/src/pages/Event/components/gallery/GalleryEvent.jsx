import * as React from "react";
import Box from "@mui/material/Box";
import {
    Stack,
    useMediaQuery,
    useTheme,
    ImageList,
    ImageListItem,
} from "@mui/material";
import { useState } from "react";
import { ViewImageModal } from "../../../../components/Modals/ViewImageModal";
import api from "../../../../api";
import { useQuery } from "@tanstack/react-query";
import { Alert } from "@mui/material";
import { Loading } from "../../../../components/Loading";

export default function GaleryEvent({ eventId }) {
    const theme = useTheme();
    const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
    const [openViewImage, setOpenViewImage] = useState(false);
    const [selectedImage, setSelectedImage] = useState();

    const { data: eventPhotos, isPending } = useQuery({
        queryKey: ["EVENTS_GALLERY", eventId],
        queryFn: async () => {
            const response = await api.get(`/events/${eventId}/gallery/images`);
            return response.data.data;
        },
    });

    const handleImageClick = (imagePath) => {
        setSelectedImage(imagePath);
        setOpenViewImage(true);
    };

    if (isPending) return <Loading />;

    return (
        <>
            <Stack gap={2} sx={{ my: 2 }}>
                {eventPhotos?.image_paths?.length > 0 ? (
                    <>
                        <Box>
                            <ImageList variant="masonry" cols={isMdUp ? 4 : 2}>
                                {eventPhotos?.image_paths?.map(
                                    (imagePath, index) => (
                                        <ImageListItem
                                            key={index}
                                            onClick={() =>
                                                handleImageClick(imagePath)
                                            }
                                        >
                                            <img
                                                src={
                                                    import.meta.env
                                                        .VITE_STORAGE_BASE_URL +
                                                    imagePath
                                                }
                                                loading="lazy"
                                                style={{ cursor: "pointer" }}
                                            />
                                        </ImageListItem>
                                    )
                                )}
                            </ImageList>
                        </Box>
                    </>
                ) : (
                    <Alert severity="info">
                        Nenhuma imagem de galeria encontrada
                    </Alert>
                )}
            </Stack>
            <ViewImageModal
                open={openViewImage}
                handleClose={() => setOpenViewImage(false)}
                imagePath={selectedImage}
            />
        </>
    );
}
