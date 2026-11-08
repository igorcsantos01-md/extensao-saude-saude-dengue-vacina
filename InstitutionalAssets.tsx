import React from 'react';
import {
  LOGO_EMS_DATA_URL,
  LOGO_CMDA_DATA_URL,
  SIG_BARBARA_DATA_URL,
  SIG_JAMES_DATA_URL,
} from '../data/certificateAssets';

/**
 * 1. Logotipo "Editora Mente e Saúde" — Embutido em Base64 de alta resolução (100% compatível com GitHub/Vercel)
 */
export const LogoEditoraMenteSaude: React.FC<{ className?: string }> = ({
  className = 'w-14 h-14',
}) => (
  <img
    src={LOGO_EMS_DATA_URL}
    alt="Logotipo Editora Mente e Saúde"
    className={`object-contain select-none ${className}`}
    draggable={false}
  />
);

/**
 * 2. Logotipo "Centro Profissionalizante Maria Dalva de Araújo" — Embutido em Base64 de alta resolução
 */
export const LogoCentroMariaDalva: React.FC<{ className?: string }> = ({
  className = 'w-14 h-14',
}) => (
  <img
    src={LOGO_CMDA_DATA_URL}
    alt="Logotipo Centro Profissionalizante Maria Dalva de Araújo"
    className={`object-contain select-none ${className}`}
    draggable={false}
  />
);

/**
 * 3. Assinatura 1 — Bárbara Lima dos Santos — Embutida em Base64 em fundo transparente
 */
export const SignatureBarbaraSvg: React.FC<{ className?: string }> = ({
  className = 'w-44 h-11',
}) => (
  <img
    src={SIG_BARBARA_DATA_URL}
    alt="Assinatura de Bárbara Lima dos Santos"
    className={`object-contain select-none ${className}`}
    draggable={false}
  />
);

/**
 * 4. Assinatura 2 — James Araújo de Santana — Embutida em Base64 em fundo transparente
 */
export const SignatureJamesSvg: React.FC<{ className?: string }> = ({
  className = 'w-44 h-11',
}) => (
  <img
    src={SIG_JAMES_DATA_URL}
    alt="Assinatura de James Araújo de Santana"
    className={`object-contain select-none ${className}`}
    draggable={false}
  />
);

/**
 * 5. Selo Oficial de Fé Pública (Vetorial SVG)
 */
export const SeloFePublicaSvg: React.FC<{
  code: string;
  className?: string;
}> = ({ code, className = 'w-20 h-20' }) => (
  <svg
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Selo Oficial de Fé Pública"
  >
    <circle
      cx="60"
      cy="60"
      r="55"
      fill="#FEF3C7"
      stroke="#D97706"
      strokeWidth="2.4"
    />
    <circle
      cx="60"
      cy="60"
      r="47"
      fill="none"
      stroke="#064E3B"
      strokeWidth="1.1"
    />

    <text
      x="60"
      y="44"
      textAnchor="middle"
      fill="#064E3B"
      fontSize="9.5"
      fontWeight="700"
      fontFamily="Times New Roman, Georgia, serif"
    >
      SELO OFICIAL
    </text>
    <text
      x="60"
      y="63"
      textAnchor="middle"
      fill="#D97706"
      fontSize="11.5"
      fontWeight="700"
      fontFamily="Times New Roman, Georgia, serif"
    >
      FÉ PÚBLICA
    </text>

    <text
      x="60"
      y="81"
      textAnchor="middle"
      fill="#0A1D56"
      fontSize="7.4"
      fontWeight="700"
      fontFamily="Courier New, JetBrains Mono, monospace"
    >
      {code}
    </text>
  </svg>
);
