import React from "react";
import { Box, Typography, Paper } from "@mui/material";

const PageBox = ({ prependTitleIcon, title, titleTypographyProps, subTitle, children, disablePaddingX, disablePaddingY, sx, ...rest }) => {
    return (
        <Box sx={sx}>
            <Paper elevation={2} sx={{ py: disablePaddingY ? 0 : 4, px: disablePaddingX ? 0 : 4, height: "100%" }} {...rest}>
                {title && (
                    <Typography
                        sx={{
                            fontSize: 20,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "start",
                            gap: 2,
                        }}
                        {...titleTypographyProps}
                    >
                        {prependTitleIcon}
                        {title}
                    </Typography>
                )}
                {subTitle && <Typography sx={{ fontWeight: 300, fontSize: 16 }}>{subTitle}</Typography>}

                <Box sx={{ mt: title || subTitle ? 3 : 0 }}>{children}</Box>
            </Paper>
        </Box>
    );
};

export default PageBox;
