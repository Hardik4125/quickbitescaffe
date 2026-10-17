'use client';

import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import Link from 'next/link';
import { Download, ExternalLink, QrCode, Star, MapPin, Phone } from 'lucide-react';
import { initialRestaurantConfig } from './data/initialMenu';

export default function HomePage() {
  const [menuUrl, setMenuUrl] = useState('http://localhost:3000/menu');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/menu`;
      setMenuUrl(url);
    }
  }, []);

  useEffect(() => {
    if (!canvasRef.current || !menuUrl) return;

    const canvas = canvasRef.current;
    QRCode.toCanvas(
      canvas,
      menuUrl,
      {
        width: 320,
        margin: 2,
        errorCorrectionLevel: 'H',
        color: {
          dark: '#18181b',
          light: '#ffffff',
        },
      },
      (error) => {
        if (error) {
          console.error(error);
          return;
        }

        // Draw Quick Bites Logo in center of QR Code
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const img = new Image();
        img.src = '/logo/001.jpg.jpeg';
        img.onload = () => {
          const center = canvas.width / 2;
          const logoSize = 64;
          const radius = logoSize / 2;

          // Draw white circular background badge
          ctx.save();
          ctx.beginPath();
          ctx.arc(center, center, radius + 4, 0, Math.PI * 2, true);
          ctx.fillStyle = '#ffffff';
          ctx.fill();
          ctx.lineWidth = 3;
          ctx.strokeStyle = '#f59e0b'; // Amber border
          ctx.stroke();

          // Clip to circle and draw logo
          ctx.beginPath();
          ctx.arc(center, center, radius, 0, Math.PI * 2, true);
          ctx.closePath();
          ctx.clip();
          ctx.drawImage(img, center - radius, center - radius, logoSize, logoSize);
          ctx.restore();
        };
      }
    );
  }, [menuUrl]);

  const handleDownloadQR = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.href = canvasRef.current.toDataURL('image/png');
    link.download = 'quick_bites_cafe_menu_qr.png';
    link.click();
  };

  return (
    <div className="min-h-screen text-white flex flex-col items-center justify-center p-4 sm:p-6 font-sans relative bg-doodle">
      <div className="w-full max-w-md doodle-card border border-amber-500/25 rounded-3xl p-6 sm:p-8 text-center shadow-2xl space-y-6">
        {/* Quick Bites Logo & Header */}
        <div className="space-y-3">
          <div className="relative inline-block">
            <img
              src="/logo/001.jpg.jpeg"
              alt="Quick Bites Cafe Logo"
              className="w-20 h-20 rounded-full border-2 border-amber-500 shadow-xl object-contain bg-black mx-auto p-0.5"
            />
            <span className="absolute bottom-0 right-0 w-5 h-5 bg-emerald-500 border-2 border-zinc-900 rounded-full" title="Open Now" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold mb-1">
              <QrCode className="w-3.5 h-3.5" />
              Digital Menu QR Code
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {initialRestaurantConfig.name}
            </h1>
            <p className="text-xs text-amber-400 font-medium">
              क्विक बाइट्स • Palghar
            </p>
          </div>

          {/* Google Business Rating & Info */}
          <div className="flex items-center justify-center gap-3 text-xs text-zinc-400 pt-1">
            <span className="inline-flex items-center gap-1 font-bold text-zinc-200">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              4.9 (156 reviews)
            </span>
            <span>•</span>
            <span className="text-zinc-300">₹200–400 per person</span>
          </div>
        </div>

        {/* QR Code Container with Centered Logo */}
        <div className="bg-white p-3.5 rounded-2xl inline-block shadow-xl mx-auto border-4 border-amber-500/20">
          <canvas
            ref={canvasRef}
            className="block w-[240px] h-[240px] sm:w-[270px] sm:h-[270px] rounded-lg"
          />
        </div>

        {/* Instructions */}
        <div className="space-y-1">
          <p className="text-sm font-bold text-zinc-100 flex items-center justify-center gap-1.5">
            <span>📷 Scan with your phone camera</span>
          </p>
          <p className="text-xs text-zinc-400">
            Diners scan this QR code to view the live digital menu card instantly on their phone.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          <button
            type="button"
            onClick={handleDownloadQR}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs py-3 px-4 rounded-xl shadow-lg shadow-amber-500/10 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download QR Code
          </button>

          <Link
            href="/menu"
            className="flex-1 inline-flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs py-3 px-4 rounded-xl transition-colors border border-zinc-700"
          >
            <ExternalLink className="w-4 h-4" />
            Open Menu Directly
          </Link>
        </div>

        {/* Address and Contact Footer */}
        <div className="pt-3 border-t border-zinc-800/80 text-[11px] text-zinc-500 space-y-1">
          <p className="flex items-center justify-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <span className="truncate">{initialRestaurantConfig.address}</span>
          </p>
          <p className="flex items-center justify-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-zinc-400" />
            <span>{initialRestaurantConfig.phone} • Closes 10:30 PM</span>
          </p>
        </div>
      </div>
    </div>
  );
}
