import { useState } from "react";
import NavigationLayout from "../../layouts/NavigationLayout";
import PropTypes from "prop-types";
import { Box, Tab, Tabs, useMediaQuery, useTheme } from "@mui/material";
import { AccountSettings } from "./tabs/AccountSettings";
import { useNavigate } from "react-router-dom";

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box
                    sx={{
                        px: { md: 3, xs: 0 },
                        py: { md: 0, xs: 3 },
                        pl: 2
                    }}
                >
                    {children}
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `vertical-tab-${index}`,
        "aria-controls": `vertical-tabpanel-${index}`,
    };
}

const Content = () => {
    const [value, setValue] = useState(0);
    const theme = useTheme();
    const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
    const navigate = useNavigate();

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    
    return (
        <Box sx={{ flexGrow: 1, display: "flex", maxHeight: "100%", flexDirection: isMdUp ? 'row' : 'column' }}>
            <Tabs
                orientation={isMdUp ? "vertical" : "horizontal"}
                variant="scrollable"
                value={value}
                onChange={handleChange}
                aria-label="Vertical tabs example"
                sx={{ borderRight: 1, borderColor: "divider", minWidth: 200 }}
            >
                <Tab label="Conta" {...a11yProps(0)} sx={{ backgroundColor: "var(--white-color)" }} />
                <Tab label="Políticas e termos" {...a11yProps(0)} sx={{ backgroundColor: "var(--white-color)" }} onClick={() => navigate(`/terms`)} />
                <Tab label="Ajuda" {...a11yProps(0)} sx={{ backgroundColor: "var(--white-color)" }} onClick={() => navigate(`/help`)} />
            </Tabs>
            <TabPanel
                value={value}
                index={0}
            >
                <AccountSettings />
            </TabPanel>
        </Box>
    );
};

export const Settings = () => {
    return (
        <NavigationLayout>
            <Content></Content>
        </NavigationLayout>
    );
};
