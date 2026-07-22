import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

/**
 * Breadcrumb component
 * @param {Array} items - Array of { label: string, href?: string }
 * The last item is always the current page (no link rendered)
 */
export default function Breadcrumb({ items = [] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-medium py-3">
      <Link
        to="/"
        className="flex items-center gap-1 text-[#8FAE9D] hover:text-[#2F5D50] transition-colors duration-200"
      >
        <Home className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Home</span>
      </Link>

      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <React.Fragment key={idx}>
            <ChevronRight className="w-3.5 h-3.5 text-[#E5E7EB] flex-shrink-0" />
            {isLast || !item.href ? (
              <span className="text-[#1F2937] font-semibold truncate max-w-[200px]">
                {item.label}
              </span>
            ) : (
              <Link
                to={item.href}
                className="text-[#8FAE9D] hover:text-[#2F5D50] transition-colors duration-200 truncate max-w-[150px]"
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
