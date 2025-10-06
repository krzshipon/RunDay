export default function UserHome() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-4xl font-bold text-blue-900 mb-4">
          RunDay
        </h1>
        <p className="text-lg text-blue-700 mb-8">
          Your Running Journey Starts Here
        </p>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Coming Soon</h2>
          <p className="text-gray-600">
            Discover running events, register for races, and track your progress.
          </p>
        </div>
      </div>
    </div>
  );
}
