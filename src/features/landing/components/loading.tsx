import React from "react";
import { Loader } from "lucide-react";

const Loading: React.FC = () => {
  return (
    <div className="flex items-center gap-3 text-gray-400 justify-center h-full min-h-60">
      <Loader className="animate-spin" />
    </div>
  );
};

export default Loading;
