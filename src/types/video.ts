export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  duration: string;
  views: string;
  uploadedAt: string;
  channel: {
    name: string;
    avatar: string;
  };
  category: string;
}