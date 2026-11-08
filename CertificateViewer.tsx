import React, { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';
import {
  Download,
  Printer,
  CheckCircle2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  QrCode,
  FileCheck2,
  ExternalLink,
} from 'lucide-react';
import {
  CertificateData,
  OFFICIAL_VERIFICATION_BASE_URL,
  OFFICIAL_VERIFICATION_FULL_URL,
} from '../data/campaignData';
import {
  LogoEditoraMenteSaude,
  LogoCentroMariaDalva,
  SignatureBarbaraSvg,
  SignatureJamesSvg,
  SeloFePublicaSvg,
} from './InstitutionalAssets';
import { generateCertificate06Pdf } from '../utils/pdfGenerator';

interface CertificateViewerProps {
  certificate: CertificateData;
  onVerifyClick: (code: string) => void;
}

export const CertificateViewer: React.FC<CertificateViewerProps> = ({
  certificate,
  onVerifyClick,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [viewMode, setViewMode] = useState<'both' | 'front' | 'back'>('both');
  const [scaleMode, setScaleMode] = useState<'fit' | '90' | '100'>('fit');
  const [containerWidth, setContainerWidth] = useState<number>(1122);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [pdfSuccessMessage, setPdfSuccessMessage] = useState<boolean>(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const displayBaseUrl = OFFICIAL_VERIFICATION_BASE_URL;
  const verificationUrl = OFFICIAL_VERIFICATION_FULL_URL;

  useEffect(() => {
    QRCode.toDataURL(verificationUrl, {
      width: 320,
      margin: 1,
      errorCorrectionLevel: 'M',
      color: {
        dark: '#064E3B',
        light: '#FFFFFF',
      },
    })
      .then(setQrDataUrl)
      .catch(console.error);
  }, [verificationUrl]);

  useEffect(() => {
    const updateWidth = () => {
      if (wrapperRef.current) {
        const available = wrapperRef.current.clientWidth - 32;
        setContainerWidth(Math.max(320, available));
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const handleDownloadPdf = async () => {
    try {
      setIsGeneratingPdf(true);
      await generateCertificate06Pdf(certificate, displayBaseUrl);
      setPdfSuccessMessage(true);
      setTimeout(() => setPdfSuccessMessage(false), 5000);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleNativePrint = () => {
    window.print();
  };

  // A4 Landscape @ 96 DPI = 1122px x 794px
  const BASE_WIDTH = 1122;
  const BASE_HEIGHT = 794;

  const computedScale =
    scaleMode === '100'
      ? 1
      : scaleMode === '90'
        ? 0.9
        : Math.min(1, containerWidth / BASE_WIDTH);

  return (
    <div className="w-full">
      {/* Barra de Ferramentas estilo Leitor de PDF Acadêmico */}
      <div className="bg-[#11241E] text-white rounded-t-xl border border-[#0F4C3A] px-4 py-3.5 flex flex-wrap items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#0F4C3A] border border-emerald-700/60 flex items-center justify-center shrink-0">
            <FileCheck2 className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs text-emerald-200/90 font-mono-tabular">
              <span>
                Certificado_Extensao_06_{certificate.code}_Lucas_Goncalves_Silveira.pdf
              </span>
              <span>·</span>
              <span>PDF Vetorial Editável/Selecionável (A4 297×210mm)</span>
            </div>
            <h3 className="text-sm font-semibold text-white">
              Visualizador Oficial de Documento com Fé Pública — Certificado Nº 06
            </h3>
          </div>
        </div>

        {/* Seletor de Laudas */}
        <div className="flex items-center gap-1 bg-[#0A1713] p-1 rounded-lg border border-emerald-900/80">
          <button
            type="button"
            onClick={() => setViewMode('both')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              viewMode === 'both'
                ? 'bg-[#0F4C3A] text-white shadow-xs'
                : 'text-emerald-200/75 hover:text-white'
            }`}
          >
            Frente e Verso (2 Laudas)
          </button>
          <button
            type="button"
            onClick={() => setViewMode('front')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              viewMode === 'front'
                ? 'bg-[#0F4C3A] text-white shadow-xs'
                : 'text-emerald-200/75 hover:text-white'
            }`}
          >
            Lauda 1 (Frente)
          </button>
          <button
            type="button"
            onClick={() => setViewMode('back')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              viewMode === 'back'
                ? 'bg-[#0F4C3A] text-white shadow-xs'
                : 'text-emerald-200/75 hover:text-white'
            }`}
          >
            Lauda 2 (Verso / Ementa)
          </button>
        </div>

        {/* Controles de Zoom + Download PDF Vetorial */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="hidden sm:flex items-center gap-1 bg-[#0A1713] p-1 rounded-lg border border-emerald-900/80">
            <button
              type="button"
              onClick={() => setScaleMode('fit')}
              title="Ajustar à largura da tela"
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer ${
                scaleMode === 'fit'
                  ? 'bg-emerald-800/80 text-white'
                  : 'text-emerald-200/70 hover:text-white'
              }`}
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Ajustar</span>
            </button>
            <button
              type="button"
              onClick={() => setScaleMode('90')}
              title="Zoom 90%"
              className={`px-2 py-1 text-xs font-mono-tabular rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                scaleMode === '90'
                  ? 'bg-emerald-800/80 text-white'
                  : 'text-emerald-200/70 hover:text-white'
              }`}
            >
              <ZoomOut className="w-3.5 h-3.5 inline mr-0.5" />
              90%
            </button>
            <button
              type="button"
              onClick={() => setScaleMode('100')}
              title="Tamanho Real 100%"
              className={`px-2 py-1 text-xs font-mono-tabular rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                scaleMode === '100'
                  ? 'bg-emerald-800/80 text-white'
                  : 'text-emerald-200/70 hover:text-white'
              }`}
            >
              <ZoomIn className="w-3.5 h-3.5 inline mr-0.5" />
              100%
            </button>
          </div>

          <button
            type="button"
            onClick={() => onVerifyClick(certificate.code)}
            className="px-3 py-2 text-xs font-medium text-emerald-100 bg-[#1B365D] hover:bg-[#234575] rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <QrCode className="w-3.5 h-3.5 text-amber-300" />
            <span>Validar QR Code no Site</span>
          </button>

          <button
            type="button"
            onClick={handleNativePrint}
            className="px-3 py-2 text-xs font-medium text-emerald-100 bg-emerald-900/70 hover:bg-emerald-800 rounded-lg border border-emerald-700/60 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="px-4 py-2 text-xs font-semibold text-[#111827] bg-[#F59E0B] hover:bg-[#FBBF24] disabled:opacity-60 rounded-lg shadow-sm transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>
              {isGeneratingPdf
                ? 'Gerando PDF Vetorial...'
                : 'Baixar Certificado Nº 06 em PDF'}
            </span>
          </button>
        </div>
      </div>

      {/* Feedback de Download Concluído */}
      {pdfSuccessMessage && (
        <div className="bg-emerald-900 text-emerald-50 px-4 py-2.5 text-xs flex items-center justify-between border-x border-emerald-700 no-print">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
            <span>
              Download concluído:{' '}
              <strong>
                Certificado_Extensao_06_{certificate.code}_Lucas_Goncalves_Silveira.pdf
              </strong>{' '}
              gerado em PDF 100% vetorial (texto selecionável/copiável e links clicáveis para {displayBaseUrl}).
            </span>
          </div>
        </div>
      )}

      {/* Área do Canvas / Visualizador Estilo Leitor PDF */}
      <div
        ref={wrapperRef}
        className="bg-[#272A30] border-x border-b border-stone-700 rounded-b-xl p-4 sm:p-8 overflow-x-auto flex flex-col items-center gap-8 print-only-certificate"
      >
        {/* ===================================================================
            LAUDA 1 — FRENTE DO CERTIFICADO Nº 06 (1122px x 794px)
           =================================================================== */}
        {(viewMode === 'both' || viewMode === 'front') && (
          <div className="flex flex-col items-center">
            <div className="w-full flex items-center justify-between text-xs text-stone-300 mb-2 px-1 no-print font-mono-tabular">
              <span>PÁGINA 1 DE 2 — FRENTE DO CERTIFICADO (TEXTO SELECIONÁVEL E LINKS ATIVOS)</span>
              <span>
                DIMENSÃO: 297mm × 210mm (A4 PAISAGEM) · CÓD: {certificate.code}
              </span>
            </div>

            <div
              style={{
                width: `${BASE_WIDTH * computedScale}px`,
                height: `${BASE_HEIGHT * computedScale}px`,
              }}
              className="relative overflow-hidden shadow-2xl rounded-xs transition-all duration-150"
            >
              <div
                style={{
                  width: `${BASE_WIDTH}px`,
                  height: `${BASE_HEIGHT}px`,
                  transform: `scale(${computedScale})`,
                  transformOrigin: 'top left',
                }}
                className="bg-[#FFFDFA] text-[#0F172A] relative p-[19px] select-text certificate-page-print"
              >
                {/* Moldura Externa Verde Esmeralda (#064E3B) */}
                <div className="w-full h-full border-[3px] border-[#064E3B] p-[5px]">
                  {/* Moldura Intermediária Dourada (#D97706) */}
                  <div className="w-full h-full border-[1.4px] border-[#D97706] p-[4px]">
                    {/* Moldura Interna Azul Marinho (#0A1D56) */}
                    <div className="w-full h-full border-[2px] border-[#0A1D56] px-7 py-4 flex flex-col justify-between relative">
                      {/* BLOCO SUPERIOR E CENTRAL */}
                      <div>
                        {/* CABEÇALHO SUPERIOR ALINHADO */}
                        <div className="grid grid-cols-12 items-center pb-3 border-b border-[#064E3B]">
                          {/* Instituição 1: Editora Mente e Saúde */}
                          <div className="col-span-4 flex items-center gap-3">
                            <LogoEditoraMenteSaude className="w-[74px] h-[74px] shrink-0" />
                            <div className="leading-snug">
                              <p className="text-[13.5px] font-bold tracking-tight text-[#064E3B]">
                                EDITORA MENTE E SAÚDE
                              </p>
                              <p className="text-[11.2px] font-bold font-mono-tabular text-[#0F172A] mt-0.5">
                                CNPJ: 51.372.335/0001-71
                              </p>
                              <p className="text-[10.5px] font-medium text-[#0D9488] mt-0.5">
                                Conselho Editorial e Extensão Científica
                              </p>
                            </div>
                          </div>

                          {/* Centro: Programa Interinstitucional */}
                          <div className="col-span-4 text-center px-1">
                            <p className="text-[11.5px] font-bold tracking-wide text-[#064E3B] uppercase leading-snug">
                              PROGRAMA INTERINSTITUCIONAL DE EXTENSÃO, COMUNICAÇÃO
                              CIENTÍFICA
                              <br />E EDUCAÇÃO EM SAÚDE
                            </p>
                            <p className="text-[10.8px] font-bold font-mono-tabular text-[#0A1D56] mt-1.5">
                              Certificado Nº {certificate.number} · Livro de Extensão nº{' '}
                              {certificate.book} · Cód. {certificate.code}
                            </p>
                          </div>

                          {/* Instituição 2: Centro Profissionalizante Maria Dalva de Araújo */}
                          <div className="col-span-4 flex items-center justify-end gap-3 text-right">
                            <div className="leading-snug">
                              <p className="text-[13px] font-bold tracking-tight text-[#0A1D56]">
                                CENTRO PROFISSIONALIZANTE
                              </p>
                              <p className="text-[13px] font-bold tracking-tight text-[#0A1D56]">
                                MARIA DALVA DE ARAÚJO
                              </p>
                              <p className="text-[11.2px] font-bold font-mono-tabular text-[#0F172A] mt-0.5">
                                CNPJ: 51.269.112/0001-83
                              </p>
                            </div>
                            <LogoCentroMariaDalva className="w-[74px] h-[74px] shrink-0" />
                          </div>
                        </div>

                        {/* TÍTULO PRINCIPAL DO CERTIFICADO + FILETE DOURADO */}
                        <div className="text-center mt-3.5">
                          <h1 className="font-serif-editorial text-[34px] font-bold tracking-[0.04em] text-[#064E3B] uppercase leading-none">
                            CERTIFICADO DE ATIVIDADE DE EXTENSÃO
                          </h1>
                          <div className="w-[404px] h-[2px] bg-[#D97706] mx-auto mt-2" />
                          <p className="text-[13.8px] text-[#0F172A] mt-2.5 max-w-[935px] mx-auto leading-snug">
                            A Editora Mente e Saúde (CNPJ: 51.372.335/0001-71), em
                            parceria institucional com o Centro Profissionalizante Maria
                            Dalva de Araújo (CNPJ: 51.269.112/0001-83), certifica para os
                            devidos fins de comprovação curricular e acadêmica que
                          </p>
                        </div>

                        {/* QUADRO DO MÉDICO TITULAR (Idêntico ao Certificado Nº 02: #ECFDF5 com borda dourada #D97706) */}
                        <div className="mt-3 mx-auto w-[940px] bg-[#ECFDF5] border-[1.2px] border-[#D97706] py-3 px-6 text-center">
                          <h2 className="font-serif-editorial text-[32px] font-bold tracking-[0.03em] text-[#0A1D56] leading-none">
                            {certificate.recipientName}
                          </h2>
                          <p className="text-[13.5px] font-bold text-[#0F172A] mt-1.5">
                            {certificate.recipientRole} &nbsp;|&nbsp; CPF:{' '}
                            <span className="font-mono-tabular">
                              {certificate.recipientCpf}
                            </span>{' '}
                            &nbsp;|&nbsp; {certificate.recipientInstitution}
                          </p>
                        </div>

                        {/* CORPO DO TEXTO SELECIONÁVEL */}
                        <div className="mt-3.5 w-[940px] mx-auto text-[13.8px] leading-[1.48] text-[#0F172A] text-left space-y-2.5">
                          <p>{certificate.frontBodyParagraph1}</p>
                          <p>{certificate.frontBodyParagraph2}</p>
                        </div>

                        {/* LOCAL E DATA DE EMISSÃO */}
                        <div className="text-center mt-3">
                          <p className="font-serif-editorial italic text-[19px] text-[#0F172A]">
                            {certificate.cityState}, {certificate.issueDate}.
                          </p>
                        </div>
                      </div>

                      {/* RODAPÉ SIMÉTRICO DE ASSINATURAS, SELO DE FÉ PÚBLICA, QR CODE E LINKS ATIVOS */}
                      <div>
                        <div className="w-[980px] mx-auto grid grid-cols-12 items-end gap-2">
                          {/* Assinatura 1: Bárbara Lima dos Santos */}
                          <div className="col-span-4 flex flex-col items-center">
                            <div className="h-[68px] flex items-end justify-center pb-0.5">
                              <SignatureBarbaraSvg className="w-[242px] h-[68px]" />
                            </div>
                            <div className="w-[294px] border-t border-[#0F172A] pt-1.5 text-center">
                              <p className="text-[11.5px] font-bold text-[#064E3B] tracking-wide leading-tight">
                                BÁRBARA LIMA DOS SANTOS
                              </p>
                              <p className="text-[10px] text-[#0F172A] mt-0.5 leading-tight">
                                Diretora Executiva e Conselho Editorial
                              </p>
                              <p className="text-[9.2px] font-bold font-mono-tabular text-[#0D9488] mt-0.5 leading-tight whitespace-nowrap">
                                Editora Mente e Saúde · CNPJ 51.372.335/0001-71
                              </p>
                            </div>
                          </div>

                          {/* Centro: Selo Oficial + QR Code Clicável + Autenticação Pública Manual Clicável */}
                          <div className="col-span-4 flex items-center justify-center gap-2 pb-0.5">
                            <SeloFePublicaSvg
                              code={certificate.code}
                              className="w-[86px] h-[86px] shrink-0"
                            />

                            <a
                              href={verificationUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Clique para verificar a autenticidade online"
                              className="bg-white border border-[#064E3B] p-1 shrink-0 hover:ring-2 hover:ring-[#D97706] transition-all"
                            >
                              {qrDataUrl ? (
                                <img
                                  src={qrDataUrl}
                                  alt="QR Code de Autenticidade do Certificado 06"
                                  className="w-[84px] h-[84px] shrink-0"
                                />
                              ) : (
                                <div className="w-[84px] h-[84px] bg-stone-100" />
                              )}
                            </a>

                            <a
                              href={verificationUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Clique para acessar o Portal Oficial de Validação"
                              className="bg-[#ECFDF5] border border-[#064E3B] px-2.5 py-1.5 text-left leading-[1.24] w-[184px] h-[94px] flex flex-col justify-between hover:ring-2 hover:ring-[#D97706] transition-all"
                            >
                              <p className="text-[8.6px] font-bold text-[#064E3B] uppercase tracking-tight">
                                AUTENTICAÇÃO PÚBLICA MANUAL
                              </p>
                              <div>
                                <p className="text-[8.5px] font-mono-tabular font-bold text-[#0F172A]">
                                  Cód.: {certificate.code}
                                </p>
                                <p className="text-[8.5px] font-mono-tabular font-bold text-[#0F172A]">
                                  Chave: {certificate.controlKey}
                                </p>
                              </div>
                              <div>
                                <p className="text-[7.8px] text-[#0D9488] font-medium">
                                  Endereço p/ Verificação Online:
                                </p>
                                <p className="text-[7.4px] font-mono-tabular font-bold text-[#0A1D56] underline break-all leading-tight">
                                  {displayBaseUrl}
                                </p>
                              </div>
                            </a>
                          </div>

                          {/* Assinatura 2: James Araújo de Santana */}
                          <div className="col-span-4 flex flex-col items-center">
                            <div className="h-[68px] flex items-end justify-center pb-0.5">
                              <SignatureJamesSvg className="w-[242px] h-[68px]" />
                            </div>
                            <div className="w-[294px] border-t border-[#0F172A] pt-1.5 text-center">
                              <p className="text-[11.5px] font-bold text-[#0A1D56] tracking-wide leading-tight">
                                JAMES ARAÚJO DE SANTANA
                              </p>
                              <p className="text-[10px] text-[#0F172A] mt-0.5 leading-tight">
                                Diretor Institucional e Coordenador Pedagógico
                              </p>
                              <p className="text-[9.2px] font-bold font-mono-tabular text-[#0D9488] mt-0.5 leading-tight whitespace-nowrap">
                                Centro Maria Dalva de Araújo · CNPJ 51.269.112/0001-83
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* LINHA INFERIOR DE VERIFICAÇÃO COM LINK CLICÁVEL */}
                        <div className="mt-2.5 text-center">
                          <a
                            href={verificationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[9.5px] font-mono-tabular font-bold text-[#064E3B] hover:underline"
                          >
                            Verifique via QR Code ou acesse {displayBaseUrl} informando o
                            Código {certificate.code} ou Chave {certificate.controlKey}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            LAUDA 2 — VERSO DO CERTIFICADO Nº 06 (MEMORIAL DESCRITIVO E REGISTRO)
           =================================================================== */}
        {(viewMode === 'both' || viewMode === 'back') && (
          <div className="flex flex-col items-center">
            <div className="w-full flex items-center justify-between text-xs text-stone-300 mb-2 px-1 no-print font-mono-tabular">
              <span>
                PÁGINA 2 DE 2 — VERSO DO CERTIFICADO (MEMORIAL DESCRITIVO E EMENTA)
              </span>
              <span>
                REGISTRO: LIVRO {certificate.book} · FOLHA {certificate.sheet}
              </span>
            </div>

            <div
              style={{
                width: `${BASE_WIDTH * computedScale}px`,
                height: `${BASE_HEIGHT * computedScale}px`,
              }}
              className="relative overflow-hidden shadow-2xl rounded-xs transition-all duration-150"
            >
              <div
                style={{
                  width: `${BASE_WIDTH}px`,
                  height: `${BASE_HEIGHT}px`,
                  transform: `scale(${computedScale})`,
                  transformOrigin: 'top left',
                }}
                className="bg-[#FFFDFA] text-[#0F172A] relative p-[19px] select-text certificate-page-print"
              >
                {/* Moldura Externa Verde Esmeralda (#064E3B) */}
                <div className="w-full h-full border-[3px] border-[#064E3B] p-[5px]">
                  {/* Moldura Intermediária Dourada (#D97706) */}
                  <div className="w-full h-full border-[1.4px] border-[#D97706] p-[4px]">
                    {/* Moldura Interna Azul Marinho (#0A1D56) */}
                    <div className="w-full h-full border-[2px] border-[#0A1D56] px-7 py-3.5 flex flex-col justify-between relative">
                      <div>
                        {/* CABEÇALHO DO VERSO */}
                        <div className="flex items-center gap-3.5 pb-2 border-b border-[#064E3B]">
                          <div className="flex items-center gap-2 shrink-0">
                            <LogoEditoraMenteSaude className="w-[48px] h-[48px]" />
                            <LogoCentroMariaDalva className="w-[48px] h-[48px]" />
                          </div>
                          <div className="text-left">
                            <h2 className="font-serif-editorial text-[19.5px] font-bold tracking-[0.02em] text-[#064E3B] uppercase leading-tight">
                              MEMORIAL DESCRITIVO, QUADRO PROGRAMÁTICO E REGISTRO DE
                              AUTENTICIDADE (VERSO)
                            </h2>
                            <p className="text-[11.2px] text-[#0F172A] mt-0.5">
                              Documento integrante do Certificado Nº {certificate.number} (
                              {certificate.code}) · Titular: {certificate.recipientName}{' '}
                              (CPF: {certificate.recipientCpf})
                            </p>
                          </div>
                        </div>

                        {/* QUADROS 1 E 2 */}
                        <div className="grid grid-cols-12 gap-3.5 mt-2.5">
                          {/* Quadro 1 */}
                          <div className="col-span-7 bg-white border border-[#064E3B] p-3">
                            <h3 className="text-[11.2px] font-bold text-[#064E3B] uppercase tracking-wide mb-1.5">
                              1. IDENTIFICAÇÃO DO PROJETO E ENQUADRAMENTO NORMATIVO
                            </h3>
                            <div className="space-y-1 text-[10.8px] text-[#0F172A] leading-snug">
                              <p>
                                • <strong>Projeto:</strong> {certificate.title}
                              </p>
                              <p>
                                • <strong>Modalidade:</strong> {certificate.modality}
                              </p>
                              <p>
                                • <strong>Período de Execução:</strong>{' '}
                                {certificate.period} &nbsp;|&nbsp;{' '}
                                <strong>Emissão do Certificado:</strong>{' '}
                                {certificate.issueDate}
                              </p>
                              <p>
                                • <strong>Local / Abrangência:</strong> Goiânia e Região
                                Metropolitana - GO (Comunidade Geral e Rede Pública / SUS)
                              </p>
                              <p>
                                • <strong>Público-Alvo:</strong> População em geral,
                                responsáveis por jovens (10 a 14 anos) e usuários do SUS
                              </p>
                            </div>
                          </div>

                          {/* Quadro 2 */}
                          <div className="col-span-5 bg-white border border-[#064E3B] p-3">
                            <h3 className="text-[11.2px] font-bold text-[#0A1D56] uppercase tracking-wide mb-1.5">
                              2. REGISTRO ACADÊMICO E CONTROLE INSTITUCIONAL
                            </h3>
                            <div className="space-y-1 text-[10.8px] font-mono-tabular font-bold text-[#0F172A] leading-snug">
                              <p>
                                • Livro de Registro: Livro de Extensão nº{' '}
                                {certificate.book}
                              </p>
                              <p>
                                • Assento / Folha: Folha {certificate.sheet} (Certificado
                                Nº {certificate.number})
                              </p>
                              <p>• Código Verificador: {certificate.code}</p>
                              <p>• Chave de Controle: {certificate.controlKey}</p>
                              <p>• Carga Horária Total: {certificate.workloadHours}</p>
                            </div>
                          </div>
                        </div>

                        {/* QUADRO 3 — ESTRUTURA PROGRAMÁTICA, METODOLOGIA E DETALHAMENTO DA CARGA HORÁRIA */}
                        <div className="mt-2.5 border border-[#064E3B] bg-white">
                          <div className="bg-[#ECFDF5] border-b border-[#064E3B] px-3 py-1.5 flex items-center justify-between">
                            <h3 className="text-[11px] font-bold text-[#064E3A] uppercase tracking-wide">
                              3. ESTRUTURA PROGRAMÁTICA, METODOLOGIA E DETALHAMENTO DA
                              CARGA HORÁRIA (08 HORAS)
                            </h3>
                            <span className="text-[11px] font-bold text-[#064E3B]">
                              C.H.
                            </span>
                          </div>
                          <div className="divide-y divide-slate-300">
                            {certificate.axes.map((axis) => (
                              <div
                                key={axis.id}
                                className="grid grid-cols-12 items-center divide-x divide-slate-300"
                              >
                                <div className="col-span-3 px-2.5 py-2">
                                  <p className="text-[10.4px] font-bold text-[#0A1D56] leading-tight">
                                    {axis.title}
                                  </p>
                                </div>
                                <div className="col-span-8 px-2.5 py-2 text-[10.2px] text-[#0F172A] leading-snug">
                                  {axis.description}
                                </div>
                                <div className="col-span-1 px-1.5 py-2 text-center font-mono-tabular text-[10.6px] font-bold text-[#064E3B]">
                                  {axis.hours}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* QUADRO 4 — VERIFICAÇÃO DE AUTENTICIDADE, QR CODE E DECLARAÇÃO DE FÉ PÚBLICA */}
                        <div className="mt-2.5 bg-[#FEF3C7] border-[1.4px] border-[#D97706] p-2.5 flex items-center justify-between gap-4">
                          <div className="space-y-1 flex-1">
                            <h3 className="text-[11px] font-bold text-[#064E3B] uppercase tracking-wide">
                              4. VERIFICAÇÃO DE AUTENTICIDADE, QR CODE E DECLARAÇÃO DE FÉ
                              PÚBLICA
                            </h3>
                            <p className="text-[10.2px] text-[#0F172A] leading-snug">
                              A autenticidade deste certificado pode ser verificada a
                              qualquer tempo pela banca examinadora mediante leitura do QR
                              Code ao lado ou acesso direto ao Portal Institucional de
                              Validação no endereço eletrônico abaixo, informando o Código
                              de Registro ou a Chave de Controle:
                            </p>
                            <p className="text-[10.4px] font-mono-tabular font-bold text-[#0A1D56] pt-0.5">
                              URL de Verificação:{' '}
                              <a
                                href={verificationUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline hover:text-[#064E3B]"
                              >
                                {displayBaseUrl}
                              </a>{' '}
                              &nbsp;|&nbsp; Código: {certificate.code} &nbsp;|&nbsp;
                              Chave: {certificate.controlKey}
                            </p>
                            <p className="text-[9.6px] font-mono-tabular font-bold text-[#0D9488]">
                              Assinatura Digital / Hash SHA-256: {certificate.sha256}
                            </p>
                          </div>

                          <a
                            href={verificationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Clique para validar este certificado"
                            className="bg-white border border-[#064E3B] p-1 shrink-0 hover:ring-2 hover:ring-[#064E3B] transition-all"
                          >
                            {qrDataUrl ? (
                              <img
                                src={qrDataUrl}
                                alt="QR Code Verso Certificado 06"
                                className="w-[84px] h-[84px]"
                              />
                            ) : (
                              <div className="w-[84px] h-[84px] bg-stone-100" />
                            )}
                          </a>
                        </div>
                      </div>

                      {/* RODAPÉ SIMÉTRICO DO VERSO COM ASSINATURAS */}
                      <div className="w-[980px] mx-auto grid grid-cols-12 items-end pt-1">
                        <div className="col-span-4 flex flex-col items-center">
                          <div className="h-[55px] flex items-end justify-center pb-0.5">
                            <SignatureBarbaraSvg className="w-[196px] h-[55px]" />
                          </div>
                          <div className="w-[266px] border-t border-[#0F172A] pt-1 text-center">
                            <p className="text-[10.5px] font-bold text-[#064E3B] leading-tight">
                              BÁRBARA LIMA DOS SANTOS
                            </p>
                            <p className="text-[8.8px] font-bold font-mono-tabular text-[#0F172A] mt-0.5 leading-tight whitespace-nowrap">
                              Editora Mente e Saúde · CNPJ 51.372.335/0001-71
                            </p>
                          </div>
                        </div>

                        <div className="col-span-4 text-center pb-0.5">
                          <p className="text-[9.6px] font-bold text-[#064E3B] leading-tight">
                            Certificado emitido em conformidade com a Lei nº 9.394/1996
                            (LDB) e diretrizes de extensão.
                          </p>
                          <p className="text-[9px] text-[#0F172A] mt-0.5 leading-tight">
                            Ambas as instituições detêm CNAE principal/secundário
                            habilitado para edição, treinamento e extensão.
                          </p>
                          <p className="text-[9.4px] font-bold font-mono-tabular text-[#0A1D56] mt-0.5 leading-tight">
                            {certificate.cityState}, {certificate.issueDate} · Página 2 de
                            2
                          </p>
                        </div>

                        <div className="col-span-4 flex flex-col items-center">
                          <div className="h-[55px] flex items-end justify-center pb-0.5">
                            <SignatureJamesSvg className="w-[196px] h-[55px]" />
                          </div>
                          <div className="w-[266px] border-t border-[#0F172A] pt-1 text-center">
                            <p className="text-[10.5px] font-bold text-[#0A1D56] leading-tight">
                              JAMES ARAÚJO DE SANTANA
                            </p>
                            <p className="text-[8.8px] font-bold font-mono-tabular text-[#0F172A] mt-0.5 leading-tight whitespace-nowrap">
                              Centro Maria Dalva de Araújo · CNPJ 51.269.112/0001-83
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Rodapé informativo do Visualizador */}
        <div className="w-full max-w-[1122px] bg-stone-800/90 border border-stone-700 rounded-lg px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-300 no-print">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Padrão PDF 100% Vetorial e Acessível (idêntico ao Certificado Nº 02): texto selecionável para copiar/colar e link de acesso permanente para{' '}
              <a
                href={verificationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-300 underline hover:text-amber-200 font-mono-tabular"
              >
                {displayBaseUrl}
              </a>
              .
            </span>
          </div>
          <button
            type="button"
            onClick={() => onVerifyClick(certificate.code)}
            className="text-amber-300 hover:text-amber-200 font-medium flex items-center gap-1 cursor-pointer"
          >
            <span>Testar Validação Pública deste Certificado</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
