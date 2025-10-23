import { ReactNode } from "react";
import AgoraRTC, { AgoraRTCProvider } from "agora-rtc-react";

const agoraClient = AgoraRTC.createClient({
  mode: "rtc",
  codec: "vp8",
});

interface AgoraProviderProps {
  children: ReactNode;
}


export function AgoraProvider({ children }: AgoraProviderProps) {
  return <AgoraRTCProvider client={agoraClient}>
    {children}
  </AgoraRTCProvider>;
}

export { agoraClient };
export default AgoraProvider;
