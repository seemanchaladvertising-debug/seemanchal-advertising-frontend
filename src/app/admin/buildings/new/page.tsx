'use client';

import BuildingForm from '@/components/admin/BuildingForm';
import withAuth from '@/components/admin/withAuth';

const NewBuildingPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Add New Building</h1>
      <div className="bg-white p-8 rounded-lg shadow-md">
        <BuildingForm />
      </div>
    </div>
  );
};

export default withAuth(NewBuildingPage);
