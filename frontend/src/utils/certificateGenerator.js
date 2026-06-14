/**
 * Generates and downloads a beautifully designed SVG Certificate of Appreciation
 * for blood donors.
 */
export const downloadCertificate = ({ donorName, donationDate, bloodGroup, hospital, city, units = 1 }) => {
  const formattedDate = new Date(donationDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const svgContent = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%" style="margin: 0 auto; display: block; max-height: 100vh; background-color: #323639;">
  <defs>
    <!-- Background Gradient -->
    <linearGradient id="bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fdfbf7" />
      <stop offset="100%" stop-color="#f5efe0" />
    </linearGradient>
    
    <!-- Gold Border Gradient -->
    <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#b89742" />
      <stop offset="50%" stop-color="#e9d39b" />
      <stop offset="100%" stop-color="#b89742" />
    </linearGradient>

    <!-- Crimson Gradient -->
    <linearGradient id="crimson-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#991b1b" />
      <stop offset="100%" stop-color="#7f1d1d" />
    </linearGradient>

    <!-- Drop Shadow Filter -->
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#000000" flood-opacity="0.15" />
    </filter>
  </defs>

  <!-- Background Layer -->
  <rect width="800" height="600" fill="url(#bg-grad)" />

  <!-- Elegant Outer Border -->
  <rect x="25" y="25" width="750" height="550" fill="none" stroke="url(#gold-grad)" stroke-width="6" rx="4" />
  <rect x="35" y="35" width="730" height="530" fill="none" stroke="#b89742" stroke-width="1.5" rx="2" opacity="0.6" />
  <rect x="42" y="42" width="716" height="516" fill="none" stroke="url(#gold-grad)" stroke-width="1" rx="2" />

  <!-- Corner Cornerpiece Ornaments -->
  <!-- Top Left -->
  <path d="M 25,65 L 65,25 M 25,75 L 75,25 M 25,45 L 45,25" stroke="#b89742" stroke-width="1.5" opacity="0.8" />
  <!-- Top Right -->
  <path d="M 775,65 L 735,25 M 775,75 L 725,25 M 775,45 L 755,25" stroke="#b89742" stroke-width="1.5" opacity="0.8" />
  <!-- Bottom Left -->
  <path d="M 25,535 L 65,575 M 25,525 L 75,575 M 25,555 L 45,575" stroke="#b89742" stroke-width="1.5" opacity="0.8" />
  <!-- Bottom Right -->
  <path d="M 775,535 L 735,575 M 775,525 L 725,575 M 775,555 L 755,575" stroke="#b89742" stroke-width="1.5" opacity="0.8" />

  <!-- Header Branding -->
  <g transform="translate(400, 95)">
    <!-- Red heart-shaped logo placeholder -->
    <path d="M 0,-22 C -5,-27 -15,-27 -20,-22 C -25,-17 -25,-7 -20,-2 L 0,15 L 20,-2 C 25,-7 25,-17 20,-22 C 15,-27 5,-27 0,-22 Z" fill="#991b1b" />
    <text y="35" font-family="'Georgia', serif" font-size="16" fill="#7f1d1d" font-weight="bold" text-anchor="middle" letter-spacing="3">RAKTDAAN FOUNDATION</text>
    <text y="52" font-family="'Georgia', serif" font-size="10" fill="#b89742" font-style="italic" text-anchor="middle" letter-spacing="1">Saving Lives, One Drop at a Time</text>
  </g>

  <!-- Divider Line -->
  <line x1="320" y1="170" x2="480" y2="170" stroke="url(#gold-grad)" stroke-width="1.5" />

  <!-- Main Certificate Title -->
  <text x="400" y="225" font-family="'Georgia', serif" font-size="34" fill="url(#crimson-grad)" font-weight="bold" text-anchor="middle" letter-spacing="1">CERTIFICATE OF APPRECIATION</text>
  
  <text x="400" y="265" font-family="'Georgia', serif" font-size="14" fill="#64748b" font-style="italic" text-anchor="middle">This certificate is proudly and gratefully presented to</text>

  <!-- Recipient Name -->
  <text x="400" y="325" font-family="'Georgia', serif" font-size="32" fill="#1e293b" font-weight="bold" text-anchor="middle">${donorName}</text>
  <!-- Decorative underline for name -->
  <path d="M 220,338 L 580,338 M 380,342 L 420,342" stroke="#b89742" stroke-width="1" />

  <!-- Description Text -->
  <text x="400" y="380" font-family="'Georgia', serif" font-size="15" fill="#475569" text-anchor="middle">In noble recognition of their selfless act of blood donation,</text>
  
  <!-- Donation Details Highlight -->
  <g transform="translate(400, 420)">
    <rect x="-200" y="-18" width="400" height="36" fill="#ffffff" stroke="#e2e8f0" stroke-width="1" rx="18" filter="url(#shadow)" />
    <text y="5" font-family="'Georgia', serif" font-size="15" fill="#1e293b" font-weight="bold" text-anchor="middle">
      ${units} Unit(s) of ${bloodGroup} Blood at ${hospital}
    </text>
  </g>

  <text x="400" y="465" font-family="'Georgia', serif" font-size="14" fill="#475569" text-anchor="middle">
    City: ${city} &#160;|&#160; Date of Donation: ${formattedDate}
  </text>

  <!-- Appreciation Quote -->
  <text x="400" y="500" font-family="'Georgia', serif" font-size="11.5" fill="#64748b" font-style="italic" text-anchor="middle">
    "Your kindness, courage, and compassion have gifted another life a new tomorrow."
  </text>

  <!-- Footer Signatures -->
  <!-- Left Signature (Medical Officer) -->
  <g transform="translate(180, 525)">
    <!-- Styled Signature Text -->
    <text y="-5" font-family="'Brush Script MT', 'Lucida Handwriting', cursive" font-size="22" fill="#2563eb" text-anchor="middle">Ram Kapoor</text>
    <line x1="-50" y1="0" x2="50" y2="0" stroke="#cbd5e1" stroke-width="1" />
    <text y="15" font-family="'Georgia', serif" font-size="10.5" fill="#475569" text-anchor="middle">Medical Officer</text>
  </g>

  <!-- Center Gold Seal -->
  <g transform="translate(400, 525)" filter="url(#shadow)">
    <circle r="26" fill="url(#gold-grad)" stroke="#b89742" stroke-width="1" />
    <!-- Seal Ridges -->
    <circle r="22" fill="none" stroke="#ffffff" stroke-width="1" stroke-dasharray="3,2" />
    <!-- Star in Center -->
    <path d="M 0,-10 L 3,-3 L 10,-3 L 5,2 L 7,9 L 0,5 L -7,9 L -5,2 L -10,-3 L -3,-3 Z" fill="#ffffff" />
  </g>

  <!-- Right Signature (Director) -->
  <g transform="translate(620, 525)">
    <!-- Styled Signature Text -->
    <text y="-5" font-family="'Brush Script MT', 'Lucida Handwriting', cursive" font-size="22" fill="#2563eb" text-anchor="middle">Vishal Kumar</text>
    <line x1="-50" y1="0" x2="50" y2="0" stroke="#cbd5e1" stroke-width="1" />
    <text y="15" font-family="'Georgia', serif" font-size="10.5" fill="#475569" text-anchor="middle">RaktDaan Director</text>
  </g>
</svg>
  `.trim();

  // Create Blob and trigger download
  const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `RaktDaan_Certificate_${donorName.replace(/\s+/g, '_')}.svg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
