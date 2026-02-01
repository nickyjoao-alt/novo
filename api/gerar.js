export default async function handler(req, res) {
    // 1. RESOLVE O ERRO DE CORS (Permite que seu site Elementor conecte)
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // 2. PROTEÇÃO CONTRA O ERRO DE "UNDEFINED" (Aquele que você viu na tela preta)
    const { nivel, disciplina, tema, resumo } = req.body || {};

    if (!nivel || !tema) {
        return res.status(400).json({ error: "Dados incompletos vindos do formulário." });
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
                    { role: "system", content: "Você é um pedagogo especialista em BNCC. Gere atividades pedagógicas em HTML." },
                    { role: "user", content: `Nível: ${nivel}, Disciplina: ${disciplina}, Tema: ${tema}. Instruções: ${resumo}` }
                ]
            })
        });

        const data = await response.json();
        res.status(200).json({ content: data.choices[0].message.content });
    } catch (error) {
        res.status(500).json({ error: "Erro na OpenAI: " + error.message });
    }
}
