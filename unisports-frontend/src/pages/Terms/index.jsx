import React, { useState } from "react";
import {
    Grid2 as Grid,
    Box,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Icon,
} from "@mui/material";
import PageBox from "../../components/PageBox";
import NavigationLayout from "../../layouts/NavigationLayout";

export const Terms = () => {
    const [expanded, setExpanded] = useState(false);

    const handleAccordionChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const commitmentTerms = [
        {
            painel: "panel1",
            summary: "1. Introdução",
            details: [
                "Bem-vindo à UniSports! Nossa missão é oferecer uma plataforma que conecte praticantes de esportes de forma prática e eficiente.",
                "Para manter um ambiente seguro e transparente, apresentamos os Termos e Compromissos que regem o uso da plataforma.",
                "Ao utilizar a UniSports, você concorda com os termos descritos abaixo. Caso tenha dúvidas, entre em contato pelo e-mail unisportsPI@gmail.com.",
            ],
        },
        {
            painel: "panel2",
            summary: "2. Compromissos do Usuário",
            details: [
                "Fornecer informações verdadeiras, completas e atualizadas durante o cadastro na plataforma.",
                "Respeitar outros usuários, mantendo uma comunicação educada e respeitosa.",
                "Utilizar a plataforma apenas para os fins previstos, como organizar ou participar de eventos esportivos.",
                "Seguir as leis aplicáveis e as diretrizes estabelecidas pela UniSports.",
            ],
        },
        {
            painel: "panel3",
            summary: "3. Privacidade e Proteção de Dados",
            details: [
                "A UniSports segue as diretrizes da *Lei Geral de Proteção de Dados (LGPD)* para garantir a privacidade de seus usuários.",
                "Coleta de Dados: Os dados pessoais fornecidos, como nome, e-mail, localização e informações do perfil, são utilizados exclusivamente para o funcionamento da plataforma.",
                "Armazenamento de Dados: Os dados coletados são armazenados em servidores seguros e protegidos contra acessos não autorizados.",
                "Compartilhamento de Dados: A UniSports não compartilha seus dados pessoais com terceiros sem o seu consentimento prévio, exceto em casos exigidos por lei.",
                "Direitos do Usuário: Você pode acessar, corrigir ou excluir seus dados pessoais a qualquer momento. Para isso, entre em contato pelo e-mail unisportsPI@gmail.com.",
            ],
        },
        {
            painel: "panel4",
            summary: "4. Limitações de Responsabilidade",
            details: [
                "A UniSports não se responsabiliza por transações financeiras realizadas entre usuários.",
                "A organização e participação nos eventos são de responsabilidade exclusiva dos usuários envolvidos.",
                "Problemas relacionados ao uso indevido da plataforma devem ser reportados à equipe de suporte.",
            ],
        },
        {
            painel: "panel5",
            summary: "5. Pagamentos",
            details: [
                "A plataforma não gerencia transações financeiras. Os pagamentos relacionados aos eventos devem ser tratados diretamente entre organizadores e participantes.",
                "Recomendamos que todas as condições de pagamento sejam discutidas previamente e formalizadas pelos meios que considerarem apropriados.",
            ],
        },
        {
            painel: "panel6",
            summary: "6. Cancelamento de Conta",
            details: [
                "O usuário pode solicitar o cancelamento de sua conta a qualquer momento, enviando um e-mail para unisportsPI@gmail.com.",
                "Após o cancelamento, os dados pessoais do usuário serão excluídos, conforme previsto pela LGPD, exceto aqueles necessários para cumprimento de obrigações legais.",
            ],
        },
        {
            painel: "panel7",
            summary: "7. Alterações nos Termos",
            details: [
                "A UniSports pode atualizar estes Termos e Compromissos periodicamente.",
                "Os usuários serão notificados sobre alterações significativas através de e-mail ou na própria plataforma.",
            ],
        },
        {
            painel: "panel8",
            summary: "8. Contato",
            details: [
                "Caso tenha dúvidas, sugestões ou precise de suporte, entre em contato com nossa equipe pelo e-mail unisportsPI@gmail.com.",
            ],
        },
    ];

    return (
        <NavigationLayout>
            <PageBox
                title="Termos e compromissos"
                prependTitleIcon={<Icon>article_icon</Icon>}
                subTitle={
                    "Visualize nossos termos e condições necessárias para uso do sistema"
                }
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
                        {commitmentTerms.map((commitmentItem) => (
                            <Accordion
                                key={commitmentItem.painel}
                                sx={{ px: 2, py: 2, my: 2 }}
                                expanded={expanded === commitmentItem.painel}
                                onChange={handleAccordionChange(
                                    commitmentItem.painel
                                )}
                            >
                                <AccordionSummary
                                    aria-controls={`${commitmentItem.painel}-content`}
                                    id={`${commitmentItem.painel}-header`}
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
                                            {commitmentItem.summary}
                                        </Typography>
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} pl={2}>
                                            {commitmentItem.details.map(
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
        </NavigationLayout>
    );
};
