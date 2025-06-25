import { DeleteAccount } from "./components/DeleteAccount";
import { PasswordUserSettings } from "./components/PasswordUserSettings";
import { UserSettings } from "./components/UserSettings";
import { Box, Grid2 as Grid, Icon } from "@mui/material";
import PageBox from "../../../../components/PageBox";

export const AccountSettings = () => {
    return (
        <Box sx={{ width: "100%" }}>
            <Grid container spacing={4}>
                <Grid size={12}>
                    <PageBox
                        title="Edite suas informações"
                        subTitle=""
                        prependTitleIcon={<Icon>edit</Icon>}
                    >
                        <UserSettings />
                    </PageBox>
                </Grid>
                <Grid size={12}>
                    <PageBox
                        title="Edite sua senha"
                        subTitle=" "
                        prependTitleIcon={<Icon>password</Icon>}
                    >
                        <PasswordUserSettings />
                    </PageBox>
                </Grid>
                <Grid size={12}>
                    <PageBox
                        title="Exclua sua conta"
                        subTitle=""
                        prependTitleIcon={<Icon>delete</Icon>}
                    >
                        <DeleteAccount />
                    </PageBox>
                </Grid>
            </Grid>
        </Box>
    );
};
