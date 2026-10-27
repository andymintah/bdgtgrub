export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      <div className="ml-4">
        <p className="text-lg font-medium text-gray-900">Finding the best options for you...</p>
        <p className="text-sm text-gray-600">This may take a few moments</p>
      </div>
    </div>
  );
}