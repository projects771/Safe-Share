/**
 * Generates a purely fictional sample document image in memory for testing Safe Share.
 * Contains 100% fictional test data.
 */
export function generateFictionalSampleDoc(): string {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 760;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Background - Neutral Card Tone
  ctx.fillStyle = '#1A1D20';
  ctx.fillRect(0, 0, 1200, 760);

  // Card border
  ctx.lineWidth = 6;
  ctx.strokeStyle = '#333A40';
  ctx.strokeRect(30, 30, 1140, 700);

  // Header Bar
  ctx.fillStyle = '#111417';
  ctx.fillRect(36, 36, 1128, 120);

  // Card Header Title
  ctx.fillStyle = '#CCFF00';
  ctx.font = 'bold 34px monospace';
  ctx.fillText('GOVERNMENT OF EXEMPLARIA // CITIZEN IDENTITY CARD', 60, 90);
  ctx.fillStyle = '#8E98A0';
  ctx.font = '18px monospace';
  ctx.fillText('OFFICIAL FICTIONAL SAMPLE • FOR PRIVACY REDACTION DEMO ONLY', 60, 125);

  // Avatar Placeholder Photo
  ctx.fillStyle = '#2A3036';
  ctx.fillRect(70, 200, 260, 320);
  ctx.strokeStyle = '#48525A';
  ctx.lineWidth = 4;
  ctx.strokeRect(70, 200, 260, 320);

  // Avatar silhouette
  ctx.fillStyle = '#3E474F';
  ctx.beginPath();
  ctx.arc(200, 310, 50, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(200, 460, 90, Math.PI, 0, false);
  ctx.fill();

  ctx.fillStyle = '#CCFF00';
  ctx.font = 'bold 16px monospace';
  ctx.fillText('DEMO HOLDER', 135, 505);

  // Document Fields with Fictional Information
  const fields = [
    { label: 'FULL LEGAL NAME', val: 'ALEXANDER J. VANCE', y: 220 },
    { label: 'DATE OF BIRTH (DOB)', val: '14 / 08 / 1992', y: 290, sensitive: true },
    { label: 'PERMANENT ACCT NO (PAN)', val: 'ABCDE1234F', y: 360, sensitive: true },
    { label: 'NATIONAL ID (AADHAAR EQUIV)', val: '8910 4421 9081', y: 430, sensitive: true },
    { label: 'CONTACT TELEPHONE', val: '+91 98765 43210', y: 500, sensitive: true },
    { label: 'CONFIDENTIAL EMAIL', val: 'alex.vance.test@exemplar.local', y: 570, sensitive: true },
  ];

  for (const f of fields) {
    ctx.fillStyle = '#8E98A0';
    ctx.font = 'bold 16px monospace';
    ctx.fillText(f.label, 380, f.y);

    ctx.fillStyle = f.sensitive ? '#FFFFFF' : '#E0E0E0';
    ctx.font = 'bold 26px monospace';
    ctx.fillText(f.val, 380, f.y + 32);

    if (f.sensitive) {
      // Subtle sensitive indicator badge
      ctx.fillStyle = 'rgba(204, 255, 0, 0.15)';
      ctx.fillRect(800, f.y + 8, 160, 28);
      ctx.strokeStyle = '#CCFF00';
      ctx.lineWidth = 1;
      ctx.strokeRect(800, f.y + 8, 160, 28);
      ctx.fillStyle = '#CCFF00';
      ctx.font = 'bold 12px monospace';
      ctx.fillText('[SENSITIVE DATA]', 812, f.y + 27);
    }
  }

  // Bottom Notice
  ctx.fillStyle = '#111417';
  ctx.fillRect(36, 640, 1128, 84);
  ctx.fillStyle = '#777777';
  ctx.font = '14px monospace';
  ctx.fillText('NOTICE: This card is computer-generated sample graphics for client-side privacy testing.', 60, 680);
  ctx.fillText('No real personal identifiable information (PII) is depicted.', 60, 704);

  return canvas.toDataURL('image/png');
}
