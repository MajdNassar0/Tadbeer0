import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import StarRating from "../../../components/UI/StarRating";
import Skeleton from "../../../components/UI/Skeleton";

const ReviewsTab = ({ reviews = [], rating = 0, reviewsCount = 0, loading }) => (
  <div>
    <div className="flex items-center gap-1.5 mb-6">
      {loading ? <Skeleton className="h-8 w-24"/> : (
        <>
          <span className="text-2xl font-black text-gray-800">{rating}</span>
          <div className="flex flex-col">
            <StarRating rating={rating} size={13}/>
            <span className="text-xs text-gray-400">{reviewsCount} تقييم</span>
          </div>
        </>
      )}
    </div>

    {loading ? (
      <div className="flex flex-col gap-3">
        {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl"/>)}
      </div>
    ) : reviews.length === 0 ? (
      <div className="text-center py-12">
        <Star size={28} className="mx-auto text-gray-200 mb-2"/>
        <p className="text-sm text-gray-400">لا توجد تقييمات بعد</p>
      </div>
    ) : (
      <div className="flex flex-col gap-3">
        {reviews.map((r, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-bold text-gray-700">{r.name || r.userName}</span>
              <StarRating rating={r.rating} size={12}/>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">{r.comment}</p>
          </motion.div>
        ))}
      </div>
    )}
  </div>
);

export default ReviewsTab;