import { ReactNode, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'react-toastify';

export function CameraModal({
  onCapture,
  children,
  disabled,
}: {
  onCapture: (image: File) => void;
  children: ReactNode;
  disabled?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Só inicializa a câmera quando o modal estiver aberto
    if (!isOpen) return;

    const initCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        streamRef.current = mediaStream;
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        toast.error('Não foi possível acessar a câmera');
        setIsOpen(false);
      }
    };

    initCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen]); // Dependência apenas do estado de abertura

  const captureImage = () => {
    if (videoRef.current && streamRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const file = new File([blob], 'capture.jpg', {
                type: 'image/jpeg',
              });
              onCapture(file);
              setIsOpen(false); // Fecha o modal após capturar
            }
          },
          'image/jpeg',
          0.9
        );
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild disabled={disabled}>
        {children}
      </DialogTrigger>
      <DialogContent>
        <div className="bg-white p-4 rounded-lg w-full">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full rounded-xl"
          />
          <div className="flex justify-center mt-4 space-x-4">
            <Button onClick={captureImage}>Capturar</Button>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}