export default async function handler(req, res) {
    // Configuração de CORS para liberar o acesso do Elementor
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Captura os dados do formulário
    const { nivel, disciplina, tema, resumo } = req.body || {};

    // Se faltarem dados, ele envia um aviso amigável
    if (!nivel || !tema) {
        return res.status(200).json({ content: "Aguardando dados do formulário..." });
    }

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: "Você é um professor criativo. Gere atividades pedagógicas formatadas em HTML simples." },
                    { role: "user", content: `Nível: ${nivel}, Disciplina: ${disciplina}, Tema: ${tema}. Instruções extras: ${resumo}` }
                ]
            })
        });

        const data = await response.json();
        
        // Garante que estamos enviando apenas o texto da resposta
        const textoGerado = data.choices?.[0]?.message?.content || "Erro ao gerar texto.";
        res.status(200).json({ content: textoGerado });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
