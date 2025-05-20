import { MdExpandMore } from "react-icons/md";
import { MdExpandLess } from "react-icons/md";
import axios from "axios";
import React, { useState } from "react";
import { LabourType } from "../../common/types";

const LabourCardBrief: React.FC<{ labour: LabourType; status?: string }> = ({
  labour,
  status,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleSave = async () => {
    try {
      if (!inputValue.trim()) {
        alert("Input cannot be empty!");
        return;
      }

      const response = await axios.post("https://your-api-url.com/endpoint", {
        value: inputValue,
      });

      console.log("API Response:", response.data);
      alert("Saved successfully!");

      // Optionally clear after successful save
      setInputValue("");
    } catch (error) {
      console.error("Save failed:", error);
      alert("Failed to save. Try again.");
    }
  };

  const handleCancel = () => {
    setInputValue(""); // Clears the input
  };

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  async function updateLabourCardStatus(): Promise<void> {
    try {
      let statusId = 0;
      if (status === "Approve") {
        statusId = 3;
      } else if (status === "Process") {
        statusId = 2;
      }

      const updateStatus = {
        labourId: labour.id,
        statusId: statusId,
        remark: inputValue,
      };

      const response = await axios.post(
        "https://mlha-e9f4fydheqbweudd.centralus-01.azurewebsites.net/api/Labour/updateLabourStatus",
        updateStatus
      );

      console.log("Status updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  }

  async function handleReject() {
    try {
      let statusId = 0;
      // if (status === "Approve") {
      //   statusId = 3;
      // } else if (status === "Process") {
      //   statusId = 2;
      // }

      const updateStatus = {
        labourId: labour.id,
        statusId: statusId,
        remark: inputValue,
      };

      const response = await axios.post(
        "https://mlha-e9f4fydheqbweudd.centralus-01.azurewebsites.net/api/Labour/updateLabourStatus",
        updateStatus
      );

      console.log("Status updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  }
  return (
    <div className="relative bg-gray-200 shadow-md rounded-lg p-4 mb-4 hover:shadow-lg transition-all duration-300">
      {/* Expand/Collapse Button */}
      <button
        onClick={toggleExpand}
        className="absolute top-4 right-4 hover:scale-125 hover:text-blue-600 text-2xl "
        title={expanded ? "Collapse" : "Expand"}
      >
        {expanded ? <MdExpandLess /> : <MdExpandMore />}
      </button>

      {/* Basic Info */}
      <div className="flex items-center space-x-4">
        <img
          src={labour.photo}
          alt="Labour Photo"
          className="w-16 h-16 rounded-full object-cover border hover:cursor-pointer"
          onClick={() => setSelectedImage(labour.photo)}
        />
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-gray-800">
            {`${labour.firstName} ${labour.middleName} ${labour.lastName}`}
          </h2>
          <p className="text-gray-600 text-sm">
            <span className="font-semibold">Permanent Address: </span>{" "}
            {labour.permanentAddress}
          </p>
          <p className="text-gray-600 text-sm">
            <span className="font-semibold">Phone: </span>{" "}
            {labour.contactNumber}
          </p>
          <p className="text-gray-600 text-sm">
            <span className="font-semibold">Created On: </span>{" "}
            {labour.createdAt}
          </p>
        </div>
      </div>

      {/* Expanded Info */}
      {expanded && (
        <div className="mt-4 text-gray-700 text-sm space-y-2 pl-20">
          <p>
            <span className="font-semibold">Gender:</span> {labour.gender}
          </p>
          <p>
            <span className="font-semibold">DOB:</span> {labour.dob}
          </p>
          <p>
            <span className="font-semibold">Current Address:</span>{" "}
            {labour.currentAddress}
          </p>

          <div className="flex space-x-4 mt-2">
            <div>
              <p className="font-semibold">Document Front:</p>
              <img
                src={labour.documentFront}
                alt="Document Front"
                className="w-24 h-16 object-cover border mt-1 hover:cursor-pointer "
                onClick={() => setSelectedImage(labour.documentFront)}
              />
            </div>
            <div>
              <p className="font-semibold">Document Back:</p>
              <img
                src={labour.documentBack}
                alt="Document Back"
                className="w-24 h-16 object-cover border mt-1 hover:cursor-pointer "
                onClick={() => setSelectedImage(labour.documentBack)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {status && status.length > 0 && expanded && (
        <div>
          <div>
            <div className="flex items-center space-x-2 mt-2">
              <p className="font-semibold ml-20">Remarks:</p>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300 shadow-lg hover:scale-110"
                placeholder="Add remarks"
              />
              <button
                onClick={handleSave}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded shadow-lg hover:scale-110 "
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded shadow-lg hover:scale-110"
              >
                Cancel
              </button>
            </div>
          </div>
          <div className=" absolute bottom-4 right-4  mt-4 ">
            <button
              onClick={handleReject}
              className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded mr-2 shadow-lg hover:scale-110"
            >
              Reject
            </button>
            <button
              onClick={updateLabourCardStatus}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded shadow-lg hover:scale-110"
            >
              {status}
            </button>
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

export default LabourCardBrief;
