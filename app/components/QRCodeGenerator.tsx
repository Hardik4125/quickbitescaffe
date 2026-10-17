'use client';

import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { useMenu } from '../context/MenuContext';
import { Download, Printer, ExternalLink, Copy, Check, Sparkles, UtensilsCrossed, Wifi, RefreshCw } from 'lucide-react';

interface QRCodeGeneratorProps {
  initialTable?: string;
}

const COLOR_THEMES = [
  { name: 'Onyx Dark', dark: '#18181b', light: '#ffffff', border: 'border-zinc-800' },
  { name: 'Warm Amber', dark: '#b45309', light: '#fffbeb', border: 'border-amber-600' },
  { name: 'Emerald Herb', dark: '#047857', light: '#ecfdf5', border: 'border-emerald-600' },
  { name: 'Royal Indigo', dark: '#3730a3', light: '#eef2ff', border: 'border-indigo-600' },
  { name: 'Crimson Bistro', dark: '#b91c1c', light: '#fef2f2', border: 'border-rose-600' },
];

export const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ initialTable = '1' }) => {
  const { restaurantConfig, currentTable, setCurrentTable } = useMenu();
  const [selectedTable, setSelectedTable] = useState<string>(initialTable || currentTable);
  const [selectedTheme, setSelectedTheme] = useState(COLOR_THEMES[0]);
  const [customBaseUrl, setCustomBaseUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Set default baseUrl from window.location.origin
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCustomBaseUrl(window.location.origin);
    }
  }, []);

  const menuUrl = `${customBaseUrl || 'http://localhost:3000'}/menu?table=${encodeURIComponent(selectedTable)}`;

  // Generate QR Canvas with high resolution and crisp error correction
  useEffect(() => {
    if (!canvasRef.current || !menuUrl) return;

    setIsGenerating(true);
    QRCode.toCanvas(
      canvasRef.current,
      menuUrl,
      {
        width: 320,
        margin: 2,
        errorCorrectionLevel: 'H',
        color: {
          dark: selectedTheme.dark,
          light: selectedTheme.light,
        },
      },
      (error) => {
        setIsGenerating(false);
        if (error) {
          console.error('QR code generation error:', error);
        }
      }
    );
  }, [menuUrl, selectedTheme]);

  const handleTableChange = (tbl: string) => {
    setSelectedTable(tbl);
    setCurrentTable(tbl);
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `${restaurantConfig.name.replace(/\s+/g, '_')}_Table_${selectedTable}_QR.png`;
    a.click();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(menuUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow || !canvasRef.current) return;

    const qrDataUrl = canvasRef.current.toDataURL('image/png');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${restaurantConfig.name} - Table ${selectedTable} QR Stand</title>
          <style>
            @page { size: auto; margin: 15mm; }
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              margin: 0;
              padding: 20px;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              background-color: #f8fafc;
            }
            .tent-card {
              width: 360px;
              background: white;
              border: 2px dashed #cbd5e1;
              border-radius: 20px;
              padding: 32px 24px;
              text-align: center;
              box-shadow: 0 10px 25px rgba(0,0,0,0.05);
            }
            .restaurant-name {
              font-size: 24px;
              font-weight: 800;
              color: #0f172a;
              margin: 0 0 4px 0;
              letter-spacing: -0.5px;
            }
            .tagline {
              font-size: 12px;
              color: #64748b;
              margin: 0 0 20px 0;
            }
            .table-badge {
              display: inline-block;
              background: ${selectedTheme.dark};
              color: white;
              padding: 6px 16px;
              border-radius: 9999px;
              font-size: 14px;
              font-weight: 700;
              margin-bottom: 20px;
              letter-spacing: 0.5px;
            }
            .qr-wrapper {
              background: ${selectedTheme.light};
              padding: 16px;
              border-radius: 16px;
              display: inline-block;
              border: 1px solid #e2e8f0;
            }
            .qr-img {
              width: 220px;
              height: 220px;
              display: block;
            }
            .instruction {
              font-size: 15px;
              font-weight: 700;
              color: #1e293b;
              margin-top: 18px;
              margin-bottom: 6px;
            }
            .sub-instruction {
              font-size: 12px;
              color: #64748b;
              margin: 0 0 16px 0;
            }
            .wifi-box {
              background: #f1f5f9;
              border-radius: 12px;
              padding: 10px;
              font-size: 11px;
              color: #334155;
            }
            .wifi-box strong {
              color: #0f172a;
            }
            .fold-line {
              margin-top: 24px;
              border-top: 1px dashed #94a3b8;
              padding-top: 8px;
              font-size: 10px;
              color: #94a3b8;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
          </style>
        </head>
        <body>
          <div class="tent-card">
            <h1 class="restaurant-name">${restaurantConfig.name}</h1>
            <p class="tagline">${restaurantConfig.tagline}</p>
            <div class="table-badge">TABLE ${selectedTable}</div>
            <div class="qr-wrapper">
              <img class="qr-img" src="${qrDataUrl}" alt="Table QR Code" />
            </div>
            <p class="instruction">📷 Scan to View Dynamic Menu</p>
            <p class="sub-instruction">Point camera at QR code • No app needed • Order instantly</p>
            <div class="wifi-box">
              📶 Free Wi-Fi: <strong>${restaurantConfig.wifiName}</strong> | Pass: <strong>${restaurantConfig.wifiPassword}</strong>
            </div>
            <div class="fold-line">Fold here for tabletop acrylic stand</div>
          </div>
          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-zinc-100">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left: Interactive Controls */}
        <div className="flex-1 space-y-6 w-full">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Dynamic QR & Table Stand Generator
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
              Instant Menu QR Studio
            </h2>
            <p className="text-sm text-zinc-500 mt-1">
              Generate customizable, print-ready QR codes for each table. When scanned, customers see your live virtual menu.
            </p>
          </div>

          {/* Table Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-2">
              Select Table Number / Area
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {Array.from({ length: Math.min(restaurantConfig.tablesCount || 12, 12) }, (_, i) => String(i + 1)).map(
                (tbl) => (
                  <button
                    key={tbl}
                    type="button"
                    onClick={() => handleTableChange(tbl)}
                    className={`py-2 px-3 rounded-xl font-bold text-sm transition-all ${
                      selectedTable === tbl
                        ? 'bg-zinc-900 text-white shadow-md shadow-zinc-900/20 scale-105'
                        : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                    }`}
                  >
                    T-{tbl}
                  </button>
                )
              )}
            </div>

            {/* Custom Table Input */}
            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs text-zinc-500">Or custom table/seat:</span>
              <input
                type="text"
                value={selectedTable}
                onChange={(e) => handleTableChange(e.target.value)}
                placeholder="e.g. Patio-2, VIP-1"
                className="text-xs px-3 py-1.5 rounded-lg border border-zinc-200 bg-zinc-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 w-36"
              />
            </div>
          </div>

          {/* Color Palette Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-2">
              QR Code Palette
            </label>
            <div className="flex flex-wrap gap-2.5">
              {COLOR_THEMES.map((theme) => (
                <button
                  key={theme.name}
                  type="button"
                  onClick={() => setSelectedTheme(theme)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                    selectedTheme.name === theme.name
                      ? 'border-zinc-900 ring-2 ring-zinc-900/20 bg-zinc-50 font-bold'
                      : 'border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full shadow-inner"
                    style={{ backgroundColor: theme.dark }}
                  />
                  {theme.name}
                </button>
              ))}
            </div>
          </div>

          {/* Target URL Display & Customizer */}
          <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Dynamic Destination URL
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-700 hover:text-zinc-900 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className="font-mono text-xs text-zinc-800 break-all bg-white p-2.5 rounded-xl border border-zinc-200">
              {menuUrl}
            </div>
            <p className="text-[11px] text-zinc-400">
              💡 Tip: In production, this can point to your live domain (e.g. https://yourmenu.com). Table #{selectedTable} is passed automatically.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              onClick={handleDownload}
              className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-sm px-5 py-3 rounded-2xl shadow-lg shadow-zinc-900/10 transition-transform active:scale-95"
            >
              <Download className="w-4 h-4" />
              Download PNG
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-sm px-5 py-3 rounded-2xl shadow-lg shadow-amber-500/20 transition-transform active:scale-95"
            >
              <Printer className="w-4 h-4" />
              Print Table Tent
            </button>

            <a
              href={`/menu?table=${encodeURIComponent(selectedTable)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-semibold text-sm px-4 py-3 rounded-2xl transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Open Customer Menu
            </a>
          </div>
        </div>

        {/* Right: Realistic Table Stand Card Mockup */}
        <div className="w-full lg:w-[340px] flex flex-col items-center">
          <div className="w-full bg-gradient-to-b from-zinc-50 to-white rounded-3xl p-6 border-2 border-zinc-200 shadow-2xl relative overflow-hidden text-center">
            {/* Top decorative badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 text-white text-[11px] font-bold uppercase tracking-wider mb-3">
              <UtensilsCrossed className="w-3 h-3 text-amber-400" />
              Table #{selectedTable}
            </div>

            <h3 className="font-extrabold text-zinc-900 text-xl tracking-tight leading-snug">
              {restaurantConfig.name}
            </h3>
            <p className="text-zinc-500 text-xs mt-0.5 line-clamp-1">
              {restaurantConfig.tagline}
            </p>

            {/* QR Canvas Box */}
            <div className="my-5 p-3 rounded-2xl bg-white shadow-inner border border-zinc-100 inline-block relative group">
              <canvas
                ref={canvasRef}
                className="rounded-xl w-[220px] h-[220px] block transition-transform group-hover:scale-105 duration-200"
              />
              {isGenerating && (
                <div className="absolute inset-0 bg-white/70 backdrop-blur-xs flex items-center justify-center rounded-xl">
                  <RefreshCw className="w-6 h-6 animate-spin text-zinc-600" />
                </div>
              )}
            </div>

            <div className="space-y-1">
              <div className="font-bold text-zinc-900 text-sm flex items-center justify-center gap-1">
                <span>📱 Scan with Phone Camera</span>
              </div>
              <p className="text-[11px] text-zinc-500">
                Instantly view live menu, order food, and request service directly from your phone.
              </p>
            </div>

            {/* Wi-Fi footer badge */}
            <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-center gap-2 text-[11px] text-zinc-600 font-medium">
              <Wifi className="w-3.5 h-3.5 text-emerald-600" />
              <span>Wi-Fi: <strong>{restaurantConfig.wifiName}</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
