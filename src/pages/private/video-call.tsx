import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Video,
  ChevronLeft,
  Loader2
} from "lucide-react";
import { toast } from "react-toastify";
import ConsultationService from "@/services/api/consultation.service";
import { getInitials } from "@/utils/formats";
import AgoraVideoCall from "@/components/video-call/agora-video-call";
import { useLocalCameraTrack, LocalVideoTrack, useLocalMicrophoneTrack } from "agora-rtc-react";

export default function VideoCall() {
  const { consultationId } = useParams<{ consultationId: string }>();
  const navigate = useNavigate();

  const [inCall, setInCall] = useState(false);

  // Preview da câmera antes de entrar na chamada
  const { localCameraTrack, isLoading: cameraLoading } = useLocalCameraTrack();
  const { localMicrophoneTrack } = useLocalMicrophoneTrack();

  // Armazenar referências de TODOS os tracks criados (para fechar no cleanup)
  const allTracksRef = useRef<any[]>([]);

  // Registrar tracks criados
  useEffect(() => {
    if (localCameraTrack && !allTracksRef.current.includes(localCameraTrack)) {
      allTracksRef.current.push(localCameraTrack);
    }
  }, [localCameraTrack]);

  useEffect(() => {
    if (localMicrophoneTrack && !allTracksRef.current.includes(localMicrophoneTrack)) {
      allTracksRef.current.push(localMicrophoneTrack);
    }
  }, [localMicrophoneTrack]);

  // Busca dados da consulta
  const { data: consultation, isLoading: consultationLoading } = useQuery({
    queryKey: ["consultation", consultationId],
    queryFn: () => ConsultationService.getConsultationById(consultationId!),
    enabled: !!consultationId,
  });

  // Busca token da videochamada
  const { data: videoCallData, isLoading: tokenLoading } = useQuery({
    queryKey: ["video-call-token", consultationId],
    queryFn: () => ConsultationService.getVideoCallToken(consultationId!),
    enabled: !!consultationId && inCall,
    retry: 1,
  });

  useEffect(() => {
    if (!consultationId) {
      toast.error("ID da consulta não encontrado");
      navigate("/consultas");
    }
  }, [consultationId, navigate]);

  // Cleanup TODOS os tracks quando o componente desmontar
  useEffect(() => {
    return () => {
      allTracksRef.current.forEach((track) => {
        try {
          track.stop();
          track.close();
        } catch (error) {
          console.error('Erro ao fechar track:', error);
        }
      });
      allTracksRef.current = [];
    };
  }, []);

  const handleJoinCall = () => {
    setInCall(true);
  };

  const handleLeaveCall = () => {
    setInCall(false);
    toast.info("Você saiu da videochamada");
    navigate("/consultas");
  };

  if (consultationLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Carregando consulta...</p>
        </div>
      </div>
    );
  }

  if (!consultation) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Consulta não encontrada</CardTitle>
            <CardDescription>
              Não foi possível encontrar a consulta solicitada.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/consultas")} className="w-full">
              Voltar para consultas
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Tela de pré-chamada
  if (!inCall) {
    return (
      <div className="flex min-h-screen w-full flex-col bg-background p-4 md:p-6 gap-5">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              localCameraTrack?.close();
              localMicrophoneTrack?.close();
              navigate("/consultas")
            }}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Voltar
          </Button>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle className="text-2xl">Sala de Videochamada</CardTitle>
              <CardDescription>
                Você está prestes a entrar na videochamada
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Informações da Consulta */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-lg">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={consultation.professional.picture} />
                    <AvatarFallback>
                      {getInitials(consultation.professional.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Profissional: {consultation.professional.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {consultation.professional.especiality || consultation.professional.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-lg">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={consultation.workspace.picture} />
                    <AvatarFallback>
                      {getInitials(consultation.workspace.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Clínica: {consultation.workspace.name}</p>
                  </div>
                </div>
              </div>

              {/* Preview de vídeo */}
              <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
                {cameraLoading ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <Loader2 className="h-12 w-12 mx-auto mb-2 animate-spin" />
                      <p className="text-sm opacity-75">Carregando câmera...</p>
                    </div>
                  </div>
                ) : localCameraTrack ? (
                  <LocalVideoTrack
                    track={localCameraTrack}
                    play={true}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <Video className="h-16 w-16 mx-auto mb-2 opacity-50" />
                      <p className="text-sm opacity-75">Câmera não disponível</p>
                      <p className="text-xs opacity-50 mt-2">Verifique as permissões do navegador</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Botão de entrar */}
              <Button
                onClick={handleJoinCall}
                className="w-full h-12 text-base"
                size="lg"
                disabled={cameraLoading}
              >
                {cameraLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Preparando câmera...
                  </>
                ) : (
                  <>
                    <Video className="h-5 w-5 mr-2" />
                    Entrar na Videochamada
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Tela durante a chamada
  if (tokenLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-gray-950">
        <div className="flex flex-col items-center gap-3 text-white">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-sm">Conectando à videochamada...</p>
        </div>
      </div>
    );
  }

  if (!videoCallData) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-gray-950">
        <div className="flex flex-col items-center gap-3 text-white">
          <p>Erro ao conectar à videochamada</p>
          <Button onClick={() => navigate("/consultas")} variant="outline">
            Voltar para consultas
          </Button>
        </div>
      </div>
    );
  }

  return (
    <AgoraVideoCall
      appId={import.meta.env.VITE_APP_ID}
      channelName={videoCallData.channelName}
      token={videoCallData.token}
      onLeave={handleLeaveCall}
      localUser={{
        name: consultation.patient.name,
        picture: consultation.patient.picture,
      }}
      remoteUser={{
        name: consultation.professional.name,
        picture: consultation.professional.picture,
      }}
      existingCameraTrack={localCameraTrack}
      existingMicrophoneTrack={localMicrophoneTrack}
    />
  );
}
