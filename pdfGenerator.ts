import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import {
  CertificateData,
  OFFICIAL_VERIFICATION_BASE_URL,
  OFFICIAL_VERIFICATION_FULL_URL,
} from '../data/campaignData';
import {
  LOGO_EMS_DATA_URL,
  LOGO_CMDA_DATA_URL,
  SIG_BARBARA_DATA_URL,
  SIG_JAMES_DATA_URL,
} from '../data/certificateAssets';

function drawTripleFrame(doc: jsPDF): void {
  // Fundo creme acadêmico (#FFFDFA)
  doc.setFillColor(255, 253, 250);
  doc.rect(0, 0, 297, 210, 'F');

  // Moldura Externa — Verde Esmeralda Institucional (#064E3B)
  doc.setDrawColor(6, 78, 59);
  doc.setLineWidth(0.8);
  doc.rect(5, 5, 287, 200, 'S');

  // Moldura Intermediária — Dourado Oficial (#D97706)
  doc.setDrawColor(217, 119, 6);
  doc.setLineWidth(0.35);
  doc.rect(6.8, 6.8, 283.4, 196.4, 'S');

  // Moldura Interna — Azul Marinho Institucional (#0A1D56)
  doc.setDrawColor(10, 29, 86);
  doc.setLineWidth(0.5);
  doc.rect(8.2, 8.2, 280.6, 193.6, 'S');
}

/**
 * Gera o Certificado Nº 06 em PDF 100% Vetorial, Editável e Acessível (padrão Certificado Nº 02),
 * mantendo todo o texto nativo selecionável/copiável e links permanentes clicáveis (doc.link)
 * apontando para https://extensao-saude-dengue-vacina-sus.vercel.app/.
 */
