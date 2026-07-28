import 'dotenv/config';
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import nodemailer from 'nodemailer';
import Groq from 'groq-sdk';

// Initialize Groq Client
let groq: Groq | null = null;
try {
  if (process.env.GROQ_API_KEY) {
    groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
} catch (e) {
  console.warn("Failed to initialize Groq Client, check GROQ_API_KEY.");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for Form Submission
  app.post('/api/submit-diagnosis', async (req, res) => {
    try {
      const { answers, questionsText, userEmail } = req.body;

      if (!answers) {
        return res.status(400).json({ error: 'Nenhuma resposta enviada.' });
      }

      // Generate Analysis via Groq
      let analysisText = 'Análise indisponível. Configure a chave da API (GROQ_API_KEY).';
      
      if (groq) {
        const prompt = `Você atua como Arquiteto de Sistemas e Soluções e Estrategista Digital avaliando um prospect. 
        Seu objetivo é analisar as respostas do questionário abaixo e elaborar um resumo executivo de impacto altamente conciso e pragmático.

        A sua resposta DEVE obrigatoriamente seguir APENAS a estrutura de dois tópicos abaixo, em texto corrido para cada um, sem introdução, sem conclusão adicional e sem saudações:

        **Perfil Atual da Operação:**
        [Defina de forma direta e pragmática o nível de maturidade do que já existe hoje na operação, baseado nas respostas. Mostre ao cliente a REALIDADE do seu momento atual, sem rodeios.]

        **Impacto Estratégico:**
        [Explique como esse cenário atual impacta na capacidade real de estruturação, crescimento e evolução da operação sem uma arquitetura desenhada sob medida, modular e holística. Destaque a complexidade do trabalho de arquitetura e estruturação necessário para suportar essa escala.]
        
        Questionário e Respostas:
        ${JSON.stringify(answers, null, 2)}`;
        
        try {
          const completion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'llama-3.3-70b-versatile',
          });
          analysisText = completion.choices[0]?.message?.content || analysisText;
        } catch (e: any) {
          console.error("Groq Error:", e);
          if (e.status === 429 || (e.message && e.message.includes('429'))) {
             analysisText = "Análise automática indisponível no momento devido ao limite de requisições da IA. A análise será feita manualmente e enviada em breve.";
          } else {
             analysisText = "Análise automática temporariamente indisponível.";
          }
        }
      }

      // Format Email Content
      const dateStr = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
      
      const formattedAnalysis = analysisText
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
    
    let emailContent = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Relatório de Diagnóstico Estratégico</title>
<style>
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    line-height: 1.6;
    color: #1c1917;
    background-color: #f5f5f4;
    margin: 0;
    padding: 20px;
  }
  .container {
    max-width: 600px;
    margin: 0 auto;
    background-color: #ffffff;
    border-radius: 12px;
    padding: 40px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    border: 1px solid #e7e5e4;
  }
  h1 {
    font-size: 24px;
    font-weight: 700;
    margin-top: 0;
    margin-bottom: 24px;
    color: #1c1917;
    letter-spacing: -0.025em;
  }
  h2 {
    font-size: 18px;
    font-weight: 600;
    margin-top: 32px;
    margin-bottom: 16px;
    color: #292524;
    border-bottom: 1px solid #e7e5e4;
    padding-bottom: 8px;
  }
  h3 {
    font-size: 15px;
    font-weight: 600;
    margin-top: 24px;
    margin-bottom: 8px;
    color: #44403c;
  }
  p {
    margin-top: 0;
    margin-bottom: 16px;
    color: #44403c;
    font-size: 15px;
  }
  .note {
    font-size: 14px;
    color: #57534e;
    font-style: italic;
    background-color: #f5f5f4;
    padding: 16px;
    border-radius: 8px;
    margin-bottom: 32px;
  }
  ul {
    margin-top: 0;
    margin-bottom: 16px;
    padding-left: 20px;
    color: #44403c;
  }
  li {
    margin-bottom: 8px;
    font-size: 15px;
  }
  .footer {
    margin-top: 40px;
    font-size: 12px;
    color: #a8a29e;
    text-align: center;
    border-top: 1px solid #e7e5e4;
    padding-top: 16px;
  }
</style>
</head>
<body>
  <div class="container">
    <h1>Relatório de Diagnóstico Estratégico</h1>
    
    <h2>Análise Estratégica</h2>
    <p>${formattedAnalysis}</p>
    
    <div class="note">
      A análise estratégica preliminar acima foi elaborada a partir das respostas submetidas no formulário. Todas as respostas selecionadas podem ser consultadas em detalhes logo abaixo.
    </div>

    <h2>Respostas Originais</h2>
`;
      
      for (const [qId, answer] of Object.entries(answers)) {
        const qTitle = questionsText[qId] || `Pergunta ${qId}`;
        emailContent += `<h3>${qTitle}</h3>`;
        
        if (typeof answer === 'string') {
          emailContent += `<p>${answer}</p>`;
        } else if (Array.isArray(answer)) {
          emailContent += `<ul>${answer.map(a => `<li>${a}</li>`).join('')}</ul>`;
        } else if (typeof answer === 'object') {
          emailContent += `<ul>`;
          for (const [subGroup, subAnswer] of Object.entries(answer as object)) {
            emailContent += `<li><strong>${subGroup}:</strong> ${subAnswer}</li>`;
          }
          emailContent += `</ul>`;
        }
      }

      const justDate = new Date().toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });
      emailContent += `
    <div class="footer">
      Relatório gerado por André Rangel - Arquiteto de Sistemas e Soluções Inteligentes com IA Aplicada - em ${justDate}
    </div>
  </div>
</body>
</html>`;

      // Send Email
      const emailResult = await sendEmail(emailContent, userEmail);

      return res.json({ 
        success: true, 
        analysis: analysisText, 
        emailSent: emailResult.success,
        message: emailResult.success ? 'Relatório gerado e enviado para o e-mail!' : `Relatório gerado. Falha no envio do e-mail: ${emailResult.error}`
      });

    } catch (error) {
      console.error('Submit Error:', error);
      res.status(500).json({ error: 'Erro interno ao processar diagnóstico.' });
    }
  });

  // Vite Middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist', 'client'); // if using standard vite outDir
    const rootDist = path.join(process.cwd(), 'dist'); // sometimes it outputs directly to dist
    
    app.use(express.static(rootDist));
    
    // express v5 routing syntax for fallback
    app.get('*all', (req, res) => {
      res.sendFile(path.join(rootDist, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

async function sendEmail(htmlContent: string, userEmail?: string): Promise<{ success: boolean, error?: string }> {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, TO_EMAIL } = process.env;
  
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !TO_EMAIL) {
    console.log("SMTP credentials missing. Skipping email send.");
    return { success: false, error: "Variáveis de ambiente (SMTP) não configuradas no painel de Segredos." };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT) || 587,
      secure: Number(SMTP_PORT) === 465, 
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    const toAddresses = [TO_EMAIL];
    if (userEmail && userEmail.trim() !== '') {
      toAddresses.push(userEmail.trim());
    }

    const refId = Math.random().toString(36).substring(7).toUpperCase();
    await transporter.sendMail({
      from: `"Sistema de Diagnóstico" <${SMTP_USER}>`,
      to: toAddresses.join(', '),
      subject: `Novo Relatório de Diagnóstico Estratégico - Ref: ${refId}`,
      html: htmlContent,
    });
    
    return { success: true };
  } catch (error: any) {
    console.error("Failed to send email:", error);
    return { success: false, error: error.message || 'Erro desconhecido ao conectar com servidor SMTP.' };
  }
}

startServer();
