import React, { useState, useEffect, useRef } from "react";
import { APIProvider, useMapsLibrary } from "@vis.gl/react-google-maps";
import { TextField, InputAdornment, Icon, IconButton } from "@mui/material";
import "./style.css";

export const AutocompletePlaces = ({ onChange, defaultValue }) => {
    return (
        <APIProvider
            apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_ACCESS_TOKEN}
            solutionChannel="GMP_devsite_samples_v3_rgmautocomplete"
        >
            <PlaceAutocomplete onChange={onChange} defaultValue={defaultValue} />
        </APIProvider>
    );
};

const PlaceAutocomplete = ({ onChange, defaultValue }) => {

    const [placeAutocomplete, setPlaceAutocomplete] = useState(null);
    const [inputValue, setInputValue] = useState(
        defaultValue ? `${defaultValue?.name} ${defaultValue?.formatted_address}` : ""
    );
    const [lValue, setLValue] = useState(defaultValue || null);

    const inputRef = useRef(null);
    const places = useMapsLibrary("places");

    const handleChange = (v) => {
        setLValue(v);
        onChange(v);
    };

    useEffect(() => {
        if (!places || !inputRef.current) return;

        const options = {
            fields: ["geometry", "name", "formatted_address"],
            componentRestrictions: { country: "br" },
        };

        setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));
    }, [places]);

    useEffect(() => {
        if (!placeAutocomplete) return;

        placeAutocomplete.addListener("place_changed", () => {
            const place = placeAutocomplete.getPlace();
            handleChange(place);
            setInputValue(`${place?.name} ${place?.formatted_address}`);
        });
    }, [handleChange, placeAutocomplete]);

    return (
        <div className="autocomplete-container">
            <TextField
                inputRef={inputRef}
                value={inputValue}
                onChange={(e) => {
                    setInputValue(e.target.value);
                }}
                onBlur={() => {
                    if (!lValue) {
                        setInputValue("");
                    }
                }}
                label="Localização"
                slotProps={{
                    input: {
                        endAdornment: (
                            <InputAdornment position="end" sx={{display: !!inputValue && !!lValue ? "" : "none"}}>
                                <IconButton
                                    onClick={() => {
                                        setInputValue("");
                                        handleChange(null);
                                    }}
                                >
                                    <Icon>close</Icon>
                                </IconButton>
                            </InputAdornment>
                        ),
                    },
                }}
            />
        </div>
    );
};
