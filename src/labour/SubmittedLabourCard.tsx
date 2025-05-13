import React, { useEffect, useState } from "react";
import { LabourType } from "../common/types";
import LabourCardBrief from "../components/customCards/LabourCardBrief";

// Simulated API call (replace with real API call)
const getAllSubmittedLabourCard = async (): Promise<LabourType[]> => {
  // You would make your real API call here, e.g., using fetch/axios
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          firstName: "Tenzing",
          middleName: "Norbu",
          lastName: "Bhutia",
          gender: "Male",
          dob: "1992-03-15",
          permanentAddress: "Gangtok, Sikkim",
          currentAddress: "Gangtok, Sikkim",
          contactNumber: "9876543210",
          photo:
            "https://static.vecteezy.com/system/resources/previews/036/190/414/non_2x/mature-business-man-blank-profile-photos-vector.jpg",

          documentFront:
            "https://indiadarpan.com/wp-content/uploads/2018/10/Aadhaar-Card-sample.png",
          documentBack:
            "https://image-archive.developerhub.io/image/upload/23602/ourgxj9ze0zbe4mogr93/1585254605.jpg",
          createdAt: "2024-04-20",
        },
        {
          firstName: "Pema",
          middleName: "Lhendup",
          lastName: "Lepcha",
          gender: "Male",
          dob: "1989-07-10",
          permanentAddress: "Namchi, Sikkim",
          currentAddress: "Namchi, Sikkim",
          contactNumber: "9765432180",
          photo:
            "https://static.vecteezy.com/system/resources/previews/036/190/414/non_2x/mature-business-man-blank-profile-photos-vector.jpg",

          documentFront:
            "https://indiadarpan.com/wp-content/uploads/2018/10/Aadhaar-Card-sample.png",
          documentBack:
            "https://image-archive.developerhub.io/image/upload/23602/ourgxj9ze0zbe4mogr93/1585254605.jpg",
          createdAt: "2024-04-21",
        },
        {
          firstName: "Sonam",
          middleName: "Yangzom",
          lastName: "Sherpa",
          gender: "Female",
          dob: "1995-01-05",
          permanentAddress: "Gyalshing, Sikkim",
          currentAddress: "Gyalshing, Sikkim",
          contactNumber: "9456123789",
          photo:
            "https://static.vecteezy.com/system/resources/previews/036/190/416/original/business-woman-blank-profile-photos-vector.jpg",
          documentFront:
            "https://indiadarpan.com/wp-content/uploads/2018/10/Aadhaar-Card-sample.png",
          documentBack:
            "https://image-archive.developerhub.io/image/upload/23602/ourgxj9ze0zbe4mogr93/1585254605.jpg",
          createdAt: "2024-04-22",
        },
        {
          firstName: "Karma",
          middleName: "Dorji",
          lastName: "Tamang",
          gender: "Male",
          dob: "1991-09-12",
          permanentAddress: "Mangan, Sikkim",
          currentAddress: "Mangan, Sikkim",
          contactNumber: "9123456780",
          photo:
            "https://static.vecteezy.com/system/resources/previews/036/190/414/non_2x/mature-business-man-blank-profile-photos-vector.jpg",

          documentFront:
            "https://indiadarpan.com/wp-content/uploads/2018/10/Aadhaar-Card-sample.png",
          documentBack:
            "https://image-archive.developerhub.io/image/upload/23602/ourgxj9ze0zbe4mogr93/1585254605.jpg",
          createdAt: "2024-04-23",
        },
        {
          firstName: "Dechen",
          middleName: "Dolma",
          lastName: "Bhutia",
          gender: "Female",
          dob: "1994-11-25",
          permanentAddress: "Ravangla, Sikkim",
          currentAddress: "Ravangla, Sikkim",
          contactNumber: "9988776655",
          photo:
            "https://static.vecteezy.com/system/resources/previews/036/190/416/original/business-woman-blank-profile-photos-vector.jpg",
          documentFront:
            "https://indiadarpan.com/wp-content/uploads/2018/10/Aadhaar-Card-sample.png",
          documentBack:
            "https://image-archive.developerhub.io/image/upload/23602/ourgxj9ze0zbe4mogr93/1585254605.jpg",
          createdAt: "2024-04-24",
        },
        // Add more mock data if needed
      ]);
    }, 1000);
  });
};

const SubmittedLabourCard = () => {
  const [labourCards, setLabourCards] = useState<LabourType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [role, setRole] = useState("");
  // const [status, setStatus] = useState("");
  let status = "";

  useEffect(() => {
    async function fetchData() {
      setRole(localStorage.getItem("role") ?? "");

      try {
        const data = await getAllSubmittedLabourCard();
        setLabourCards(data);
      } catch (error) {
        console.error("Failed to fetch labour cards", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center mt-10 text-blue-600">Loading...</div>;
  }

  if (role === "user") {
    // setStatus("processed");
    status = "Process";
  }

  return (
    <div className="p-4 scroll-m-4">
      {labourCards.length === 0 ? (
        <div className="text-center text-gray-500">No Labour Cards found.</div>
      ) : (
        labourCards.map((labour, index) => (
          <LabourCardBrief key={index} labour={labour} status={status} />
        ))
      )}
    </div>
  );
};

export default SubmittedLabourCard;
