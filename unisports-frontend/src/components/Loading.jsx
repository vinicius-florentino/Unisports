import { Box, CircularProgress } from "@mui/material";

export const Loading = () => {
    return (
        <Box sx={{ width: "100%", height: "100%", display: "flex", alignItems: "center" }}>
            <CircularProgress size={30} sx={{margin: "0 auto"}} />
        </Box>
    );
};
