//Burası Team Page 
import React from "react";
import team from "../data/team";

const TeamPage = () => {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center px-0 sm:px-0 py-[45px] sm:py-[112px] gap-[60px] sm:gap-[48px] w-full">
      {/* Başlık ve açıklama */}
      <div className="flex flex-col items-center w-[315px] sm:w-[864px] h-[100px] sm:h-[100px] gap-[10px] mb-4">
        <h2 className="font-bold font-['Montserrat'] text-[40px] leading-[50px] text-center tracking-[0.2px] text-[#252B42] w-full sm:w-[316px]">Meet Our Team</h2>
        <p className="font-normal font-['Montserrat'] text-[14px] leading-[20px] text-center tracking-[0.2px] text-[#737373] w-full sm:w-[469px]">
          Problems trying to resolve the conflict between the two major realms of Classical physics: Newtonian mechanics
        </p>
      </div>

      {/* Takım üyeleri */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-[30px] w-[241px] sm:w-[1049px]">
        {team.map((member) => (
          <div key={member.id}
            className="flex flex-col items-center w-[238px] sm:w-[240px] h-[423px] rounded-[5px] bg-white shadow-sm">
            <div className="w-[240px] h-[333px] relative overflow-hidden rounded-t-[5px]">
              <img
                src={member.imgUrl}
                alt={member.name}
                className="object-cover w-full h-full absolute left-0 top-0"
                loading="lazy"
              />
            </div>
            <div className="flex flex-col items-start sm:items-start px-0 sm:px-0 py-[15px] gap-[10px] w-[237px] h-[90px]">
              <h5 className="font-normal font-['Montserrat'] text-[20px] leading-[30px] tracking-[0.2px] text-[#252B42] text-center sm:text-left">
                {member.name}
              </h5>
              <h6 className="font-normal font-['Montserrat'] text-[14px] leading-[20px] tracking-[0.2px] text-[#737373] text-center sm:text-left">
                {member.title}
              </h6>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamPage;