import React from "react";
import { Star } from "lucide-react"; // تأكد من استيراد أيقونة النجمة [cite: 3]

const StarRating = ({ rating, size = 14 }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        size={size}
        className={
          s <= Math.round(rating)
            ? "text-orange-400 fill-orange-400"
            : "text-gray-200 fill-gray-200"
        }
      />
    ))}
  </div>
);

export default StarRating;