import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import api from "../../api";
import { useState } from "react";

export const SelectSport = (props) => {
    const [isOpen, setIsOpen] = useState(false);

    const { data, isLoading } = useQuery({
        queryKey: ["SPORTS"],
        queryFn: async () => {
            const response = await api.get("/sports");
            return response.data;
        },
        enabled: !!isOpen || !!props?.defaultValue,
    });

    return (
        <FormControl fullWidth>
            <InputLabel id="sport_id">Esporte</InputLabel>
            <Select
                id="sport_id"
                name="sport_id"
                label="Esporte"
                onOpen={() => setIsOpen(true)}
                disabled={isLoading}
                {...props}
            >
                <MenuItem value="">
                    <i>Nenhum</i>
                </MenuItem>
                {data?.data.map((sport) => (
                    <MenuItem key={sport.id} value={sport.id} sx={{display: "flex", gap: 1, alignItems: "center"}}>
                        {/* <Icon>{sport.icon || valueDb?.icon}</Icon> */}
                        {sport.title}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};
