export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const { nivel, disciplina, tema, resumo } = req.body || {};

    if (!nivel || !tema) {
        return res.status(200).json({ content: "Aguardando dados..." });
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
                    { role: "system", content: "Você é um professor. Gere atividades em HTML." },
                    { role: "user", content: `Nível: ${nivel}, Disciplina: ${disciplina}, Tema: ${tema}. Instruções: ${resumo}` }
                ]
            })
        });

        const data = await response.json();
        // AQUI ESTÁ O AJUSTE: Garantir que o texto saia da OpenAI para o seu site
        const resultado = data.choices?.[0]?.message?.content || "A IA não retornou texto. Verifique sua chave OpenAI.";
        
        res.status(200).json({ content: resultado });
    } catch (error) {
        res.status(500).json({ content: "Erro no servidor: " + error.message });
    }
}
