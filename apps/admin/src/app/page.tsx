export default function AdminHome() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          RunDay Admin
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Event Management Dashboard
        </p>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Coming Soon</h2>
          <p className="text-gray-600">
            Admin dashboard for managing running events, participants, and results.
          </p>
        </div>
      </div>
    </div>
  );
}
