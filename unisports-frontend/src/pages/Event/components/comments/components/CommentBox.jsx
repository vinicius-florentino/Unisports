import { Stack, Typography, Paper, Avatar, Link, TextField, Icon, IconButton } from "@mui/material";
import dayjs from "dayjs";
import { useMutation } from "@tanstack/react-query";
import api from "../../../../../api";
import { toast } from "react-toastify";
import { useState } from "react";

const ShowComment = ({ data, isOwner }) => {
    return (
        <Stack flexDirection="row" alignItems="start" gap={1}>
            <Avatar
                src={data?.user?.image_path ? import.meta.env.VITE_STORAGE_BASE_URL + data?.user?.image_path : ""}
                sx={{ borderRadius: 300, border: isOwner ? "3px solid var(--warning-color) !important" : "" }}
            />
            <Stack sx={{ width: "100%" }} gap={0.5}>
                <Paper elevation={1} sx={{ width: "100%" }}>
                    <Stack py={1} p={2} gap={1}>
                        <Typography fontWeight={700} fontSize={"var(--sm-font-size)"}>
                            {data?.user?.name} -{" "}
                            <span style={{ fontSize: "var(--xs-font-size)", fontWeight: "lighter" }}>
                                {dayjs(data?.created_at).format("DD/MM/YYYY HH:mm")}
                            </span>
                        </Typography>
                        <Typography fontSize={"var(--sm-font-size)"}>{data.value}</Typography>
                    </Stack>
                </Paper>
            </Stack>
        </Stack>
    );
};

export const CommentBox = ({ data, ownerId }) => {
    const [showFirstAnswerInput, setShowFirstAnswerInput] = useState(false);

    const { mutate: mutatePost, isPending: isPendingPost } = useMutation({
        mutationFn: (newData) => {
            return api.post(`/events/${data.event_id}/comments/${data.id}/answers`, newData);
        },
        onError: (error) => {
            const { message } = error.response.data;
            toast.error(message);
        },
        // onSuccess: () => {
        // },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const submitData = Object.fromEntries(formData.entries());
        mutatePost(submitData);
        e.target.reset();
    };

    return (
        <Stack gap={2}>
            <ShowComment data={data} isOwner={data.user_id === ownerId} />
            {data?.answers?.length > 0 ? (
                <Stack ml={5} p={2} gap={2} sx={{ backgroundColor: "#fafafa", borderRadius: 2 }}>
                    {data?.answers.map((answer, index) => (
                        <ShowComment data={answer} isOwner={ownerId === answer.user_id} />
                    ))}
                    <Stack gap={1} ml={5} flexDirection="row" component="form" onSubmit={handleSubmit}>
                        <TextField
                            name="value"
                            label="Resposta"
                            placeholder="Adicionar resposta"
                            type="text"
                            disabled={isPendingPost}
                            size="small"
                        />
                        <IconButton type="submit" disabled={isPendingPost} size="small">
                            <Icon fontSize="small">send</Icon>
                        </IconButton>
                    </Stack>
                </Stack>
            ) : (
                <Stack flexDirection="row" ml={5}>
                    {showFirstAnswerInput ? (
                        <Stack
                            gap={1}
                            flexDirection="row"
                            component="form"
                            sx={{ width: "100%" }}
                            onSubmit={handleSubmit}
                        >
                            <IconButton
                                disabled={isPendingPost}
                                size="small"
                                onClick={() => setShowFirstAnswerInput(false)}
                            >
                                <Icon fontSize="small">clear</Icon>
                            </IconButton>
                            <TextField
                                name="value"
                                label="Resposta"
                                placeholder="Adicionar resposta"
                                type="text"
                                disabled={isPendingPost}
                                size="small"
                            />
                            <IconButton type="submit" disabled={isPendingPost} size="small">
                                <Icon fontSize="small">send</Icon>
                            </IconButton>
                        </Stack>
                    ) : (
                        <Link
                            component="button"
                            sx={{ fontSize: "var(--xs-font-size)" }}
                            onClick={() => {
                                setShowFirstAnswerInput(true);
                            }}
                        >
                            Responder
                        </Link>
                    )}
                </Stack>
            )}
        </Stack>
    );
};
