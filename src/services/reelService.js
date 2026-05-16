const DUMMY_REELS = [
  {
    id: 'reel-1',
    username: 'math.lab',
    avatarUri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
    caption: 'Quick derivative shortcut for calculus learners.',
    videoUri: 'https://cdn.coverr.co/videos/coverr-working-on-a-computer-1561274935041?download=1080p',
    likes: 120,
    comments: 18,
    shares: 9,
    isLiked: false,
    isFollowing: false,
    audioLabel: 'Original audio · math.lab',
  },
  {
    id: 'reel-2',
    username: 'arduino.builder',
    avatarUri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
    caption: 'ESP32 sensor wiring in under 30 seconds.',
    videoUri: 'https://cdn.coverr.co/videos/coverr-close-up-of-hands-typing-on-a-laptop-1566633066600?download=1080p',
    likes: 220,
    comments: 34,
    shares: 17,
    isLiked: false,
    isFollowing: true,
    audioLabel: 'Sensor demo beat · arduino.builder',
  },
  {
    id: 'reel-3',
    username: 'code.daily',
    avatarUri: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
    caption: 'Java vs Python mental model for beginners.',
    videoUri: 'https://cdn.coverr.co/videos/coverr-laptop-on-the-desk-5176/1080p.mp4',
    likes: 342,
    comments: 54,
    shares: 28,
    isLiked: true,
    isFollowing: false,
    audioLabel: 'Coding study mix · code.daily',
  },
];

export function getDummyReels() {
  return DUMMY_REELS.map((item) => ({ ...item }));
}
