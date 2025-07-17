import React from "react";

const CallToAction = () => {
  return (
    <section
      className="w-full bg-white border border-[#fff] rounded-[5px] overflow-hidden relative flex flex-col md:flex-row md:items-center md:justify-end md:h-[682px] md:max-w-[1440px] mx-auto"
    >
      {/* Görsel (Desktop solda, mobil altta) */}
      <div
        className="order-2 md:order-1 w-full md:w-[704px] md:h-full flex justify-center items-end relative md:absolute md:left-0 md:top-0 md:bottom-0 md:right-auto z-0"
      >
        <img
          src="/c2a.png"
          alt="asian-woman-man-with-winter-clothes"
          className="block w-full md:w-[725px] md:h-[774px] md:absolute object-cover select-none pointer-events-none"
          draggable={false}
        />
      </div>
      {/* Metin ve CTA */}
      <div
        className="order-1 md:order-2 flex flex-col justify-center md:items-start items-center px-4 md:px-0 py-14 md:py-0 md:pr-16 md:pl-0 w-full md:w-[573px] z-10"
      >
        {/* Tag */}
        <div className="mb-3">
          <span className="font-montserrat font-bold text-[16px] leading-6 tracking-[0.1px] text-[#BDBDBD] md:text-left text-center">
            SUMMER 2020
          </span>
        </div>
        {/* Başlık */}
        <h2 className="font-montserrat font-bold text-[32px] md:text-[40px] leading-[40px] md:leading-[50px] tracking-[0.2px] text-[#252B42] md:text-left text-center mb-4">
          Part of the <br className="md:hidden" /> Neural Universe
        </h2>
        {/* Açıklama */}
        <p className="font-montserrat font-normal text-[18px] md:text-[20px] leading-[28px] md:leading-[30px] tracking-[0.2px] text-[#737373] md:text-left text-center mb-8 md:mb-10 max-w-[376px]">
          We know how large objects will act, but things on a small scale.
        </p>
        {/* CTA butonları */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-2 md:w-[339px] w-full justify-center md:justify-start">
          <button
            className="font-montserrat font-bold text-[14px] leading-[22px] tracking-[0.2px] bg-[#2DC071] text-white rounded-[5px] px-10 py-3 md:w-[151px] md:h-[52px] w-full md:w-auto transition hover:bg-[#27a15e]"
          >
            BUY NOW
          </button>
          <button
            className="font-montserrat font-bold text-[14px] leading-[22px] tracking-[0.2px] border border-[#2DC071] text-[#2DC071] rounded-[5px] px-10 py-3 md:w-[171px] md:h-[52px] w-full md:w-auto transition hover:bg-[#f0fff7]"
          >
            READ MORE
          </button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
