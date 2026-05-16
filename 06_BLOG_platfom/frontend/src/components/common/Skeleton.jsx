import React from 'react';

export const BlogCardSkeleton = () => (
  <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 overflow-hidden">
    <div className="h-56 w-full rounded-3xl bg-slate-100 animate-pulse mb-8" />
    <div className="space-y-4">
      <div className="h-4 bg-slate-100 animate-pulse w-1/4 rounded-full" />
      <div className="h-8 bg-slate-100 animate-pulse w-full rounded-2xl" />
      <div className="h-8 bg-slate-100 animate-pulse w-3/4 rounded-2xl" />
      <div className="h-4 bg-slate-100 animate-pulse w-full rounded-full" />
      <div className="h-4 bg-slate-100 animate-pulse w-2/3 rounded-full" />
      <div className="flex gap-3 mt-6">
        <div className="h-6 bg-slate-100 animate-pulse w-20 rounded-lg" />
        <div className="h-6 bg-slate-100 animate-pulse w-20 rounded-lg" />
      </div>
    </div>
  </div>
);

export const BlogDetailSkeleton = () => (
  <div className="max-w-4xl mx-auto px-8 py-24 space-y-10">
    <div className="h-10 bg-slate-100 animate-pulse w-32 rounded-full" />
    <div className="h-16 bg-slate-100 animate-pulse w-full rounded-[2rem]" />
    <div className="h-16 bg-slate-100 animate-pulse w-3/4 rounded-[2rem]" />
    <div className="flex items-center gap-4">
      <div className="h-14 w-14 bg-slate-100 animate-pulse rounded-full" />
      <div className="space-y-3 flex-1">
        <div className="h-4 bg-slate-100 animate-pulse w-48 rounded-full" />
        <div className="h-3 bg-slate-100 animate-pulse w-32 rounded-full" />
      </div>
    </div>
    <div className="h-[500px] w-full bg-slate-100 animate-pulse rounded-[3rem]" />
    <div className="space-y-4">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="h-4 bg-slate-100 animate-pulse rounded-full" style={{ width: `${Math.random() * 30 + 70}%` }} />
      ))}
    </div>
  </div>
);

export const DashboardStatSkeleton = () => (
  <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 space-y-4">
    <div className="h-14 w-14 bg-slate-50 rounded-2xl animate-pulse" />
    <div className="h-10 bg-slate-100 animate-pulse w-1/2 rounded-xl" />
    <div className="h-4 bg-slate-50 animate-pulse w-3/4 rounded-full" />
  </div>
);