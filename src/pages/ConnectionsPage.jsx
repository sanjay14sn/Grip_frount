import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";

import ConnectionsLayer from "../components/ConnectionsLayer";

const ConnectionsPage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Connections" />

        {/* RoleAccessLayer */}
        <ConnectionsLayer />

      </MasterLayout>

    </>
  );
};

export default ConnectionsPage;
