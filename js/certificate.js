function getOperativeProfile() {
  const nameEl = document.querySelector('#hud-player-name, .player-name-display');
  const rankEl = document.querySelector('#hud-rank, .rank-pill');
  const levelEl = document.querySelector('#hud-level, .lvl-tag');

  return {
    name: (nameEl?.textContent || 'OPERATIVE ANDAR').trim().toUpperCase(),
    rank: (rankEl?.textContent || 'SOC ANALYST').trim().toUpperCase(),
    level: (levelEl?.textContent || 'LVL 1').trim().toUpperCase()
  };
}

function createVerificationCode(name, certTitle) {
  const raw = `${name}::${certTitle}::CDA-SEC-OS`;
  let hash = 2166136261;
  for (let i = 0; i < raw.length; i++) {
    hash ^= raw.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return `CDA-${(hash >>> 0).toString(16).toUpperCase().padStart(8, '0')}`;
}

function drawSeal(ctx, cx, cy, r) {
  ctx.save();
  ctx.strokeStyle = '#00ff88';
  ctx.lineWidth = 3;
  ctx.setLineDash([8, 6]);
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.strokeStyle = '#00f0ff';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(cx, cy - r * 0.58);
  ctx.lineTo(cx + r * 0.48, cy - r * 0.36);
  ctx.quadraticCurveTo(cx + r * 0.5, cy + r * 0.16, cx, cy + r * 0.62);
  ctx.quadraticCurveTo(cx - r * 0.5, cy + r * 0.16, cx - r * 0.48, cy - r * 0.36);
  ctx.closePath();
  ctx.fillStyle = 'rgba(0, 240, 255, 0.12)';
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#00ff88';
  ctx.font = '700 13px ui-monospace, Menlo, monospace';
  ctx.textAlign = 'center';
  ctx.fillText('VERIFIED', cx, cy + r + 22);
  ctx.restore();
}

export function generateCertificatePNG(certTitle) {
  const profile = getOperativeProfile();
  const verifyId = createVerificationCode(profile.name, certTitle);
  const dateStr = new Date().toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const canvas = document.createElement('canvas');
  canvas.width = 1400;
  canvas.height = 990;
  const ctx = canvas.getContext('2d');

  // Background
  const bgGrad = ctx.createRadialGradient(700, 495, 80, 700, 495, 860);
  bgGrad.addColorStop(0, '#0f203d');
  bgGrad.addColorStop(1, '#050a14');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1400, 990);

  // Subtle Cyber Grid
  ctx.strokeStyle = 'rgba(0, 240, 255, 0.05)';
  ctx.lineWidth = 1;
  for (let x = 0; x <= 1400; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 990);
    ctx.stroke();
  }
  for (let y = 0; y <= 990; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1400, y);
    ctx.stroke();
  }

  // Double Border Frame
  ctx.strokeStyle = '#00f0ff';
  ctx.lineWidth = 4;
  ctx.strokeRect(36, 36, 1328, 918);

  ctx.strokeStyle = 'rgba(0, 255, 136, 0.45)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(52, 52, 1296, 886);

  // Header
  ctx.textAlign = 'center';
  ctx.fillStyle = '#00f0ff';
  ctx.font = '700 22px ui-monospace, Menlo, monospace';
  ctx.fillText('CYBER DEFENDER ACADEMY // CDA SEC-OS', 700, 135);

  ctx.fillStyle = '#9eb3d1';
  ctx.font = '600 18px ui-monospace, Menlo, monospace';
  ctx.fillText('CERTIFICATE OF DEFENSIVE CYBERSECURITY COMPETENCY', 700, 175);

  // Recipient
  ctx.fillStyle = '#a6b8d4';
  ctx.font = '400 24px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';
  ctx.fillText('Diberikan kepada Operatif Keamanan Siber:', 700, 265);

  ctx.fillStyle = '#ffffff';
  ctx.font = '800 58px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';
  ctx.fillText(profile.name, 700, 345);

  // Divider
  ctx.strokeStyle = 'rgba(0, 240, 255, 0.5)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(340, 375);
  ctx.lineTo(1060, 375);
  ctx.stroke();

  // Certification Milestone
  ctx.fillStyle = '#a6b8d4';
  ctx.font = '400 23px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';
  ctx.fillText('Telah menyelesaikan kualifikasi simulasi SOC & jalur sertifikasi:', 700, 440);

  ctx.fillStyle = '#00ff88';
  ctx.font = '800 42px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';
  ctx.fillText(certTitle, 700, 510);

  // Standards Pill
  ctx.fillStyle = '#00f0ff';
  ctx.font = '700 18px ui-monospace, Menlo, monospace';
  ctx.fillText(
    `RANK: ${profile.rank}  •  ${profile.level}  •  NIST CSF / SP 800-61 / CIS / MITRE ATT&CK`,
    700,
    575
  );

  // Footer Metadata & Seal
  drawSeal(ctx, 700, 745, 62);

  ctx.textAlign = 'left';
  ctx.fillStyle = '#9eb3d1';
  ctx.font = '600 17px ui-monospace, Menlo, monospace';
  ctx.fillText(`TANGGAL TERBIT : ${dateStr}`, 110, 825);
  ctx.fillText(`CREDENTIAL ID  : ${verifyId}`, 110, 860);

  ctx.textAlign = 'right';
  ctx.fillText('ISSUER  : CDA // SEC-OS ENGINE', 1290, 825);
  ctx.fillText('PORTAL  : andarmax.github.io/cyber-defender-academy', 1290, 860);

  // Trigger Download
  const slug = certTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const link = document.createElement('a');
  link.download = `CDA-Certificate-${slug || 'achievement'}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

function attachCertificateButtons() {
  document.querySelectorAll('.cert-node.earned').forEach((card) => {
    if (card.querySelector('.cert-dl-btn')) return;
    const titleEl = card.querySelector('strong, h4, h3, .cert-title');
    const certTitle = (titleEl?.textContent || card.textContent.split('\n')[0] || 'Cyber Defender Certification').trim();

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-sm btn-outline cert-dl-btn';
    btn.style.marginTop = '0.55rem';
    btn.style.width = '100%';
    btn.textContent = '⬇ Unduh Sertifikat PNG';
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      generateCertificatePNG(certTitle);
    });
    card.appendChild(btn);
  });
}

window.addEventListener('DOMContentLoaded', () => {
  attachCertificateButtons();
  const observer = new MutationObserver(() => attachCertificateButtons());
  observer.observe(document.body, { childList: true, subtree: true });
});
