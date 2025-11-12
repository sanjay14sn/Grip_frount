import React from 'react'
import SalesStatisticOne from './child/SalesStatisticOne';
import TotalSubscriberOne from './child/TotalSubscriberOne';
import UsersOverviewOne from './child/UsersOverviewOne';
import LatestRegisteredOne from './child/LatestRegisteredOne';
import TopPerformerOne from './child/TopPerformerOne';
import TopCountries from './child/TopCountries';
import GeneratedContent from './child/GeneratedContent';
import UnitCountOne from './child/UnitCountOne';

const DashBoardLayerOne = () => {

    return (
        <>
            {/* UnitCountOne */}
            {/* <UnitCountOne /> */}

            <section className="row gy-4">

                {/* SalesStatisticOne */}
                <SalesStatisticOne />




            </section>
        </>


    )
}

export default DashBoardLayerOne