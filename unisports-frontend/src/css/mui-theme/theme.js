const theme = {
    palette: {
        primary: {
            main: "#28423B",
        },
        secondary: {
            main: "#15C291",
        },
        success: {
            main: "#06aa3c",
        },
        warning: {
            main: "#f2c707",
        },
        info: {
            main: "#00b9ff",
        },
        error: {
            main: "#f5023d",
        },
        outline: "#E0E2E4",
    },

    typography: {
        allVariants: {
            fontFamily: "var(--font-family)",
            textTransform: "none",
            fontSize: "var(--md-font-size)",
            color: "var(--dark-color)",
            fontWeight: 400,
            lineHeight: 1.5,
        },
    },

    components: {
        MuiBox: {
            styleOverrides: {
                root: {
                    width: "100%"
                }
            },
            defaultProps:{
                noValidate: true
            }
        },
        // MuiCard: {
        //     styleOverrides: {
        //         root: {
        //             boxShadow: "var(--box-shadow)",
        //         },
        //     },
        // },
        // MuiTableContainer: {
        //     styleOverrides: {
        //         root: {
        //             boxShadow: "none",
        //             border: "1px solid var(--light-color)",
        //         },
        //     },
        // },
        // MuiTableHead: {
        //     styleOverrides: {
        //         root: {
        //             "& .MuiTableCell-root": {
        //                 color: "var(--dark-color)",
        //                 fontSize: 14,
        //                 fontWeight: 700,
        //             },
        //         },
        //     },
        // },
        // MuiTableBody: {
        //     styleOverrides: {
        //         root: {
        //             "& .MuiTableRow-root:nth-of-type(odd)": {
        //                 backgroundColor: "var(--ultra-light-color)",
        //             },
        //         },
        //     },
        // },
        MuiButton: {
            styleOverrides: {
                root: {
                    height: "40px",
                    textTransform: "none",
                    fontSize: "var(--font-size)",
                    borderRadius: "32px",
                    minWidth: "80px",
                    fontSize: "var(--md-font-size)",
                },
                // contained: {
                //     "&.Mui-disabled": {
                //         // color: "var(--white-color)",
                //         // backgroundColor: "var(--hover-color)",
                //     },
                // },
                // text: {
                //     borderRadius: "0px",
                //     borderBottom: "2px solid var(--white-color)",
                //     "&:hover": {
                //         backgroundColor: "inherit",
                //         borderBottom: "2px solid var(--dark-color)",
                //     },
                // },
                // containedLight: {
                //     backgroundColor: "inherit",
                //     color: "var(--dark-color)",
                //     border: "var(--borders)",
                // },
                // containedDanger: {
                //     border: "1px solid var(--danger-color)",
                //     backgroundColor: "var(--white-color)",
                //     color: "var(--danger-color)",
                // },
                // containedSuccess: {
                //     border: "1px solid var(--success-color)",
                //     backgroundColor: "var(--white-color)",
                //     color: "var(--success-color)",
                // },
            },
            defaultProps: {
                disableElevation: true,
            }
        },
        MuiIcon: {
            defaultProps: {
              baseClassName: "material-icons-outlined",
            },
          },
        // MuiOutlinedInput: {
        //     styleOverrides: {
        //         root: {
        //             borderRadius: "8px",
        //             minHeight: "50px",
        //         },
        //     },
        // },
        MuiAvatar: {
            styleOverrides: {
                root: {
                    backgroundColor: "var(--secondary-color)",
                    color: "var(--white-color)",
                    width: "32px",
                    height: "32px",
                    fontSize: "var(--md-font-size)",
                },
            },
            defaultProps: {
                variant: "rounded"
            }
        },
        MuiFormHelperText: {
            styleOverrides: {
                root: {
                    margin: "5px 0px",
                    fontSize: "var(--sm-font-size)"
                },
            },
        },
        MuiLink: {
            styleOverrides: {
                root: {
                    textDecoration: "none",
                    "&:hover": {
                        textDecoration: "underline",
                    },
                    fontSize: "var(--sm-font-size)",
                },
            },
            defaultProps: {
                type: "button"
            },
        },
        MuiAlert: {
            styleOverrides: {
                root: {
                    fontSize: "var(--sm-font-size)",
                },
            },
        },
        // MuiDrawer: {
        //     styleOverrides: {
        //         root: {},
        //         paper: {
        //             width: "300px",
        //         },
        //     },
        // },
        // MuiListItemIcon: {
        //     styleOverrides: {
        //         root: {
        //             minWidth: "44px",
        //             //   height: "24px"
        //         },
        //     },
        // },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    // boxShadow: "none",
                },
            },
        },
        MuiDialogTitle: {
            styleOverrides: {
                root: {
                    fontSize: "var(--lg-font-size)",
                },
            },
        },
        MuiDialogActions: {
            styleOverrides: {
                root: {
                    padding: "16px 24px",
                },
            },
        },
        MuiDialog: {
            defaultProps: {
                fullWidth: true,
                maxWidth: "sm",
                noValidate: true,
                scroll: "paper"
            },
        },
        MuiDialogContent: {
            defaultProps: {
                dividers: true
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    fontSize: "var(--md-font-size)",
                },
            },
            defaultProps: {
                InputLabelProps: {
                    // shrink: true,
                    // disableAnimation: true,
                },
                fullWidth: true,
                variant: "outlined"
            },
        },
        // MuiAccordion: {
        //     styleOverrides: {
        //         root: {
        //             boxShadow: "var(--box-shadow)",
        //         },
        //     },
        // },
    },
};

export default theme;