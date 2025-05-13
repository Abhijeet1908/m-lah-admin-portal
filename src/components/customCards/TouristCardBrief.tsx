import React, { useState } from "react";
import { TouristType, MemberType } from "../../common/types";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { MdExpandLess, MdExpandMore } from "react-icons/md";

const TouristCardBrief: React.FC<{ tourist: TouristType }> = ({ tourist }) => {
  const [expanded, setExpanded] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="bg-gray-200 shadow-md rounded-lg p-4 mb-4 hover:shadow-lg transition-all duration-300">
      {/* <button
        onClick={toggleExpand}
        className="absolute top-4 right-4 hover:scale-125 hover:text-blue-600 text-2xl "
        title={expanded ? "Collapse" : "Expand"}
      >
        {expanded ? <MdExpandLess /> : <MdExpandMore />}
      </button> */}
      {/* Main Row */}
      <div className="flex items-start justify-between">
        {/* Left - Photo + Basic Info */}
        <div className="flex items-center space-x-4">
          <img
            src={tourist.photo}
            alt="Tourist Photo"
            className="w-16 h-16 rounded-full object-cover border hover:cursor-pointer"
            onClick={() => setSelectedImage(tourist.photo)}
          />
          <div>
            <h2 className="text-lg font-semibold text-gray-800">{`${tourist.firstName} ${tourist.lastName}`}</h2>
            <p className="text-gray-600 text-sm">
              <span className="font-semibold">Permanent Address:</span>{" "}
              {tourist.permanentAddress}
            </p>
            <p className="text-gray-600 text-sm">
              <span className="font-semibold">Phone:</span>{" "}
              {tourist.contactNumber}
            </p>
            <p className="text-gray-600 text-sm">
              <span className="font-semibold">Members:</span>{" "}
              {tourist.members.length}
            </p>
          </div>
        </div>

        {/* Right - Document Front, Back and Expand/Collapse Icon */}
        <div className="flex flex-col items-end space-y-2 ml-4">
          {/* Expand/Collapse Icon */}
          <div
            className="mt-2 text-gray-600 text-2xl hover:scale-125 hover:text-blue-600 cursor-pointer"
            onClick={toggleExpand}
          >
            {expanded ? <MdExpandMore /> : <MdExpandLess />}
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="mt-4 text-gray-700 text-sm pl-20">
          {/* Tourist Full Details */}
          <div className="space-y-2">
            <p>
              <span className="font-semibold">Gender:</span> {tourist.gender}
            </p>
            <p>
              <span className="font-semibold">DOB:</span> {tourist.dob}
            </p>
            <p>
              <span className="font-semibold">Email:</span> {tourist.email}
            </p>
            <div className="flex space-x-4 mt-2">
              <div>
                <p className="font-semibold">Document Front:</p>
                <img
                  src={tourist.documentFront}
                  alt="Document Front"
                  className="w-24 h-16 object-cover border mt-1 hover:cursor-pointer"
                  onClick={() => setSelectedImage(tourist.documentFront)}
                />
              </div>
              <div>
                <p className="font-semibold">Document Back:</p>
                <img
                  src={tourist.documentBack}
                  alt="Document Back"
                  className="w-24 h-16 object-cover border mt-1 hover:cursor-pointer"
                  onClick={() => setSelectedImage(tourist.documentBack)}
                />
              </div>
            </div>
          </div>

          {/* Members Grid */}
          <div className="mt-6">
            {tourist.members.length > 0 && (
              <h3 className="text-md font-semibold text-gray-800 mb-2">
                Members:
              </h3>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {tourist.members.map((member, idx) => (
                <div key={idx} className="bg-white rounded-lg shadow p-3">
                  <div className="flex items-center space-x-3">
                    <img
                      src={member.photo}
                      alt="Member Photo"
                      className="w-12 h-12 rounded-full object-cover border hover:cursor-pointer"
                      onClick={() => setSelectedImage(member.photo)}
                    />
                    <div>
                      <p className="font-semibold text-gray-700">{`${member.firstName} ${member.lastName}`}</p>
                      <p className="text-xs text-gray-500">{member.email}</p>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-600">
                    <p>
                      <span className="font-semibold">Phone:</span>{" "}
                      {member.contactNumber}
                    </p>
                    <p>
                      <span className="font-semibold">DOB:</span> {member.dob}
                    </p>
                    <p>
                      <span className="font-semibold">Gender:</span>{" "}
                      {member.gender}
                    </p>
                    <p>
                      <span className="font-semibold">Address:</span>{" "}
                      {member.permanentAddress}
                    </p>
                  </div>
                  <div className="flex space-x-4 mt-2">
                    <div>
                      <p className="font-semibold">Document Front:</p>
                      <img
                        src={member.documentFront}
                        alt="Document Front"
                        className="w-24 h-16 object-cover border mt-1 hover:cursor-pointer"
                        onClick={() => setSelectedImage(member.documentFront)}
                      />
                    </div>
                    <div>
                      <p className="font-semibold">Document Back:</p>
                      <img
                        src={member.documentBack}
                        alt="Document Back"
                        className="w-24 h-16 object-cover border mt-1 hover:cursor-pointer"
                        onClick={() => setSelectedImage(member.documentBack)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Full Size"
            className="max-w-4xl max-h-4xl object-contain transform scale-150 hover:scale-125 transition-transform duration-300"
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking on image itself
          />
        </div>
      )}
    </div>
  );
};

export default TouristCardBrief;
