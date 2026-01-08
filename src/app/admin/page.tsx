const AdminDashboard = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stats Cards */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">Total Buildings</h2>
          <p className="text-3xl font-bold mt-2">125</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">Available</h2>
          <p className="text-3xl font-bold mt-2">80</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">Enquiries</h2>
          <p className="text-3xl font-bold mt-2">32</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">Blog Posts</h2>
          <p className="text-3xl font-bold mt-2">15</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
