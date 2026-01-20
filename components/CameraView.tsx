
import React, { useRef, useEffect, useState } from 'react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

interface CameraViewProps {
  onCapture: (base64: string) => void;
  onClose: () => void;
}

const CameraView: React.FC<CameraViewProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isNative, setIsNative] = useState(false);

  useEffect(() => {
    // 检测是否在原生 App 中运行
    const native = Capacitor.isNativePlatform();
    setIsNative(native);

    if (native) {
      // 在原生 App 中，直接显示拍照/上传界面
      console.log('运行在原生 App 中，使用 Capacitor Camera');
      return;
    }

    // Web 端使用 getUserMedia
    const startCamera = async () => {
      try {
        const constraints = {
          video: {
            facingMode: { ideal: 'environment' },
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        };

        const s = await navigator.mediaDevices.getUserMedia(constraints);
        setStream(s);
        if (videoRef.current) {
          videoRef.current.srcObject = s;
        }
      } catch (err: any) {
        console.warn("相机访问失败，尝试备选方案:", err);
        try {
          const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true });
          setStream(fallbackStream);
          if (videoRef.current) {
            videoRef.current.srcObject = fallbackStream;
          }
        } catch (fallbackErr: any) {
          console.error("相机完全无法访问:", fallbackErr);
          setError(fallbackErr.message || "未找到相机设备");
        }
      }
    };
    
    startCamera();
    
    return () => {
      if (stream) {
        stream.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  // 使用 Capacitor Camera 拍照
  const takePhotoNative = async () => {
    try {
      const photo = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera,
      });
      
      if (photo.base64String) {
        onCapture(photo.base64String);
      }
    } catch (err: any) {
      console.error('拍照失败:', err);
      setError(err.message || '拍照失败');
    }
  };

  // 使用 Capacitor Camera 从相册选择
  const pickFromGalleryNative = async () => {
    try {
      const photo = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Photos,
      });
      
      if (photo.base64String) {
        onCapture(photo.base64String);
      }
    } catch (err: any) {
      console.error('选择照片失败:', err);
      if (err.message !== 'User cancelled photos app') {
        setError(err.message || '选择照片失败');
      }
    }
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        onCapture(dataUrl.split(',')[1]);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          onCapture(result.split(',')[1]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // 原生 App 界面
  if (isNative) {
    return (
      <div className="h-full w-full bg-gradient-to-b from-neutral-900 to-black relative overflow-hidden flex flex-col">
        {/* 关闭按钮 */}
        <div className="relative z-10 flex items-center justify-between p-6 pt-12">
          <button onClick={onClose} className="size-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white active:scale-90 transition-transform">
            <span className="material-symbols-outlined text-[28px]">close</span>
          </button>
        </div>

        {/* 主要内容 */}
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center mb-8">
            <span className="material-symbols-outlined text-6xl text-primary">restaurant</span>
          </div>
          
          <h2 className="text-white text-2xl font-bold mb-3">记录您的美食</h2>
          <p className="text-neutral-400 text-center mb-10">拍摄或选择食物照片，AI 将为您分析营养成分</p>

          {error && (
            <div className="mb-6 px-4 py-3 bg-red-500/20 border border-red-500/30 rounded-xl">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* 拍照按钮 */}
          <button 
            onClick={takePhotoNative}
            className="w-full max-w-xs mb-4 py-4 bg-primary text-white font-bold rounded-2xl shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-3"
          >
            <span className="material-symbols-outlined text-[28px]">photo_camera</span>
            拍摄照片
          </button>

          {/* 从相册选择按钮 */}
          <button 
            onClick={pickFromGalleryNative}
            className="w-full max-w-xs py-4 bg-white/10 text-white font-bold rounded-2xl backdrop-blur-md active:scale-95 transition-transform flex items-center justify-center gap-3"
          >
            <span className="material-symbols-outlined text-[28px]">photo_library</span>
            从相册选择
          </button>
        </div>
      </div>
    );
  }

  // Web 端界面
  return (
    <div className="h-full w-full bg-black relative overflow-hidden flex flex-col">
      {stream ? (
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted
          className="absolute inset-0 w-full h-full object-cover" 
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-900 p-8 text-center">
          <span className="material-symbols-outlined text-6xl text-neutral-700 mb-4">no_photography</span>
          <h3 className="text-white font-bold text-lg mb-2">相机不可用</h3>
          <p className="text-neutral-400 text-sm mb-6">
            {error === "Requested device not found" 
              ? "我们无法在此设备上找到相机。您可以手动上传食物照片进行分析。" 
              : "请确保已授予相机权限，或者手动上传照片。"}
          </p>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-lg active:scale-95 transition-transform flex items-center gap-2"
          >
            <span className="material-symbols-outlined">upload_file</span>
            上传照片
          </button>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handleFileUpload} 
      />

      {/* UI Overlays */}
      <div className="relative z-10 flex items-center justify-between p-6 pt-12">
        <button onClick={onClose} className="size-12 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white active:scale-90 transition-transform">
          <span className="material-symbols-outlined text-[28px]">close</span>
        </button>
        {stream && (
          <button className="px-5 h-12 rounded-full bg-black/30 backdrop-blur-md flex items-center gap-2 text-white font-semibold">
            <span className="material-symbols-outlined text-[24px]">flash_on</span>
            <span>自动</span>
          </button>
        )}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative pointer-events-none">
        {stream && (
          <>
            <div className="relative size-72 md:size-80 border-2 border-primary/90 rounded-[32px] flex items-center justify-center">
                <div className="absolute w-4 h-4 border-t-2 border-l-2 border-white/50 top-4 left-4 rounded-tl-lg"></div>
                <div className="absolute w-4 h-4 border-t-2 border-r-2 border-white/50 top-4 right-4 rounded-tr-lg"></div>
                <div className="absolute w-4 h-4 border-b-2 border-l-2 border-white/50 bottom-4 left-4 rounded-bl-lg"></div>
                <div className="absolute w-4 h-4 border-b-2 border-r-2 border-white/50 bottom-4 right-4 rounded-br-lg"></div>
                <div className="size-1.5 bg-primary rounded-full"></div>
            </div>
            <div className="mt-8 px-4 py-2 bg-black/40 backdrop-blur-md rounded-xl text-white text-sm font-medium">
              将食物置于框内
            </div>
          </>
        )}
      </div>

      <div className="relative z-10 w-full pb-10 px-8 flex items-center justify-between">
        <div className="flex-1">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="size-14 rounded-xl overflow-hidden border-2 border-white/30 active:scale-95 transition-transform bg-neutral-800 flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-white/50">add_photo_alternate</span>
          </button>
        </div>
        
        {stream && (
          <button onClick={takePhoto} className="relative size-20 rounded-full border-[5px] border-accent flex items-center justify-center active:scale-90 transition-transform">
            <div className="size-[62px] bg-white rounded-full shadow-inner"></div>
          </button>
        )}
        
        <div className="flex-1 flex justify-end">
          <button className="size-12 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white active:scale-95 transition-transform">
            <span className="material-symbols-outlined">tips_and_updates</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CameraView;
