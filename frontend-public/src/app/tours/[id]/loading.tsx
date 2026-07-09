export default function TourLoading() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4" />
        <p className="text-white text-lg">Loading virtual tour...</p>
      </div>
    </div>
  );
}
