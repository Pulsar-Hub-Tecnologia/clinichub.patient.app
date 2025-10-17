import { ReactNode } from "react";
import ImageCarousel from "@/components/carousel/carousel";
import ClinicHubLoginImage1 from "/carrosel/image1.png";
import ClinicHubLoginImage2 from "/carrosel/image2.png";
import ClinicHubLoginImage3 from "/carrosel/image3.png";

interface AuthBackgroundProps {
  children: ReactNode;
}

const AuthBackground = ({ children }: AuthBackgroundProps) => {
  return (
    <section className="flex w-full max-h-dvh min-h-dvh bg-background">
      <div className="flex flex-col justify-center w-full lg:w-1/3 px-6 py-4">
        <div className="w-full max-w-md mx-auto">
          {children}
        </div>
      </div>
      <section className="hidden lg:block lg:w-2/3 min-h-full bg-gradient-to-r from-primary to-primary-foreground relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 z-20">
          <ImageCarousel
            images={[
              ClinicHubLoginImage1,
              ClinicHubLoginImage2,
              ClinicHubLoginImage3,
            ]}
            links={["https://google.com", "https://google.com", "https://google.com"]}
            actionLabel="Saiba mais"
          />
        </div>
        <div className="absolute bottom-1 left-[10%] w-6 h-6 rounded-full opacity-0 bg-white animate-bubble-float-1 z-10"></div>
        <div className="absolute bottom-1 left-[30%] w-30 h-30 rounded-full opacity-0 bg-white animate-bubble-float-2 z-10"></div>
        <div className="absolute bottom-1 left-[50%] w-7 h-7 rounded-full opacity-0 bg-white animate-bubble-float-3 z-10"></div>
        <div className="absolute bottom-1 left-[70%] w-12 h-12 rounded-full opacity-0 bg-white animate-bubble-float-1 [animation-delay:3s] z-10"></div>
        <div className="absolute bottom-1 left-[90%] w-9 h-9 rounded-full opacity-0 bg-white animate-bubble-float-2 [animation-delay:1s] z-10"></div>
      </section>
    </section>
  );
}

export default AuthBackground;