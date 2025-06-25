import React, { useState } from "react";
import {
    Grid2 as Grid,
    Box,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Icon,
    Stack,
} from "@mui/material";
import PageBox from "../../components/PageBox";
import NavigationLayout from "../../layouts/NavigationLayout";

export const Help = () => {
    const [expanded, setExpanded] = useState(false);

    const handleAccordionChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const [expandedFaq, setExpandedFaq] = useState(false);

    const handleFaqAccordionChange = (panel) => (event, isExpanded) => {
        setExpandedFaq(isExpanded ? panel : false);
    };

    const helpTexts = [
        {
            painel: "panel1",
            summary: "1. Criando Eventos",
            details: [
                "Acesse sua conta: Faça login na plataforma com seu email e senha.",
                'Navegue até a seção de eventos: No menu principal, clique em "Meus Eventos" e depois em "Criar Evento".',
                "Preencha as informações: Informe os detalhes do evento, como: nome do evento, descrição, data e horário do evento, tipo de esporte, limite de participantes, localização e valor por pessoa do evento.",
                'Salve o evento: Após preencher os campos obrigatórios, clique em "Salvar". Seu evento estará disponível para outros usuários visualizarem e participarem.',
            ],
        },
        {
            painel: "panel2",
            summary: "2. Participando de Eventos",
            details: [
                "Explore os eventos disponíveis: Na página inicial, você encontrará a lista de eventos. Use os filtros para refinar sua busca por nome do evento ou modalidade esportiva.",
                "Selecione um evento: Clique no evento de interesse para visualizar os detalhes.",
                'Confirme sua participação: No perfil do evento, clique no botão "Participar". Sua participação já está garantida no evento, caso seja necessário pagamento entre em contato com o organizador do evento via chat.',
            ],
        },
        {
            painel: "panel3",
            summary: "3. Pagamentos de Eventos",
            details: [
                "A UniSports não realiza ou gerencia transações financeiras.",
                "Caso o evento tenha custos, entre em contato com o organizador para combinar o pagamento. Utilize os meios fornecidos no perfil do evento ou entre em contato via chat da plataforma.",
                "Atenção: Certifique-se de discutir todos os detalhes do pagamento antes de realizar a transação.",
            ],
        },
        {
            painel: "panel4",
            summary: "4. Dicas para Organizar ou Participar de Eventos",
            details: [
                "Seja claro na descrição: Forneça informações completas e precisas sobre seu evento para atrair os participantes certos.",
                "Comunique-se: Utilize o chat da plataforma para esclarecer dúvidas e alinhar detalhes com os participantes ou organizadores.",
                "Respeite as regras: Verifique os termos de uso da UniSports e siga as diretrizes para manter a comunidade segura e confiável.",
            ],
        },
    ];

    const faqTexts = [
        {
            painel: "panel1-faq",
            summary: "1. Posso cancelar minha participação em um evento?",
            details: [
                'Sim, acesse o evento no qual está inscrito e clique em "Cancelar Participação".',
            ],
        },
        {
            painel: "panel2-faq",
            summary: "2. O que fazer se um evento for cancelado?",
            details: [
                "Você será notificado pelo organizador. Em caso de dúvidas, entre em contato diretamente com ele.",
            ],
        },
        {
            painel: "panel3-faq",
            summary: "3. Como posso alterar as informações do meu evento?",
            details: [
                'Vá até "Meus Eventos", clique nos três pontinhos na barra do evento que deseja editar e clique em "Editar".',
            ],
        },
    ];

    return (
        <NavigationLayout>
            <Stack gap={2}>
                <PageBox
                    title="Ajuda"
                    prependTitleIcon={<Icon>help_center_icon</Icon>}
                    subTitle="Bem-vindo à UniSports! Aqui você encontra orientações para aproveitar ao máximo nossa plataforma."
                >
                    <Box
                        noValidate
                        sx={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "column",
                        }}
                    >
                        <Box sx={{ my: 1, width: "100%" }}>
                            {helpTexts.map((helpItem) => (
                                <Accordion
                                    key={helpItem.painel}
                                    sx={{ px: 2, py: 2, my: 2 }}
                                    expanded={expanded === helpItem.painel}
                                    onChange={handleAccordionChange(
                                        helpItem.painel
                                    )}
                                >
                                    <AccordionSummary
                                        aria-controls={`${helpItem.painel}-content`}
                                        id={`${helpItem.painel}-header`}
                                    >
                                        <Box sx={{ width: "100%" }}>
                                            <Typography
                                                sx={{
                                                    fontWeight: 500,
                                                    fontSize: 16,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "start",
                                                    gap: "8px",
                                                }}
                                            >
                                                {helpItem.summary}
                                            </Typography>
                                        </Box>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} pl={2}>
                                                {helpItem.details.map(
                                                    (detail, index) => (
                                                        <Typography
                                                            component="li"
                                                            key={index}
                                                        >
                                                            {detail}
                                                        </Typography>
                                                    )
                                                )}
                                            </Grid>
                                        </Grid>
                                    </AccordionDetails>
                                </Accordion>
                            ))}
                        </Box>
                    </Box>
                </PageBox>
                <PageBox
                    title="Perguntas Frequentes (FAQ)"
                    prependTitleIcon={<Icon>question_answer</Icon>}
                    subTitle="Dúvidas comuns que temos as respostas :)"
                >
                    <Box
                        noValidate
                        sx={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "column",
                        }}
                    >
                        <Box sx={{ my: 1, width: "100%" }}>
                            {faqTexts.map((helpItem) => (
                                <Accordion
                                    key={helpItem.painel}
                                    sx={{ px: 2, py: 2, my: 2 }}
                                    expanded={expandedFaq === helpItem.painel}
                                    onChange={handleFaqAccordionChange(
                                        helpItem.painel
                                    )}
                                >
                                    <AccordionSummary
                                        aria-controls={`${helpItem.painel}-content`}
                                        id={`${helpItem.painel}-header`}
                                    >
                                        <Box sx={{ width: "100%" }}>
                                            <Typography
                                                sx={{
                                                    fontWeight: 500,
                                                    fontSize: 16,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "start",
                                                    gap: "8px",
                                                }}
                                            >
                                                {helpItem.summary}
                                            </Typography>
                                        </Box>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                {helpItem.details.map(
                                                    (detail, index) => (
                                                        <Typography
                                                            key={index}
                                                        >
                                                            R: {detail}
                                                        </Typography>
                                                    )
                                                )}
                                            </Grid>
                                        </Grid>
                                    </AccordionDetails>
                                </Accordion>
                            ))}
                        </Box>
                    </Box>
                </PageBox>
                <PageBox
                    title="Suporte"
                    prependTitleIcon={<Icon>support_agent</Icon>}
                    subTitle="Nosso time está disponível!"
                >
                    <Box
                        noValidate
                        sx={{
                            width: "100%",
                        }}
                    >
                        <Typography>
                            Caso precise de ajuda adicional, entre em contato
                            com nossa equipe de suporte através do e-mail
                            unisportsPI@gmail.com.
                        </Typography>
                    </Box>
                </PageBox>
            </Stack>
        </NavigationLayout>
    );
};
