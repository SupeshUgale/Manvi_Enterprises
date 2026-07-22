import React from "react";

/**
 * ProductCardSkeleton — pulse loading placeholder for product cards
 */
export function ProductCardSkeleton() {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden w-full animate-pulse">
      {/* Image area */}
      <div className="bg-[#F2F4F3] h-52 w-full" />

      {/* Content area */}
      <div className="p-4 space-y-3">
        {/* Badge + category */}
        <div className="flex items-center gap-2">
          <div className="h-4 w-16 bg-[#F2F4F3] rounded-full" />
          <div className="h-4 w-20 bg-[#F2F4F3] rounded-full" />
        </div>

        {/* Title */}
        <div className="h-5 w-3/4 bg-[#F2F4F3] rounded-lg" />
        <div className="h-4 w-1/2 bg-[#F2F4F3] rounded-lg" />

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-3.5 h-3.5 bg-[#F2F4F3] rounded-full" />
            ))}
          </div>
          <div className="h-3 w-10 bg-[#F2F4F3] rounded" />
        </div>

        {/* Price */}
        <div className="flex items-center gap-3">
          <div className="h-6 w-20 bg-[#F2F4F3] rounded-lg" />
          <div className="h-4 w-14 bg-[#F2F4F3] rounded-lg" />
        </div>

        {/* Button */}
        <div className="h-9 w-full bg-[#F2F4F3] rounded-xl mt-2" />
      </div>
    </div>
  );
}

/**
 * ProductGridSkeleton — shows N product card skeletons in a grid
 */
export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(count)].map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * PageHeaderSkeleton — for page titles and descriptions
 */
export function PageHeaderSkeleton() {
  return (
    <div className="animate-pulse space-y-3 text-center">
      <div className="h-4 w-24 bg-[#F2F4F3] rounded-full mx-auto" />
      <div className="h-8 w-64 bg-[#F2F4F3] rounded-xl mx-auto" />
      <div className="h-4 w-80 bg-[#F2F4F3] rounded-lg mx-auto" />
    </div>
  );
}

export default ProductCardSkeleton;
