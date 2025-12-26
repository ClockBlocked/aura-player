import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { Video } from "@/types/video";
import { useVideo } from "@/context/VideoContext";

interface VideoCardProps {
  video: Video;
  index: number;
}

export function VideoCard({ video, index }: VideoCardProps) {
  const { openPlayer } = useVideo();

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group cursor-pointer"
      onClick={() => openPlayer(video)}
    >
      <div className="relative aspect-video rounded-xl overflow-hidden bg-surface mb-3">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-overlay/0 group-hover:bg-overlay/40 transition-colors duration-300" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-glow"
          >
            <Play className="w-6 h-6 text-primary-foreground ml-1" fill="currentColor" />
          </motion.div>
        </div>
        <div className="absolute bottom-2 right-2 px-2 py-1 rounded-md bg-overlay/90 text-xs font-medium text-foreground backdrop-blur-sm">
          {video.duration}
        </div>
      </div>
      <div className="flex gap-3">
        <img
          src={video.channel.avatar}
          alt={video.channel.name}
          className="w-9 h-9 rounded-full object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-foreground line-clamp-2 leading-snug mb-1 group-hover:text-primary transition-colors">
            {video.title}
          </h3>
          <p className="text-sm text-muted-foreground">{video.channel.name}</p>
          <p className="text-sm text-muted-foreground">
            {video.views} views • {video.uploadedAt}
          </p>
        </div>
      </div>
    </motion.article>
  );
}