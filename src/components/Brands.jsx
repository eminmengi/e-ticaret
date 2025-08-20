import {
  FaHooli,
  FaLyft,
  FaPiedPiperHat,
  FaRedditAlien,
  FaStripe,
} from "react-icons/fa";
import { SiAmazonwebservices } from "react-icons/si";

export default function Brands() {
  return (
    <div className="bg-[#FAFAFA] w-full py-10">
      <div className="text-[#737373] w-[90vw] max-w-[1200px] mx-auto flex flex-col justify-around items-center md:flex-row gap-5">
        <FaHooli className="w-[150px] h-auto md:w-[100px]" />
        <FaLyft className="w-[150px] h-auto md:w-[100px]" />
        <FaPiedPiperHat className="w-[150px] h-auto md:w-[100px]" />
        <FaStripe className="w-[150px] h-auto md:w-[100px]" />
        <SiAmazonwebservices className="w-[150px] h-auto md:w-[100px]" />
        <FaRedditAlien className="w-[150px] h-auto md:w-[100px]" />
      </div>
    </div>
  );
}
