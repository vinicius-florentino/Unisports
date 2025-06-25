import { Modal, Box } from "@mui/material";

export const ViewImageModal = ({ open, handleClose, imagePath }) => {
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "fit-content",
                }}
            >
                <img
                    src={import.meta.env.VITE_STORAGE_BASE_URL + imagePath}
                    alt={imagePath}
                    style={{
                        maxWidth: "75vw",
                        maxHeight: "75vh",
                        objectFit: "contain",
                    }}
                />
            </Box>
        </Modal>
    );
};
