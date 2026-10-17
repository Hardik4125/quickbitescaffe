'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import jsQR from 'jsqr';
import { Camera, Upload, X, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanResult?: (data: string) => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({ isOpen, onClose, onScanResult }) => {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const [activeTab, setActiveTab] = useState<'camera' | 'upload'>('camera');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Stop camera stream safely
  const stopCamera = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  // Scan video frames using jsQR
  const scanFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || videoRef.current.readyState !== videoRef.current.HAVE_ENOUGH_DATA) {
      animationFrameRef.current = requestAnimationFrame(scanFrame);
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    if (ctx) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert',
      });

      if (code && code.data) {
        setScanResult(code.data);
        if (onScanResult) onScanResult(code.data);
        stopCamera();
        return;
      }
    }

    animationFrameRef.current = requestAnimationFrame(scanFrame);
  }, [onScanResult, stopCamera]);

  // Start camera stream
  const startCamera = useCallback(async () => {
    stopCamera();
    setCameraError(null);
    setScanResult(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
      });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
        animationFrameRef.current = requestAnimationFrame(scanFrame);
      }
    } catch (err: unknown) {
      console.warn('Camera access issue:', err);
      const message = err instanceof Error ? err.message : 'Camera permission was denied or not supported on this browser/device.';
      setCameraError(message);
    }
  }, [scanFrame, stopCamera]);

  useEffect(() => {
    if (isOpen && activeTab === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, activeTab, startCamera, stopCamera]);

  // Handle uploaded image file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setCameraError(null);
    setScanResult(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setIsProcessing(false);
          return;
        }

        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        setIsProcessing(false);
        if (code && code.data) {
          setScanResult(code.data);
          if (onScanResult) onScanResult(code.data);
        } else {
          setCameraError('No QR code detected in this image. Please try a clearer picture.');
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Navigate to decoded menu
  const handleGoToMenu = () => {
    if (!scanResult) return;
    onClose();

    try {
      if (scanResult.startsWith('http://') || scanResult.startsWith('https://')) {
        const url = new URL(scanResult);
        if (url.pathname.includes('/menu')) {
          router.push(`${url.pathname}${url.search}`);
          return;
        }
        window.location.href = scanResult;
      } else if (scanResult.includes('/menu')) {
        router.push(scanResult);
      } else {
        router.push(`/menu?table=1`);
      }
    } catch {
      router.push(`/menu?table=1`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-zinc-100 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-50 rounded-xl text-amber-600">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-zinc-900 text-lg">Scan Table QR</h3>
              <p className="text-xs text-zinc-500">Scan to open the dynamic virtual menu</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-zinc-100 text-zinc-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-2 bg-zinc-100/80 m-4 rounded-2xl gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('camera')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'camera'
                ? 'bg-white text-zinc-900 shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Live Camera
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'upload'
                ? 'bg-white text-zinc-900 shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Upload QR Image
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 pt-0 flex-1 flex flex-col items-center justify-center">
          {activeTab === 'camera' ? (
            <div className="relative w-full aspect-square max-w-[280px] bg-black rounded-3xl overflow-hidden shadow-inner flex items-center justify-center border-4 border-zinc-900">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                muted
                playsInline
              />
              <canvas ref={canvasRef} className="hidden" />

              {/* Scanning Target Box with Glowing Corners */}
              {!cameraError && !scanResult && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-48 h-48 border-2 border-amber-400/80 rounded-2xl relative animate-pulse">
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-amber-500 -mt-1 -ml-1 rounded-tl-sm" />
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-amber-500 -mt-1 -mr-1 rounded-tr-sm" />
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-amber-500 -mb-1 -ml-1 rounded-bl-sm" />
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-amber-500 -mb-1 -mr-1 rounded-br-sm" />
                    {/* Animated scan bar */}
                    <div className="h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent w-full absolute animate-[bounce_2s_infinite]" />
                  </div>
                </div>
              )}

              {cameraError && (
                <div className="absolute inset-0 bg-zinc-900/90 text-white p-6 flex flex-col items-center justify-center text-center">
                  <AlertCircle className="w-10 h-10 text-amber-400 mb-2" />
                  <p className="text-xs font-semibold text-zinc-300 mb-4">{cameraError}</p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('upload')}
                    className="text-xs bg-white text-zinc-950 font-bold px-4 py-2 rounded-xl"
                  >
                    Switch to Image Upload
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full">
              <label className="flex flex-col items-center justify-center w-full aspect-square max-w-[280px] mx-auto border-2 border-dashed border-zinc-300 rounded-3xl cursor-pointer hover:border-amber-500 hover:bg-amber-50/20 transition-all p-6 text-center">
                <Upload className="w-10 h-10 text-amber-600 mb-3" />
                <span className="text-sm font-bold text-zinc-800">Choose QR code screenshot</span>
                <span className="text-xs text-zinc-500 mt-1">PNG, JPG, or WEBP</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              {isProcessing && (
                <p className="text-xs text-center text-zinc-500 mt-3 animate-pulse">
                  Analyzing image for QR code...
                </p>
              )}
            </div>
          )}

          {/* Scanned Result Banner */}
          {scanResult && (
            <div className="mt-5 w-full bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-left animate-in slide-in-from-bottom-2 duration-200">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                QR Code Successfully Scanned!
              </div>
              <div className="text-xs font-mono text-emerald-950 break-all bg-white/70 p-2 rounded-lg border border-emerald-100">
                {scanResult}
              </div>
              <button
                type="button"
                onClick={handleGoToMenu}
                className="mt-3 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-transform active:scale-95"
              >
                <span>Open Virtual Menu</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
