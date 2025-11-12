import { Icon } from '@iconify/react/dist/iconify.js';
import React from 'react';
import { Link } from 'react-router-dom';
 import { useEffect } from "react";

const CrosschapterLayer = () => {




    const members = [
        {
            name: "David Murugeasan",
            category: "Real Estate Services | Real Estate Services (Other)",
            chapter: "Grip Aram",
             photo: "assets/images/nft/creator-img5.png"
        },
        {
            name: "Deepika Sabapathi",
            category: "Manufacturing | Manufacturing (Other)",
            chapter: "Grip Aram",
             photo: "assets/images/nft/creator-img5.png"
        },
        {
            name: "Dhilip Peter",
            category: "Computer & Programming | Computer Retailer",
            chapter: "GRIP Virutcham",
            photo: "assets/images/nft/creator-img5.png"
        },
        {
            name: "Dhivya Anandhan",
            category: "Travel | Tours/Tour Guide",
            chapter: " GRIP Virutcham",
             photo: "assets/images/nft/creator-img5.png"
        },

        {
            name: "Diwakar G",
            category: "Event Business Service | Events",
            chapter: "Grip Aram",
            photo: "assets/images/nft/creator-img5.png"
        },

        {
            name: "Harikrishnan G",
            category: "Security & Investigation | CCTV",
            chapter: " GRIP Madhuram",
           photo: "assets/images/nft/creator-img5.png"
        },

        {
            name: "Jayakumar j",
            category: "Computer & Programming | Computer Retailer",
            chapter: "GRIP Madhuram",
             photo: "assets/images/nft/creator-img5.png"
        },

        {
            name: "Hema Chandran",
            category: "Computer & Programming | Computer Retailer",
            chapter: "GRIP Kireedam",
            photo: "assets/images/nft/creator-img5.png"
        },

        {
            name: "Jagadesshwaran",
            category: "Computer & Programming | Computer Retailer",
            chapter: "GRIP Kireedam",
            photo: "assets/images/nft/creator-img5.png"
        },

        {
            name: "Nareshkumar",
            category: "Computer & Programming | Computer Retailer",
            chapter: "GRIP Kireedam",
           photo: "assets/images/nft/creator-img5.png"
        },

        {
            name: "Geethalakshmi",
            category: "Computer & Programming | Computer Retailer",
            chapter: "GRIP Aram",
            photo: "assets/images/nft/creator-img5.png"
        },

        {
            name: "Rajendra Babu",
            category: "Computer & Programming | Computer Retailer",
            chapter: "GRIP Kireedam",
            photo: "assets/images/nft/creator-img5.png"
        },
        // ... more members
    ];


useEffect(() => {
  document.body.classList.remove("modal-open");
  document.body.style.overflow = "auto";
  document.body.style.paddingRight = "";

  document.querySelectorAll(".modal-backdrop").forEach((el) => el.remove());
}, []);



    return (
        <>
            <div className="card h-100 m-30 radius-12">
                <div className="card-header py-16 px-24 d-flex m-auto align-items-center flex-wrap gap-3 justify-items-center">
                    <div className="d-flex align-items-center mb-3 flex-wrap gap-3">

                        <form className="navbar-search">
                            <form className='navbar-search'>
                                <input type='text' name='search' placeholder='Search' />
                                <Icon icon='ion:search-outline' className='icon' />
                            </form>
                            <Icon icon="ion:search-outline" className="icon" />
                        </form>


                        <div className="d-flex align-items-center justify-content-center gap-3 ">

                            <button
                                type="submit"
                                className="btn btn-primary grip px-40 py-8 radius-8"
                            >
                                Search
                            </button>
                            <button
                                type="button"
                                className="btn btn-outline-grip px-40 py-8 radius-8"
                                data-bs-dismiss="modal"
                            >
                                Reset
                            </button>
                        </div>

                    </div>

                </div>
                <div className="card-body mt-40 p-24">

                    <div className="row gy-4">
                        <div className="col-xxl-12">
                            <div className="row gy-4">

                                <div className='col-md-1'></div>

                                {/* Right Stats */}
                                <div className='col-md-10'>
                                    <div className="row g-4">
                                        {members.map((member, index) => (
                                            <div className="col-sm-6 col-md-4 col-lg-4" key={index}>
                                                <div className="card p-3 bg-grey d-flex flex-row align-items-center gap-3 radius-16 shadow-sm h-100">
                                                    <img
                                                        src={member.photo || '/default-avatar.png'}
                                                        alt={member.name}
                                                        className="rounded-circle"
                                                        style={{ width: "60px", height: "60px", objectFit: "cover" }}
                                                    />
                                                    <div className="flex-grow-1">
                                                        <h6 className="mb-1 fw-bold text-danger">{member.name}</h6>
                                                        <div className="small text-muted">{member.category}</div>
                                                        <div className="small text-danger mt-1">{member.chapter}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                </div>
                            </div> {/* row gy-4 */}
                        </div> {/* col-xxl-8 */}
                    </div>

                </div>
            </div>

        </>

    );
};

export default CrosschapterLayer;