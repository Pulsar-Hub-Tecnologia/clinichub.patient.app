import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Mic, Volume2 } from "lucide-react";

interface AudioSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentMicrophoneId?: string;
  currentSpeakerId?: string;
  onMicrophoneChange: (deviceId: string) => void;
  onSpeakerChange: (deviceId: string) => void;
}

export default function AudioSettingsModal({
  open,
  onOpenChange,
  currentMicrophoneId,
  currentSpeakerId,
  onMicrophoneChange,
  onSpeakerChange,
}: AudioSettingsModalProps) {
  const [microphones, setMicrophones] = useState<MediaDeviceInfo[]>([]);
  const [speakers, setSpeakers] = useState<MediaDeviceInfo[]>([]);

  useEffect(() => {
    if (open) {
      loadDevices();
    }
  }, [open]);

  const loadDevices = async () => {
    try {
      // Solicitar permissões primeiro
      await navigator.mediaDevices.getUserMedia({ audio: true });

      const devices = await navigator.mediaDevices.enumerateDevices();

      const audioInputs = devices.filter(device => device.kind === 'audioinput');
      const audioOutputs = devices.filter(device => device.kind === 'audiooutput');

      setMicrophones(audioInputs);
      setSpeakers(audioOutputs);
    } catch (error) {
      console.error("Erro ao carregar dispositivos:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Configurações de Áudio</DialogTitle>
          <DialogDescription>
            Selecione os dispositivos de entrada e saída de áudio
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Microfone */}
          <div className="space-y-2">
            <Label htmlFor="microphone" className="flex items-center gap-2">
              <Mic className="h-4 w-4" />
              Microfone
            </Label>
            <Select
              value={currentMicrophoneId}
              onValueChange={onMicrophoneChange}
            >
              <SelectTrigger id="microphone">
                <SelectValue placeholder="Selecione um microfone" />
              </SelectTrigger>
              <SelectContent>
                {microphones.map((device) => (
                  <SelectItem key={device.deviceId} value={device.deviceId}>
                    {device.label || `Microfone ${device.deviceId.substring(0, 8)}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Alto-falante */}
          <div className="space-y-2">
            <Label htmlFor="speaker" className="flex items-center gap-2">
              <Volume2 className="h-4 w-4" />
              Alto-falante
            </Label>
            <Select
              value={currentSpeakerId}
              onValueChange={onSpeakerChange}
            >
              <SelectTrigger id="speaker">
                <SelectValue placeholder="Selecione um alto-falante" />
              </SelectTrigger>
              <SelectContent>
                {speakers.map((device) => (
                  <SelectItem key={device.deviceId} value={device.deviceId}>
                    {device.label || `Alto-falante ${device.deviceId.substring(0, 8)}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
