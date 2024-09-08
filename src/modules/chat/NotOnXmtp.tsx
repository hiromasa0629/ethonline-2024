import React from "react";

interface NotOnXmtpProps {
  name: string;
}

const NotOnXmtp: React.FC<NotOnXmtpProps> = ({ name }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="bg-red-100 text-red-600 px-6 py-4 rounded-lg shadow-md">
        <p className="text-lg font-semibold">{name} is not on the server.</p>
        <p className="text-sm text-gray-600">Please check the user or try again later.</p>
      </div>
    </div>
  );
};

export default NotOnXmtp;
