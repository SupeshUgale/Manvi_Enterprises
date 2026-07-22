import React from "react";
import { motion } from "framer-motion";

/**
 * SectionHeader — Reusable section title block
 * @param {string} eyebrow - Small text above the title (e.g. "Featured Products")
 * @param {string} title - Main heading
 * @param {string} description - Optional subtext
 * @param {string} align - "center" | "left" (default: "center")
 * @param {boolean} light - Light variant for dark section backgrounds
 */
export default function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  light = false,
}) {
  const textAlign = align === "left" ? "text-left" : "text-center";
  const maxWidth = align === "left" ? "" : "max-w-2xl mx-auto";

  return (
    <motion.div
      className={`${textAlign} ${maxWidth} space-y-3`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {eyebrow && (
        <span
          className={`inline-block text-xs font-black uppercase tracking-[0.25em] stats-font ${
            light ? "text-[#D4A64A]" : "text-[#D4A64A]"
          }`}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={`text-3xl sm:text-4xl font-bold font-heading tracking-tight leading-tight ${
          light ? "text-white" : "text-[#1F2937] dark:text-white"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`text-sm leading-relaxed ${
            light ? "text-[#8FAE9D]" : "text-[#4B5563] dark:text-[#9CA3AF]"
          }`}
        >
          {description}
        </p>
      )}
    </motion.div>
  );
}
