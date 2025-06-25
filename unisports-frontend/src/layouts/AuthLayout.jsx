import { Container, Paper, Box, Stack } from "@mui/material";
import Logo from "../components/Logo";
import { Link } from "react-router-dom";

export const AuthLayout = ({ children }) => {
    return (
        <Container maxWidth="xs" sx={{ height: "100vh", display: "flex", alignItems: "center" }}>
            <Paper sx={{ width: "100%", p: 4 }}>
                <Stack spacing={2}>
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <Link to="/">
                            <Logo height="60px" width="60px" />
                        </Link>
                    </Box>
                    {children}
                </Stack>
            </Paper>
        </Container>
    );
};
