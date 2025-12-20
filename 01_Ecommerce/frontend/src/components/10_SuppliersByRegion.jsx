import React from 'react';
import { regions } from "../data/region.js";
export default function Regions() {
 
  return (
    <section className="bg-white py-10 px-4 md:px-12">
      <h1 className='font-bold text-2xl m-2 ml-[10rem]' >SuppliersByRegion</h1>
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        
       {regions.map(region => {
  const Icon = region.icon;
  return (
    <div key={region.id} className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition" >
      <Icon title={region.title} className="w-6 h-4 mt-1" />
      <h3 className=''>{region.title}</h3>
  
    </div>
  );
})}

      </div>
    </section>
  );
}
