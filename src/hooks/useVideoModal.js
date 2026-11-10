import { useCallback, useState } from 'react';

/** Which video is playing in the modal. `videoUrl` is null while the modal is closed. */
export default function useVideoModal() {
  const [videoUrl, setVideoUrl] = useState(null);
  const playVideo = useCallback((url) => setVideoUrl(url), []);
  const closeVideo = useCallback(() => setVideoUrl(null), []);
  return { videoUrl, playVideo, closeVideo };
}
