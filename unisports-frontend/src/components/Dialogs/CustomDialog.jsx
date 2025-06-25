import { Dialog, DialogTitle, IconButton, Icon } from "@mui/material";

export const CustomDialog = ({ title, open, handleClose, children, maxWidth, ...rest }) => {
    return (
        <Dialog open={open} maxWidth={maxWidth} onClose={handleClose} {...rest}>
            <DialogTitle display="flex" justifyContent="space-between">
                {title}
                <IconButton onClick={handleClose}>
                    <Icon>close</Icon>
                </IconButton>
            </DialogTitle>
            {children}
        </Dialog>
    );
};
