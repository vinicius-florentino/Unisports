import { TextField, Stack, Icon, IconButton, Alert } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../../../api";
import Pusher from "pusher-js";
import { useEffect } from "react";
import { CommentBox } from "./components/CommentBox";

export const CommentsSection = ({ eventId, ownerId }) => {
    const queryClient = useQueryClient();

    const { data: comments, isPending } = useQuery({
        queryKey: ["EVENT_COMMENTS", eventId],
        queryFn: async () => {
            const response = await api.get(`/events/${eventId}/comments`);
            return response.data;
        },
    });

    const { mutate: mutatePost, isPending: isPendingPost } = useMutation({
        mutationFn: (data) => {
            return api.post(`/events/${eventId}/comments`, data);
        },
        onError: (error) => {
            const { message } = error.response.data;
            toast.error(message);
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        mutatePost(data);
        e.target.reset();
    };

    useEffect(() => {
        if (!!eventId) {
            const pusher = new Pusher(import.meta.env.VITE_PUSHER_APP_KEY, {
                cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
            });

            const channel = pusher.subscribe(`event.${eventId}`);

            channel.bind("event-comment", function (newData) {
                const oldData = queryClient.getQueryData(["EVENT_COMMENTS", eventId]);

                if (oldData) {
                    const updatedData = {
                        ...oldData,
                        data: [...oldData.data, newData.comment],
                    };
                    queryClient.setQueryData(["EVENT_COMMENTS", eventId], updatedData);
                }
            });

            channel.bind("event-comment-answer", function (newData) {
                const oldData = queryClient.getQueryData(["EVENT_COMMENTS", eventId]);

                if (oldData) {
                    const updatedData = {
                        ...oldData,
                        data: oldData.data.map((comment) => {
                            if (comment.id === newData.commentAnswer.comment_id) {
                                return {
                                    ...comment,
                                    answers: [...(comment.answers || []), newData.commentAnswer],
                                };
                            }
                            return comment;
                        }),
                    };

                    queryClient.setQueryData(["EVENT_COMMENTS", eventId], updatedData);
                }
            });

            return () => {
                channel.unbind("event-comment");
                channel.unbind("event-comment-answer");
                channel.unsubscribe(`event.${eventId}`);
            };
        }
    }, []);

    if (!isPending)
        return (
            <Stack gap={2} py={2}>
                <Stack gap={1} flexDirection="row" component="form" onSubmit={handleSubmit}>
                    <TextField
                        name="value"
                        label="Comentário"
                        placeholder="Adicionar comentário"
                        type="text"
                        disabled={isPendingPost}
           
                    />
                    <IconButton type="submit" disabled={isPendingPost} size="small">
                        <Icon fontSize="small">send</Icon>
                    </IconButton>
                </Stack>
                <Stack gap={2} flexDirection={"column-reverse"}>
                    {comments?.data?.length > 0 ? (
                        <>
                            {comments?.data?.map((comment, index) => (
                                <CommentBox data={comment} ownerId={ownerId}/>
                            ))}
                        </>
                    ) : (
                        <Alert severity="info">Nenhum comentário encontrado</Alert>
                    )}
                </Stack>
            </Stack>
        );
};
