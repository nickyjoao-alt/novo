export default async function handler(req, res) {
    // Liberação de CORS para o seu site no Elementor ou Vercel
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const { nivel, disciplina, tema, resumo } = req.body || {};

    if (!nivel || !tema) {
        return res.status(200).json({ content: "✨ Motor Gemini Ativo! Aguardando seu formulário." });
    }

    try {
        // Chamada para a API do Google Gemini
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Você é um professor criativo. Gere uma atividade pedagógica em HTML (use <h3>, <p>, <ul>). 
                        Nível: ${nivel}. Disciplina: ${disciplina}. Tema: ${tema}. 
                        Inclua um texto base e 3 exercícios. Adicione o rodapé: 'Gerado por Solariza Soluções'.`
                    }]
                }]
            })
        });

        const data = await response.json();
        const textoIA = data.candidates?.[0]?.content?.parts?.[0]?.text || "Erro ao gerar conteúdo.";
        
        res.status(200).json({ content: textoIA });
    } catch (error) {
        res.status(500).json({ error: "Erro na conexão com o Gemini." });
    }
}
