import StarIcon  from "./starIcon";
function RatingBadge({ rating }) {
  const color =
    rating >= 4.5 ? "bg-green-100 text-green-700" :
    rating >= 3.5 ? "bg-amber-100 text-amber-700" :
    "bg-red-100 text-red-700";
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${color}`}>
      <StarIcon/> {rating.toFixed(1)}
    </span>
  );
}

export default RatingBadge;