export async function generateCertificate06Pdf(
  cert: CertificateData,
  _baseUrl?: string
): Promise<void> {
  const displayBaseUrl = OFFICIAL_VERIFICATION_BASE_URL;
  const verificationUrl = OFFICIAL_VERIFICATION_FULL_URL;

  const qrDataUrl = await QRCode.toDataURL(verificationUrl, {
    width: 320,
    margin: 1,
    errorCorrectionLevel: 'M',
    color: {
      dark: '#064E3B',
      light: '#FFFFFF',
    },
  });

  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  // Metadados internos de acessibilidade e catalogação do PDF
  doc.setProperties({
    title: `Certificado de Extensão Nº ${cert.number} - ${cert.recipientName} (${cert.code})`,
    subject: cert.title,
    author:
      'Editora Mente e Saúde (CNPJ 51.372.335/0001-71) & Centro Profissionalizante Maria Dalva de Araújo (CNPJ 51.269.112/0001-83)',
    keywords: `Extensão, Saúde Pública, Dengue, Vacina SUS, ${cert.code}, ${cert.controlKey}, Fé Pública`,
    creator: 'Sistema Interinstitucional de Certificação e Fé Pública',
  });

  // =========================================================================
  // PÁGINA 1 — FRENTE DO CERTIFICADO (100% VETORIAL E SELECIONÁVEL)
  // =========================================================================
  drawTripleFrame(doc);

  // Brasão Esquerdo: Editora Mente e Saúde
  doc.addImage(LOGO_EMS_DATA_URL, 'PNG', 14, 12, 20, 20);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(6, 78, 59);
  doc.text('EDITORA MENTE E SAÚDE', 37, 18);

  doc.setFont('courier', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text('CNPJ: 51.372.335/0001-71', 37, 22.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(13, 148, 136);
  doc.text('Conselho Editorial e Extensão Científica', 37, 26.5);

  // Centro do Cabeçalho
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(6, 78, 59);
  doc.text(
    'PROGRAMA INTERINSTITUCIONAL DE EXTENSÃO, COMUNICAÇÃO CIENTÍFICA',
    148.5,
    17,
    { align: 'center' }
  );
  doc.text('E EDUCAÇÃO EM SAÚDE', 148.5, 21.2, { align: 'center' });

  doc.setFont('courier', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(10, 29, 86);
  doc.text(
    `Certificado Nº ${cert.number} · Livro de Extensão nº ${cert.book} · Cód. ${cert.code}`,
    148.5,
    26.2,
    { align: 'center' }
  );

  // Brasão Direito: Centro Profissionalizante Maria Dalva de Araújo
  doc.addImage(LOGO_CMDA_DATA_URL, 'PNG', 263, 12, 20, 20);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(10, 29, 86);
  doc.text('CENTRO PROFISSIONALIZANTE', 259, 17.5, { align: 'right' });
  doc.text('MARIA DALVA DE ARAÚJO', 259, 21.8, { align: 'right' });

  doc.setFont('courier', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text('CNPJ: 51.269.112/0001-83', 259, 26.2, { align: 'right' });

  // Linha divisória do cabeçalho
  doc.setDrawColor(6, 78, 59);
  doc.setLineWidth(0.25);
  doc.line(14, 35, 283, 35);

  // Título Principal + Filete Dourado
  doc.setFont('times', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(6, 78, 59);
  doc.text('CERTIFICADO DE ATIVIDADE DE EXTENSÃO', 148.5, 47, {
    align: 'center',
  });

  doc.setDrawColor(217, 119, 6);
  doc.setLineWidth(0.5);
  doc.line(95, 50, 202, 50);

  // Texto Introdutório Institucional
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text(
    'A Editora Mente e Saúde (CNPJ: 51.372.335/0001-71), em parceria institucional com o Centro Profissionalizante Maria Dalva de Araújo (CNPJ:',
    148.5,
    58.5,
    { align: 'center' }
  );
  doc.text(
    '51.269.112/0001-83), certifica para os devidos fins de comprovação curricular e acadêmica que',
    148.5,
    62.8,
    { align: 'center' }
  );

  // Quadro de Destaque do Médico Titular (#ECFDF5 com borda dourada #D97706)
  doc.setFillColor(236, 253, 245);
  doc.setDrawColor(217, 119, 6);
  doc.setLineWidth(0.3);
  doc.rect(24, 67, 249, 21, 'FD');

  doc.setFont('times', 'bold');
  doc.setFontSize(23);
  doc.setTextColor(10, 29, 86);
  doc.text(cert.recipientName, 148.5, 77, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(
    `${cert.recipientRole}  |  CPF: ${cert.recipientCpf}  |  ${cert.recipientInstitution}`,
    148.5,
    84.2,
    { align: 'center' }
  );

  // Corpo Técnico — Parágrafo 1 e Parágrafo 2 (Texto Vetorial Nativo Selecionável)
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.1);
  doc.setTextColor(15, 23, 42);

  const p1Lines: string[] = doc.splitTextToSize(cert.frontBodyParagraph1, 248);
  doc.text(p1Lines, 24.5, 96.5, { lineHeightFactor: 1.35 });

  const p2Lines: string[] = doc.splitTextToSize(cert.frontBodyParagraph2, 248);
  doc.text(p2Lines, 24.5, 114.5, { lineHeightFactor: 1.35 });

  // Local e Data de Emissão
  doc.setFont('times', 'italic');
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.text(`${cert.cityState}, ${cert.issueDate}.`, 148.5, 136.5, {
    align: 'center',
  });

  // =========================================================================
  // RODAPÉ DA LAUDA 1: ASSINATURAS, SELO VETORIAL, QR CODE E LINKS ATIVOS
  // =========================================================================

  // Assinatura Esquerda: Bárbara Lima dos Santos
  doc.addImage(SIG_BARBARA_DATA_URL, 'PNG', 22, 149, 64, 18);
  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(0.3);
  doc.line(15, 168.5, 93, 168.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(6, 78, 59);
  doc.text('BÁRBARA LIMA DOS SANTOS', 54, 173, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.2);
  doc.setTextColor(15, 23, 42);
  doc.text('Diretora Executiva e Conselho Editorial', 54, 176.8, {
    align: 'center',
  });

  doc.setFont('courier', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(13, 148, 136);
  doc.text('Editora Mente e Saúde · CNPJ 51.372.335/0001-71', 54, 180.5, {
    align: 'center',
  });

  // Selo Oficial de Fé Pública (100% Vetorial e Selecionável)
  doc.setFillColor(254, 243, 199);
  doc.setDrawColor(217, 119, 6);
  doc.setLineWidth(0.45);
  doc.circle(109, 165, 11.5, 'FD');

  doc.setDrawColor(6, 78, 59);
  doc.setLineWidth(0.2);
  doc.circle(109, 165, 9.8, 'S');

  doc.setFont('times', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(6, 78, 59);
  doc.text('SELO OFICIAL', 109, 161.5, { align: 'center' });

  doc.setFont('times', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(217, 119, 6);
  doc.text('FÉ PÚBLICA', 109, 165.8, { align: 'center' });

  doc.setFont('courier', 'bold');
  doc.setFontSize(5.5);
  doc.setTextColor(10, 29, 86);
  doc.text(cert.code, 109, 169.8, { align: 'center' });

  // Quadro QR Code (com Link Clicável Nativo no PDF)
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(6, 78, 59);
  doc.setLineWidth(0.3);
  doc.rect(123.5, 151.5, 25, 25, 'FD');
  doc.addImage(qrDataUrl, 'PNG', 124.5, 152.5, 23, 23);
  doc.link(123.5, 151.5, 25, 25, { url: verificationUrl });

  // Quadro de Autenticação Pública Manual (com Link Clicável Nativo no PDF)
  doc.setFillColor(236, 253, 245);
  doc.setDrawColor(6, 78, 59);
  doc.setLineWidth(0.25);
  doc.rect(150.5, 151.5, 49, 25, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.2);
  doc.setTextColor(6, 78, 59);
  doc.text('AUTENTICAÇÃO PÚBLICA MANUAL', 152.5, 155.5);

  doc.setFont('courier', 'bold');
  doc.setFontSize(6);
  doc.setTextColor(15, 23, 42);
  doc.text(`Cód.: ${cert.code}`, 152.5, 159.5);
  doc.text(`Chave: ${cert.controlKey}`, 152.5, 163.2);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5.5);
  doc.setTextColor(13, 148, 136);
  doc.text('Endereço p/ Verificação Online:', 152.5, 167.2);

  doc.setFont('courier', 'bold');
  doc.setFontSize(5.0);
  doc.setTextColor(10, 29, 86);
  doc.text('https://extensao-saude-dengue-vacina', 152.5, 170.8);
  doc.text('-sus.vercel.app/', 152.5, 173.8);
  doc.link(150.5, 151.5, 49, 25, { url: verificationUrl });

  // Assinatura Direita: James Araújo de Santana
  doc.addImage(SIG_JAMES_DATA_URL, 'PNG', 210, 149, 64, 18);
  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(0.3);
  doc.line(203, 168.5, 282, 168.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(10, 29, 86);
  doc.text('JAMES ARAÚJO DE SANTANA', 242.5, 173, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.2);
  doc.setTextColor(15, 23, 42);
  doc.text('Diretor Institucional e Coordenador Pedagógico', 242.5, 176.8, {
    align: 'center',
  });

  doc.setFont('courier', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(13, 148, 136);
  doc.text(
    'Centro Maria Dalva de Araújo · CNPJ 51.269.112/0001-83',
    242.5,
    180.5,
    { align: 'center' }
  );

  // Linha Inferior de Verificação (com Link Clicável Nativo no PDF)
  doc.setFont('courier', 'bold');
  doc.setFontSize(6.4);
  doc.setTextColor(6, 78, 59);
  doc.text(
    `Verifique via QR Code ou acesse ${displayBaseUrl} informando o Código ${cert.code} ou Chave ${cert.controlKey}`,
    148.5,
    191.5,
    { align: 'center' }
  );
  doc.link(24, 188, 249, 5, { url: verificationUrl });

  // =========================================================================
  // PÁGINA 2 — VERSO DO CERTIFICADO (MEMORIAL DESCRITIVO VETORIAL)
  // =========================================================================
  doc.addPage('a4', 'landscape');
  drawTripleFrame(doc);

  // Cabeçalho do Verso
  doc.addImage(LOGO_EMS_DATA_URL, 'PNG', 14, 12, 13, 13);
  doc.addImage(LOGO_CMDA_DATA_URL, 'PNG', 29, 12, 13, 13);

  doc.setFont('times', 'bold');
  doc.setFontSize(13.5);
  doc.setTextColor(6, 78, 59);
  doc.text(
    'MEMORIAL DESCRITIVO, QUADRO PROGRAMÁTICO E REGISTRO DE AUTENTICIDADE (VERSO)',
    46,
    17.5
  );

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text(
    `Documento integrante do Certificado Nº ${cert.number} (${cert.code}) · Titular: ${cert.recipientName} (CPF: ${cert.recipientCpf})`,
    46,
    22.8
  );

  doc.setDrawColor(6, 78, 59);
  doc.setLineWidth(0.25);
  doc.line(14, 27.5, 283, 27.5);

  // Quadro 1: Identificação do Projeto e Enquadramento Normativo
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(6, 78, 59);
  doc.setLineWidth(0.25);
  doc.rect(14, 31, 155, 42, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(6, 78, 59);
  doc.text(
    '1. IDENTIFICAÇÃO DO PROJETO E ENQUADRAMENTO NORMATIVO',
    18,
    36.8
  );

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.8);
  doc.setTextColor(15, 23, 42);
  doc.text(
    '• Projeto: Campanha Educativa Digital contra Arboviroses: Quiz Populacional e Vacina no SUS',
    18,
    42.5
  );
  doc.text(`• Modalidade: ${cert.modality}`, 18, 47.5);
  doc.text(
    `• Período de Execução: ${cert.period}   |   Emissão do Certificado: ${cert.issueDate}`,
    18,
    52.5
  );
  doc.text(
    '• Local / Abrangência: Goiânia e Região Metropolitana - GO (Comunidade Geral e Rede Pública / SUS)',
    18,
    57.5
  );
  doc.text(
    '• Público-Alvo: População em geral, responsáveis por jovens (10 a 14 anos) e usuários do SUS',
    18,
    62.5
  );

  // Quadro 2: Registro Acadêmico e Controle Institucional
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(6, 78, 59);
  doc.setLineWidth(0.25);
  doc.rect(173, 31, 110, 42, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(10, 29, 86);
  doc.text('2. REGISTRO ACADÊMICO E CONTROLE INSTITUCIONAL', 177, 36.8);

  doc.setFont('courier', 'bold');
  doc.setFontSize(7.8);
  doc.setTextColor(15, 23, 42);
  doc.text(`• Livro de Registro: Livro de Extensão nº ${cert.book}`, 177, 42.5);
  doc.text(
    `• Assento / Folha: Folha ${cert.sheet} (Certificado Nº ${cert.number})`,
    177,
    47.5
  );
  doc.text(`• Código Verificador: ${cert.code}`, 177, 52.5);
  doc.text(`• Chave de Controle: ${cert.controlKey}`, 177, 57.5);
  doc.text(`• Carga Horária Total: ${cert.workloadHours}`, 177, 62.5);

  // Quadro 3: Estrutura Programática, Metodologia e Detalhamento da Carga Horária (08 Horas)
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(6, 78, 59);
  doc.setLineWidth(0.25);
  doc.rect(14, 76.5, 269, 66.5, 'FD');

  doc.setFillColor(236, 253, 245);
  doc.rect(14, 76.5, 269, 7.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.2);
  doc.setTextColor(6, 78, 59);
  doc.text(
    '3. ESTRUTURA PROGRAMÁTICA, METODOLOGIA E DETALHAMENTO DA CARGA HORÁRIA (08 HORAS)',
    18,
    81.6
  );
  doc.text('C.H.', 278, 81.6, { align: 'right' });

  cert.axes.forEach((axis, idx) => {
    const rowTop = 84 + idx * 14.7;

    if (idx > 0) {
      doc.setDrawColor(203, 213, 225);
      doc.setLineWidth(0.2);
      doc.line(14, rowTop, 283, rowTop);
    }

    // Coluna 1: Título do Eixo
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.4);
    doc.setTextColor(10, 29, 86);
    const titleLines: string[] = doc.splitTextToSize(axis.title, 74);
    doc.text(titleLines, 16.5, rowTop + 4.8);

    // Coluna 2: Descrição Metodológica
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.3);
    doc.setTextColor(15, 23, 42);
    const descLines: string[] = doc.splitTextToSize(axis.description, 160);
    doc.text(descLines, 95.5, rowTop + 4.8);

    // Coluna 3: Carga Horária Parcial
    doc.setFont('courier', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(6, 78, 59);
    doc.text(axis.hours, 270.5, rowTop + 7.5, { align: 'center' });
  });

  // Divisórias verticais da tabela programática
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.2);
  doc.line(93, 84, 93, 143);
  doc.line(258, 84, 258, 143);

  // Quadro 4: Verificação de Autenticidade, QR Code e Declaração de Fé Pública
  doc.setFillColor(254, 243, 199);
  doc.setDrawColor(217, 119, 6);
  doc.setLineWidth(0.35);
  doc.rect(14, 146.5, 269, 29, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.2);
  doc.setTextColor(6, 78, 59);
  doc.text(
    '4. VERIFICAÇÃO DE AUTENTICIDADE, QR CODE E DECLARAÇÃO DE FÉ PÚBLICA',
    18,
    152
  );

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.4);
  doc.setTextColor(15, 23, 42);
  doc.text(
    'A autenticidade deste certificado pode ser verificada a qualquer tempo pela banca examinadora mediante leitura do QR Code ao lado ou acesso direto ao',
    18,
    156.8
  );
  doc.text(
    'Portal Institucional de Validação no endereço eletrônico abaixo, informando o Código de Registro ou a Chave de Controle:',
    18,
    160.8
  );

  doc.setFont('courier', 'bold');
  doc.setFontSize(7.6);
  doc.setTextColor(10, 29, 86);
  doc.text(
    `URL de Verificação: ${displayBaseUrl}   |   Código: ${cert.code}   |   Chave: ${cert.controlKey}`,
    18,
    166.2
  );
  doc.link(18, 163, 232, 4.5, { url: verificationUrl });

  doc.setFont('courier', 'bold');
  doc.setFontSize(6.8);
  doc.setTextColor(13, 148, 136);
  doc.text(`Assinatura Digital / Hash SHA-256: ${cert.sha256}`, 18, 171.5);

  // QR Code no Verso (com Link Clicável Nativo no PDF)
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(6, 78, 59);
  doc.setLineWidth(0.25);
  doc.rect(254.5, 148.2, 25.5, 25.5, 'FD');
  doc.addImage(qrDataUrl, 'PNG', 255.5, 149.2, 23.5, 23.5);
  doc.link(254.5, 148.2, 25.5, 25.5, { url: verificationUrl });

  // Rodapé de Assinaturas da Página 2
  doc.addImage(SIG_BARBARA_DATA_URL, 'PNG', 32, 176.5, 52, 14.5);
  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(0.25);
  doc.line(22, 191.5, 95, 191.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(6, 78, 59);
  doc.text('BÁRBARA LIMA DOS SANTOS', 58.5, 195.2, { align: 'center' });

  doc.setFont('courier', 'bold');
  doc.setFontSize(6.2);
  doc.setTextColor(15, 23, 42);
  doc.text('Editora Mente e Saúde · CNPJ 51.372.335/0001-71', 58.5, 198.5, {
    align: 'center',
  });

  // Declaração Legal Central do Verso
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.2);
  doc.setTextColor(6, 78, 59);
  doc.text(
    'Certificado emitido em conformidade com a Lei nº 9.394/1996 (LDB) e diretrizes de extensão.',
    148.5,
    187.5,
    { align: 'center' }
  );

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(15, 23, 42);
  doc.text(
    'Ambas as instituições detêm CNAE principal/secundário habilitado para edição, treinamento e extensão.',
    148.5,
    191.5,
    { align: 'center' }
  );

  doc.setFont('courier', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(10, 29, 86);
  doc.text(
    `${cert.cityState}, ${cert.issueDate} · Página 2 de 2`,
    148.5,
    196.2,
    { align: 'center' }
  );

  doc.addImage(SIG_JAMES_DATA_URL, 'PNG', 213, 176.5, 52, 14.5);
  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(0.25);
  doc.line(202, 191.5, 275, 191.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(10, 29, 86);
  doc.text('JAMES ARAÚJO DE SANTANA', 238.5, 195.2, { align: 'center' });

  doc.setFont('courier', 'bold');
  doc.setFontSize(6.2);
  doc.setTextColor(15, 23, 42);
  doc.text(
    'Centro Maria Dalva de Araújo · CNPJ 51.269.112/0001-83',
    238.5,
    198.5,
    { align: 'center' }
  );

  doc.save(
    `Certificado_Extensao_06_${cert.code}_Lucas_Goncalves_Silveira.pdf`
  );
}
