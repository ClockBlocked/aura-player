import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Minimize2,
  Maximize2,
  Play,
  Pause,
  Volume2,
  VolumeX,
  SkipBack,
  SkipForward,
  Settings,
  Maximize,
  PictureInPicture2,
} from "lucide-react";
import { useVideo } from "@/context/VideoContext";

export function VideoPlayer() {
  const { currentVideo, isPlayerOpen, isMiniPlayer, closePlayer, toggleMiniPlayer } = useVideo();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isPlayerOpen && videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  }, [isPlayerOpen, currentVideo]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      setProgress((video.currentTime / video.duration) * 100);
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [currentVideo]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setVolume(value);
    if (videoRef.current) {
      videoRef.current.volume = value;
      setIsMuted(value === 0);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    if (videoRef.current) {
      videoRef.current.currentTime = pos * duration;
    }
  };

  const skip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  if (!isPlayerOpen || !currentVideo) return null;

  const miniPlayerVariants = {
    full: {
      position: "fixed" as const,
      inset: 0,
      width: "100%",
      height: "100%",
      borderRadius: 0,
      zIndex: 50,
    },
    mini: {
      position: "fixed" as const,
      bottom: 24,
      right: 24,
      width: 360,
      height: 203,
      borderRadius: 12,
      zIndex: 50,
      inset: "auto",
    },
  };

  return (
    <AnimatePresence>
      {!isMiniPlayer && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-overlay/80 backdrop-blur-sm z-40"
          onClick={toggleMiniPlayer}
        />
      )}
      <motion.div
        layout
        initial={miniPlayerVariants.full}
        animate={isMiniPlayer ? miniPlayerVariants.mini : miniPlayerVariants.full}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-overlay overflow-hidden shadow-lg"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => isPlaying && setShowControls(false)}
      >
        <div className="relative w-full h-full flex flex-col">
          <video
            ref={videoRef}
            src={currentVideo.videoUrl}
            className="w-full flex-1 object-contain bg-overlay"
            onClick={togglePlay}
          />
          <AnimatePresence>
            {(showControls || !isPlaying) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col"
              >
                <div className="flex items-center justify-between p-4 bg-gradient-to-b from-overlay/80 to-transparent">
                  {!isMiniPlayer && (
                    <div className="flex-1 min-w-0 mr-4">
                      <h2 className="text-lg font-semibold text-foreground truncate">
                        {currentVideo.title}
                      </h2>
                      <p className="text-sm text-muted-foreground">{currentVideo.channel.name}</p>
                    </div>
                  )}
                  <div className="flex items-center gap-2 ml-auto">
                    <button
                      onClick={toggleMiniPlayer}
                      className="p-2 rounded-lg bg-surface/50 hover:bg-surface text-foreground transition-colors"
                    >
                      {isMiniPlayer ? (
                        <Maximize2 className="w-5 h-5" />
                      ) : (
                        <PictureInPicture2 className="w-5 h-5" />
                      )}
                    </button>
                    <button
                      onClick={closePlayer}
                      className="p-2 rounded-lg bg-surface/50 hover:bg-destructive text-foreground transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="flex-1 flex items-center justify-center">
                  {!isMiniPlayer && (
                    <div className="flex items-center gap-6">
                      <button
                        onClick={() => skip(-10)}
                        className="p-3 rounded-full bg-surface/30 hover:bg-surface/50 text-foreground transition-colors"
                      >
                        <SkipBack className="w-6 h-6" />
                      </button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={togglePlay}
                        className="p-5 rounded-full bg-primary hover:bg-primary-glow text-primary-foreground transition-colors shadow-glow"
                      >
                        {isPlaying ? (
                          <Pause className="w-8 h-8" fill="currentColor" />
                        ) : (
                          <Play className="w-8 h-8 ml-1" fill="currentColor" />
                        )}
                      </motion.button>
                      <button
                        onClick={() => skip(10)}
                        className="p-3 rounded-full bg-surface/30 hover:bg-surface/50 text-foreground transition-colors"
                      >
                        <SkipForward className="w-6 h-6" />
                      </button>
                    </div>
                  )}
                </div>
                <div className="p-4 bg-gradient-to-t from-overlay/80 to-transparent">
                  <div
                    className="relative h-1 bg-surface rounded-full cursor-pointer group mb-4"
                    onClick={handleProgressClick}
                  >
                    <div
                      className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                    <div
                      className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full shadow-glow opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ left: `calc(${progress}% - 6px)` }}
                    />
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {isMiniPlayer && (
                        <button
                          onClick={togglePlay}
                          className="p-2 rounded-lg hover:bg-surface/50 text-foreground transition-colors"
                        >
                          {isPlaying ? (
                            <Pause className="w-5 h-5" />
                          ) : (
                            <Play className="w-5 h-5" />
                          )}
                        </button>
                      )}
                      <div className="flex items-center gap-2 group/vol">
                        <button
                          onClick={toggleMute}
                          className="p-2 rounded-lg hover:bg-surface/50 text-foreground transition-colors"
                        >
                          {isMuted || volume === 0 ? (
                            <VolumeX className="w-5 h-5" />
                          ) : (
                            <Volume2 className="w-5 h-5" />
                          )}
                        </button>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={isMuted ? 0 : volume}
                          onChange={handleVolumeChange}
                          className="w-0 group-hover/vol:w-20 transition-all duration-300 accent-primary"
                        />
                      </div>
                      <span className="text-sm text-muted-foreground font-mono">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    </div>
                    {!isMiniPlayer && (
                      <div className="flex items-center gap-2">
                        <button className="p-2 rounded-lg hover:bg-surface/50 text-foreground transition-colors">
                          <Settings className="w-5 h-5" />
                        </button>
                        <button
                          onClick={handleFullscreen}
                          className="p-2 rounded-lg hover:bg-surface/50 text-foreground transition-colors"
                        >
                          <Maximize className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}