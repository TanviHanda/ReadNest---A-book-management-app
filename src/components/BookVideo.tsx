import React from "react";

interface BookVideoProps {
  videoUrl: string;
}

const BookVideo: React.FC<BookVideoProps> = ({ videoUrl }) => {
  return (
    <video
      src={videoUrl}
      controls
      className="w-full max-w-xl rounded-lg shadow-md"
    />
  );
};

export default BookVideo;
