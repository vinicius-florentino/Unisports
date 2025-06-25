import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { Box, Paper } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

export const CarouselSection = () => {

    const theme = useTheme();
    const greaterThanMd = useMediaQuery(theme.breakpoints.up("md"));

    const items = [
        {
            src: !greaterThanMd ? "/1-600x300.webp" : "/1-1200x300.webp",
        },
        {
            src: !greaterThanMd ? "/2-600x300.webp" : "/2-1200x300.webp",
        },
        {
            src: !greaterThanMd ? "/3-600x300.webp" : "/3-1200x300.webp",
        },
    ];

    return (
        <Box sx={{ minHeight: 300, width: "100%" }}>
            <Swiper
                className="mySwiper"
                slidesPerView={1}
                slidesPerGroup={1}
                loop={true}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }}
                navigation={true}
                modules={[Navigation, Autoplay]}
            >
                {items?.map((item, index) => (
                    <SwiperSlide key={index}>
                        <Paper
                            key={index}
                            sx={{
                                p: 0,
                                height: "95%",
                                width: "100%",
                                m: 0,
                                backgroundColor: "transparent",
                            }}
                            elevation={0}
                        >
                            <img
                                style={{
                                    height: "100%",
                                    width: "100%",
                                    objectFit: "fill",
                                }}
                                src={item.src}
                            />
                        </Paper>
                    </SwiperSlide>
                ))}
            </Swiper>
        </Box>
    );
};
