import { useEffect, useState } from "react";
import { TouristType } from "../common/types";
import TouristCardBrief from "../components/customCards/TouristCardBrief";
import axios from "axios";

export const getAllSubmittedTouristCards = async (): Promise<TouristType[]> => {
  try {
    const response = await axios.get<TouristType[]>(
      "https://mlha-e9f4fydheqbweudd.centralus-01.azurewebsites.net/api/Tourist/GetAllCustomerList"
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch tourist cards:", error);
    throw error; // Or return an empty array if you prefer: return [];
  }
};

// export const getAllSubmittedTouristCards = async (): Promise<TouristType[]> => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve([
//         {
//           firstName: "Alice",
//           lastName: "Sharma",
//           email: "alice@example.com",
//           contactNumber: "9876543210",
//           photo:
//             "https://static.vecteezy.com/system/resources/previews/036/190/416/original/business-woman-blank-profile-photos-vector.jpg",

//           documentFront:
//             "https://indiadarpan.com/wp-content/uploads/2018/10/Aadhaar-Card-sample.png",
//           documentBack:
//             "https://image-archive.developerhub.io/image/upload/23602/ourgxj9ze0zbe4mogr93/1585254605.jpg",
//           gender: "Female",
//           dob: "1992-05-14",
//           permanentAddress: "Durgapur, West BEngal",
//           members: [
//             {
//               firstName: "Shayam",
//               lastName: "Sharma",
//               email: "shayam@example.com",
//               contactNumber: "1122334455",
//               photo:
//                 "https://static.vecteezy.com/system/resources/previews/036/190/414/non_2x/mature-business-man-blank-profile-photos-vector.jpg",

//               documentFront:
//                 "https://indiadarpan.com/wp-content/uploads/2018/10/Aadhaar-Card-sample.png",
//               documentBack:
//                 "https://image-archive.developerhub.io/image/upload/23602/ourgxj9ze0zbe4mogr93/1585254605.jpg",
//               gender: "Male",
//               dob: "1995-08-20",
//               permanentAddress: "Durgapur, West BEngal",
//             },
//             {
//               firstName: "Priya",
//               lastName: "Sharma",
//               email: "priya@example.com",
//               contactNumber: "2233445566",
//               photo:
//                 "https://static.vecteezy.com/system/resources/previews/036/190/416/original/business-woman-blank-profile-photos-vector.jpg",

//               documentFront:
//                 "https://indiadarpan.com/wp-content/uploads/2018/10/Aadhaar-Card-sample.png",
//               documentBack:
//                 "https://image-archive.developerhub.io/image/upload/23602/ourgxj9ze0zbe4mogr93/1585254605.jpg",
//               gender: "Female",
//               dob: "2000-11-30",
//               permanentAddress: "Durgapur, West Bengal",
//             },
//           ],
//         },
//         {
//           firstName: "Rahul",

//           lastName: "Dutta",
//           gender: "Male",
//           dob: "1992-03-15",
//           permanentAddress: "Kolkata, West Bengal",

//           contactNumber: "9876543210",
//           photo:
//             "https://static.vecteezy.com/system/resources/previews/036/190/414/non_2x/mature-business-man-blank-profile-photos-vector.jpg",

//           documentFront:
//             "https://indiadarpan.com/wp-content/uploads/2018/10/Aadhaar-Card-sample.png",
//           documentBack:
//             "https://image-archive.developerhub.io/image/upload/23602/ourgxj9ze0zbe4mogr93/1585254605.jpg",

//           email: "rahul@example.com",

//           members: [],
//         },
//       ]);
//     }, 1000);
//   });
// };

const TouristHome = () => {
  const [labourCards, setLabourCards] = useState<TouristType[]>([]);

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem("token");
        const url =
          "https://mlha-e9f4fydheqbweudd.centralus-01.azurewebsites.net/api/Tourist/GetAllCustomerList";
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("response data is : ", response);
        const data = await getAllSubmittedTouristCards();
        setLabourCards(data);
      } catch (error) {
        console.error("Failed to fetch Tourist Details", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center mt-10 text-blue-600">Loading...</div>;
  }

  return (
    <div className="p-4">
      {labourCards.length === 0 ? (
        <div className="text-center text-gray-500">
          Tourist data not available .
        </div>
      ) : (
        labourCards.map((tourist, index) => (
          <TouristCardBrief key={index} tourist={tourist} />
        ))
      )}
    </div>
  );
};

export default TouristHome;
