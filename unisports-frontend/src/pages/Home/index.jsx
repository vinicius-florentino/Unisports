import NavigationLayout from "../../layouts/NavigationLayout";
import { Stack, Box, Divider } from "@mui/material";
import { EventsSection } from "./components/EventsSection";
import { CarouselSection } from "./components/CarouselSection";

const Content = () => {
    return (
        <Stack gap={4} sx={{ width: "100%" }}>
            <Box component="div">
                <CarouselSection/>
            </Box>
            <Divider/>
            <Box component="div">
                <EventsSection />
            </Box>
        </Stack>
    );
};

export const Home = () => {
    return (
        <NavigationLayout>
            <Content />
        </NavigationLayout>
    );
};
