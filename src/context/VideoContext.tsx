import { createContext, useContext, useState, ReactNode } from "react";
import { Video } from "@/types/video";

interface VideoContextType {
  currentVideo: Video | null;
  isPlayerOpen: boolean;
  isMiniPlayer: boolean;
  openPlayer: (video: Video) => void;
  closePlayer: () => void;
  toggleMiniPlayer: () => void;
  exitMiniPlayer: () => void;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export function VideoProvider({ children }: { children: ReactNode }) {
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [isMiniPlayer, setIsMiniPlayer] = useState(false);

  const openPlayer = (video: Video) => {
    setCurrentVideo(video);
    setIsPlayerOpen(true);
    setIsMiniPlayer(false);
  };

  const closePlayer = () => {
    setCurrentVideo(null);
    setIsPlayerOpen(false);
    setIsMiniPlayer(false);
  };

  const toggleMiniPlayer = () => {
    setIsMiniPlayer(!isMiniPlayer);
  };

  const exitMiniPlayer = () => {
    setIsMiniPlayer(false);
  };

  return (
    <VideoContext.Provider
      value={{
        currentVideo,
        isPlayerOpen,
        isMiniPlayer,
        openPlayer,
        closePlayer,
        toggleMiniPlayer,
        exitMiniPlayer,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
}

export function useVideo() {
  const context = useContext(VideoContext);
  if (context === undefined) {
    throw new Error("useVideo must be used within a VideoProvider");
  }
  return context;
}