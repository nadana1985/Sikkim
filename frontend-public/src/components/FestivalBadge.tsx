interface FestivalBadgeProps {
  isUpcoming: boolean;
}

export default function FestivalBadge({ isUpcoming }: FestivalBadgeProps) {
  return (
    <div className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium text-white">
      {isUpcoming ? (
        <span className="bg-green-500">Upcoming</span>
      ) : (
        <span className="bg-gray-500">Past</span>
      )}
    </div>
  );
}
