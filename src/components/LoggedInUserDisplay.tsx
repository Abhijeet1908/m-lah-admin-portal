import React from "react";
import { LoggedInUserType } from "../common/types";

interface LoggedInUserDisplayProps {
  user: LoggedInUserType;
}

const LoggedInUserDisplay: React.FC<LoggedInUserDisplayProps> = ({ user }) => {
  const names: string[] = user.userName.split(" ");
  return (
    <div>
      <div className=" flex h-10 w-10 rounded-full bg-gray-400 items-center justify-center  hover:scale-110 shadow-xl">
        <div
          className=" text-xl text-blue-600  cursor-none "
          title={user.userName}
        >
          {names[0].charAt(0).toUpperCase() +
            (names[1]?.charAt(0).toUpperCase() || "")}
        </div>
      </div>
    </div>
  );
};

export default LoggedInUserDisplay;
