import { VideoProvider } from "@/context/VideoContext";
import { VideoGallery } from "@/components/VideoGallery";
import { VideoPlayer } from "@/components/VideoPlayer";

const Index = () => {
  return (
    <VideoProvider>
      <main className="min-h-screen">
        <VideoGallery />
        <VideoPlayer />
      </main>
    </VideoProvider>
  );
};

export default Index;