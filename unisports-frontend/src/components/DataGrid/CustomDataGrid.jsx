import { DataGrid } from "@mui/x-data-grid";
import { ptBR } from "@mui/x-data-grid/locales";

export const CustomDataGrid = ({ isRowClickable, ...rest }) => {
    return (
        <DataGrid
            sx={{
                backgroundColor: "var(--white-color)",
                borderRadius: "16px",
                border: "2px solid var(--light-color)",
                "--DataGrid-containerBackground": "var(--primary-color)",
                "& .MuiDataGrid-columnHeaderTitle": {
                    color: "var(--white-color)",
                },
                "& .MuiDataGrid-row": {
                    cursor: isRowClickable ? "pointer" : ""
                },
                "& .MuiDataGrid-columnHeader": {
                    "& .MuiButtonBase-root": {
                        color: "var(--white-color)",
                    },
                },
                overflowX: "scroll"
            }}
            localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
            {...rest}
        />
    );
};
