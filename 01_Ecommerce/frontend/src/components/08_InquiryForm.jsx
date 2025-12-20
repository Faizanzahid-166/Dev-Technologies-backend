import React from 'react';

export default function InquiryForm() {
  return (
    <section className="bg-[#127FFF] text-white px-4 sm:px-6 md:px-12 py-10 hidden md:block">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        
        {/* Left: Text */}
        <div className="text-center md:text-left px-2">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-3 leading-snug">
            An easy way to send requests to all suppliers
          </h2>
          <p className="text-sm sm:text-base text-white/90 leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum.
          </p>
        </div>

        {/* Right: Form (hidden below 456px) */}
        <form className=" bg-white rounded-md p-4 sm:p-6 gap-4 text-gray-800 w-full max-w-md mx-auto md:mx-0">
          <input
            type="text"
            placeholder="What item you need?"
            className="w-full px-4 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <textarea
            rows="3"
            placeholder="Type more details"
            className="w-full px-4 py-2 text-sm border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
          ></textarea>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="number"
              placeholder="Quantity"
              className="w-full sm:flex-1 px-4 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <select className="w-full sm:w-32 px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400">
              <option>Pcs</option>
              <option>Kg</option>
              <option>Ton</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-[#127FFF] text-white py-2 px-4 rounded hover:bg-blue-700 transition text-sm"
          >
            Send inquiry
          </button>
        </form>
      </div>
    </section>
  );
}
