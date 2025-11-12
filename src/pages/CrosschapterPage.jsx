import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";

import CrosschapterLayer from "../components/CrosschapterLayer";

const CrosschapterPage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Cross Chapter List"  />

        {/* RoleAccessLayer */}
        <CrosschapterLayer />

      </MasterLayout>

    </>
  );
};

export default CrosschapterPage;
