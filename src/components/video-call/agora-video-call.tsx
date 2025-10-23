import { useState, useEffect, useRef } from "react";
import {
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  usePublish,
  useRemoteUsers,
  LocalVideoTrack,
  RemoteUser,
} from "agora-rtc-react";
import { Button } from "@/components/ui/button";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  Monitor,
  Settings,
  Loader2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/utils/formats";

interface AgoraVideoCallProps {
  appId: string;
  channelName: string;
  token: string;
  onLeave: () => void;
  localUser: {
    name: string;
    picture?: string;
  };
  remoteUser: {
    name: string;
    picture?: string;
  };
  existingCameraTrack?: any;
  existingMicrophoneTrack?: any;
}

export default function AgoraVideoCall({
  appId,
  channelName,
  token,
  onLeave,
  localUser,
  remoteUser,
  existingCameraTrack,
  existingMicrophoneTrack,
}: AgoraVideoCallProps) {
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

  // Usar tracks existentes se fornecidos, caso contrário criar novos
  const { localCameraTrack: newCameraTrack, isLoading: isCameraLoading } = useLocalCameraTrack(!existingCameraTrack);
  const { localMicrophoneTrack: newMicrophoneTrack, isLoading: isMicLoading } = useLocalMicrophoneTrack(!existingMicrophoneTrack);

  const localCameraTrack = existingCameraTrack || newCameraTrack;
  const localMicrophoneTrack = existingMicrophoneTrack || newMicrophoneTrack;

  // Refs para manter referência aos tracks para cleanup
  const cameraTrackRef = useRef(localCameraTrack);
  const microphoneTrackRef = useRef(localMicrophoneTrack);

  // Atualizar refs quando tracks mudarem
  useEffect(() => {
    cameraTrackRef.current = localCameraTrack;
  }, [localCameraTrack]);

  useEffect(() => {
    microphoneTrackRef.current = localMicrophoneTrack;
  }, [localMicrophoneTrack]);

  useJoin(
    {
      appid: appId,
      channel: channelName,
      token: token || null,
    },
    true
  );

  useEffect(() => {
    return () => {
      if (!existingCameraTrack && newCameraTrack) {
        newCameraTrack.stop();
        newCameraTrack.close();
      }
      if (!existingMicrophoneTrack && newMicrophoneTrack) {
        newMicrophoneTrack.stop();
        newMicrophoneTrack.close();
      }
    };
  }, []);

  usePublish([localMicrophoneTrack, localCameraTrack]);

  const remoteUsers = useRemoteUsers();


  const toggleVideo = async () => {
    if (localCameraTrack) {
      const newState = !isVideoEnabled;
      await localCameraTrack.setEnabled(newState);
      setIsVideoEnabled(newState);
    }
  };

  const toggleAudio = async () => {
    if (localMicrophoneTrack) {
      const newState = !isAudioEnabled;
      await localMicrophoneTrack.setEnabled(newState);
      setIsAudioEnabled(newState);
    }
  };

  const handleShareScreen = () => {
    // TODO: Implementar compartilhamento de tela
  };

  const handleSettings = () => {
    // TODO: Implementar configurações
  };

  const handleLeave = async () => {
    const camera = cameraTrackRef.current;
    const microphone = microphoneTrackRef.current;

    if (camera) {
      try {
        await camera.setEnabled(false);
        camera.stop();
        camera.close();
      } catch (error) {
        console.error("Erro ao fechar câmera:", error);
      }
    }

    if (microphone) {
      try {
        await microphone.setEnabled(false);
        microphone.stop();
        microphone.close();
      } catch (error) {
        console.error("Erro ao fechar microfone:", error);
      }
    }

    setTimeout(() => {
      onLeave();
    }, 100);
  };

  const isLoading = isCameraLoading || isMicLoading;

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-gray-950">
        <div className="flex flex-col items-center gap-3 text-white">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-sm">Preparando videochamada...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-950">
      <div className="flex items-center justify-between p-4 bg-gray-900/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-white text-sm">Videochamada ativa</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white text-sm">
            {localUser.name} • {remoteUser.name}
          </span>
        </div>
      </div>

      <div className="flex-1 p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
          {isVideoEnabled && localCameraTrack ? (
            <LocalVideoTrack
              track={localCameraTrack}
              play={true}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <Avatar className="h-24 w-24 mx-auto mb-4">
                  <AvatarImage src={localUser.picture} />
                  <AvatarFallback className="text-2xl">
                    {getInitials(localUser.name)}
                  </AvatarFallback>
                </Avatar>
                <p className="text-lg font-medium">{localUser.name}</p>
                <p className="text-sm opacity-75">Câmera desligada</p>
              </div>
            </div>
          )}
          <div className="absolute bottom-4 left-4 text-white bg-black/50 px-3 py-1.5 rounded-lg text-sm">
            Você {!isAudioEnabled && "(Mudo)"}
          </div>
        </div>

        {remoteUsers.length > 0 ? (
          remoteUsers.map((user) => (
            <div key={user.uid} className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
              <RemoteUser
                user={user}
                playVideo={true}
                playAudio={true}
                className="w-full h-full"
              />
              <div className="absolute bottom-4 left-4 text-white bg-black/50 px-3 py-1.5 rounded-lg text-sm">
                {remoteUser.name}
              </div>
            </div>
          ))
        ) : (
          <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <Avatar className="h-24 w-24 mx-auto mb-4">
                  <AvatarImage src={remoteUser.picture} />
                  <AvatarFallback className="text-2xl">
                    {getInitials(remoteUser.name)}
                  </AvatarFallback>
                </Avatar>
                <p className="text-lg font-medium">{remoteUser.name}</p>
                <p className="text-sm opacity-75">Aguardando conexão...</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-gray-900/50 backdrop-blur-sm">
        <div className="flex items-center justify-center gap-4">
          <Button
            variant={isVideoEnabled ? "secondary" : "destructive"}
            size="icon"
            className="h-14 w-14 rounded-full"
            onClick={toggleVideo}
          >
            {isVideoEnabled ? (
              <Video className="h-6 w-6" />
            ) : (
              <VideoOff className="h-6 w-6" />
            )}
          </Button>
          <Button
            variant={isAudioEnabled ? "secondary" : "destructive"}
            size="icon"
            className="h-14 w-14 rounded-full"
            onClick={toggleAudio}
          >
            {isAudioEnabled ? (
              <Mic className="h-6 w-6" />
            ) : (
              <MicOff className="h-6 w-6" />
            )}
          </Button>
          <Button
            variant="destructive"
            size="icon"
            className="h-16 w-16 rounded-full"
            onClick={handleLeave}
          >
            <PhoneOff className="h-7 w-7" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="h-14 w-14 rounded-full"
            onClick={handleShareScreen}
          >
            <Monitor className="h-6 w-6" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="h-14 w-14 rounded-full"
            onClick={handleSettings}
          >
            <Settings className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  );
}
