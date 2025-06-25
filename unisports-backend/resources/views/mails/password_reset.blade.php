<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recuperação de Senha - {{ env("APP_NAME") }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #e8e8e8; /* --light-color */
            color: #333333; /* --dark-color */
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: auto;
            padding: 20px;
            border: 1px solid #e8e8e8; /* --borders */
            border-radius: 8px;
            box-shadow: rgba(51, 51, 51, 0.3) 0px 1px 4px; /* --box-shadow */
            background-color: #ffffff; /* --white-color */
        }
        h1 {
            color: #28423B; /* --primary-color */
            font-size: 20px; /* --lg-font-size */
        }
        p {
            font-size: 16px; /* --md-font-size */
        }
        a {
            display: inline-block;
            margin: 20px 0;
            padding: 10px 20px;
            color: #ffffff; /* --white-color */
            background-color: #15C291; /* --secondary-color */
            text-decoration: none;
            border-radius: 5px;
            transition: background-color 0.3s;
        }
        a:hover {
            background-color: #00b9ff; /* --info-color */
        }
        .footer {
            margin-top: 20px;
            font-size: 12px; /* --xs-font-size */
            color: #e8e8e8; /* --light-color */
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Olá,</h1>
        <p>Você solicitou a redefinição da sua senha para sua conta em {{ env("APP_NAME") }}.</p>
        <p>Clique no link abaixo para redefinir sua senha:</p>
        <a href="{{ $link }}">Redefinir Senha</a>
        <p>Este link é válido por 120 minutos.</p>
        <div class="footer">
            <p>Se você não solicitou essa alteração, ignore este email.</p>
        </div>
    </div>
</body>
</html>
