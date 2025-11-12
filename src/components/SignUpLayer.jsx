// import { Icon } from "@iconify/react/dist/iconify.js";
// import React from "react";
// import { Link } from "react-router-dom";

// const SignUpLayer = () => {
//   return (
//     <section className='auth mainpage bg-base d-flex flex-wrap'>
//       <div className='auth-left d-lg-block d-none'>
//         <div className='d-flex d-none align-items-center flex-column h-100 justify-content-center'>
//           <img src='assets/images/auth/grip-signup.jpg' alt='' />
//         </div>
//       </div>
//       <div className='auth-right py-32 px-24 d-flex flex-column justify-content-center'>
//         <div className='insidebox max-w-464-px mx-auto w-100'>
//           <div>
//             <Link to='/' className='mb-40 max-w-150-px'>
//               <img src='assets/images/logo.png' alt='' />
//             </Link>
//             <h4 className='mb-12'>Sign Up to your Account</h4>
//             {/* <p className='mb-32 text-secondary-light text-lg'>
//               Welcome back! please enter your detail
//             </p> */}
//           </div>
//           <form action='#'>

//                <div className='icon-field mb-16'>
//               <span className='icon top-50 translate-middle-y'>
//                 <Icon icon='f7:person' />
//               </span>
//               <input
//                 type='text'
//                 className='form-control h-56-px bg-neutral-50 radius-12'
//                 placeholder='Username'
//               />
//             </div>
//                <div className='icon-field mb-16'>
//               <span className='icon top-50 translate-middle-y'>
//                 <Icon icon='f7:building' />
//               </span>
//               <input
//                 type='text'
//                 className='form-control h-56-px bg-neutral-50 radius-12'
//                 placeholder='Company Name'
//               />
//             </div>
//                  <div className='icon-field mb-16'>
//               <span className='icon top-50 translate-middle-y'>
//                 <Icon icon='f7:phone' />
//               </span>
//               <input
//                 type='text'
//                 className='form-control h-56-px bg-neutral-50 radius-12'
//                 placeholder='Mobile Number'
//               />
//             </div>
//             <div className='icon-field mb-16'>
//               <span className='icon top-50 translate-middle-y'>
//                 <Icon icon='mage:email' />
//               </span>
//               <input
//                 type='email'
//                 className='form-control h-56-px bg-neutral-50 radius-12'
//                 placeholder='Email'
//               />
//             </div>


//             <button
//               type='submit'
//               className='btn btn-primary grip text-sm btn-sm px-12 py-16 w-100 radius-12 mt-32'
//             >
//               {" "}
//              <Link to='/dashboard' className=' fw-semibold text-white'>
//                 Sign up
//                 </Link>
//             </button>


//             <div className='mt-32 text-center text-sm'>
//               <p className='mb-0'>
//                 Already have an account?{" "}
//                 <Link to='/' className='text-primary-600 fw-semibold'>
//                   Sign In
//                 </Link>
//               </p>
//             </div>
//           </form>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default SignUpLayer;

import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import registerApiProvider from "../services/register";
import { Country, State } from 'country-state-city';

const SignUpLayer = () => {
  const navigate = useNavigate();
  const [networkingOrg, setNetworkingOrg] = useState(""); // Initialize as empty string
  const [currentStep, setCurrentStep] = useState(1);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [zones, setZones] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [cids, setCids] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitResponce, setSubmitResponce] = useState(false);

  const [formData, setFormData] = useState({
    country: "",
    state: "",
    zone: "",
    chapter: "",
    cid: "",
    invitedBy: "",
    heardAbout: "",
    firstName: "",
    lastName: "",
    companyName: "",
    industry: "",
    category: "",
    dobDay: "",
    dobMonth: "",
    dobYear: "",
    previousMember: "yes",
    education: "",
    email: "",
    mobile: "",
    secondaryPhone: "",
    website: "",
    gstNumber: "",
    address1: "",
    address2: "",
    city: "",
    postalCode: "",
    businessDetails: "",
    businessYears: "",
    ref1FirstName: "",
    ref1LastName: "",
    ref1Business: "",
    ref1Phone: "",
    ref1Relationship: "",
    otherNetworkingOrgs: ""
  });

  const [checkboxes, setCheckboxes] = useState({
    check1: false, // For contact sharing info
    check2: false, // For contact sharing references
    check3: false, // Will attend meetings on time
    check4: false, // Will bring visitors
    check5: false, // Positive attitude
    check6: false, // Understands Contributors Win
    check7: false, // Will abide by policies
    check8: false  // Will contribute best ability
  });

  // Fetch countries on component mount
  useEffect(() => {
    const countryData = Country.getAllCountries().map(country => ({
      value: country.isoCode,
      label: country.name
    }));
    setCountries(countryData);
  }, []);

  // Fetch states when country changes
  useEffect(() => {
    if (formData.country) {
      const stateData = State.getStatesOfCountry(formData.country).map(state => ({
        value: state.isoCode,
        label: state.name
      }));
      setStates(stateData);
      setFormData(prev => ({ ...prev, state: "", zone: "", chapter: "", cid: "" }));
      setZones([]);
      setChapters([]);
      setCids([]);
    }
  }, [formData.country]);

  // Fetch zones when state changes
  useEffect(() => {
    if (formData.state) {
      const fetchZones = async () => {
        try {
          const response = await registerApiProvider.getZonesByState(formData.state);
          if (response.status) {
            setZones(response.response.data);
          }
        } catch (error) {
          toast.error("Failed to fetch zones");
        }
      };
      fetchZones();
      setFormData(prev => ({ ...prev, zone: "", chapter: "", cid: "" }));
      setChapters([]);
      setCids([]);
    }
  }, [formData.state]);

  // Fetch chapters when zone changes
  useEffect(() => {
    if (formData.zone) {
      const fetchChapters = async () => {
        try {
          const response = await registerApiProvider.getChaptersByZone(formData.zone);
          if (response.status) {
            setChapters(response.response.data);
          }
        } catch (error) {
          toast.error("Failed to fetch chapters");
        }
      };
      fetchChapters();
      setFormData(prev => ({ ...prev, chapter: "", cid: "" }));
      setCids([]);
    }
  }, [formData.zone]);

  // Fetch CID when chapter changes
  useEffect(() => {
    if (formData.chapter && chapters.length) {
      const selectedChapter = chapters.find(ch => ch._id === formData.chapter);
      console.log(selectedChapter, "selectedChapter");

      if (selectedChapter && selectedChapter.cidId) {
        setCids([{
          value: selectedChapter.cidId._id,
          label: selectedChapter.cidId.name
        }]);
        setFormData(prev => ({ ...prev, cid: selectedChapter.cidId._id }));
      }
    }
  }, [formData.chapter, chapters]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (e) => {
    const { id, checked } = e.target;
    setCheckboxes((prev) => ({
      ...prev,
      [id]: checked,
    }));
  };

  const allChecked = Object.values(checkboxes).every(Boolean);
  console.log(allChecked, "allChecked");


  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {

    const termsCheckboxes = ['check3', 'check4', 'check5', 'check6', 'check7', 'check8'];
    const allTermsChecked = termsCheckboxes.every(id => checkboxes[id]);
    // if (!allChecked) {
    //   toast.error("Please accept all terms and conditions");
    //   return;
    // }
    if (!allTermsChecked) {
      toast.error("Please accept all terms and conditions");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        chapterInfo: {
          countryName: countries.find(c => c.value === formData.country)?.label || "",
          stateName: states.find(s => s.value === formData.state)?.label || formData.state,
          zoneId: formData.zone,
          chapterId: formData.chapter,
          CIDId: formData.cid,
          whoInvitedYou: formData.invitedBy,
          howDidYouHearAboutGRIP: formData.heardAbout
        },
        personalDetails: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          companyName: formData.companyName,
          industry: formData.industry,
          categoryRepresented: formData.category,
          dob: `${formData.dobYear}-${formData.dobMonth}-${formData.dobDay}`,
          previousMember: formData.previousMember,
          isOtherNetworkingOrgs: networkingOrg === "yes",
          otherNetworkingOrgs: networkingOrg === "yes" ? formData.otherNetworkingOrgs : "",
          education: formData.education
        },
        businessAddress: {
          addressLine1: formData.address1,
          addressLine2: formData.address2,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode
        },
        contactDetails: {
          email: formData.email,
          mobileNumber: formData.mobile,
          secondaryPhone: formData.secondaryPhone,
          website: formData.website,
          gstNumber: formData.gstNumber
        },
        businessDetails: {
          businessDescription: formData.businessDetails,
          yearsInBusiness: formData.businessYears
        },
        businessReferences: [
          {
            firstName: formData.ref1FirstName,
            lastName: formData.ref1LastName,
            businessName: formData.ref1Business,
            phoneNumber: formData.ref1Phone,
            relationship: formData.ref1Relationship,
            contactSharingGRIP: checkboxes.check1,
            contactSharingGRIPReferences: checkboxes.check2
          }
        ],
        termsAndCertifications: {
          willAttendMeetingsOnTime: checkboxes.check3,
          willBringVisitors: checkboxes.check4,
          willDisplayPositiveAttitude: checkboxes.check5,
          understandsContributorsWin: checkboxes.check6,
          willAbideByPolicies: checkboxes.check7,
          willContributeBestAbility: checkboxes.check8
        }
      };

      console.log("Submitting payload:", payload);
      const response = await registerApiProvider.registerForm(payload);
      console.log(response, "response");

      if (response && response.status) {
        setSubmitResponce(true);
        setTimeout(() => {
          setSubmitResponce(false);
          navigate('/');
        }, 3000);
      }
    } catch (error) {
      toast.error(error.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  console.log(networkingOrg, "networkingOrg");


  return (
    <section className='membership-form-areaa  p-50 auth bg-base d-flex flex-wrap'
      style={{ backgroundImage: "linear-gradient(90deg, #c0222121 0%, #fafbff 100%)" }}

    >
      <div className='container'>
        <div className="row">
          <div className='col-md-2'></div>
          <div className='col-md-8'>
            <div>
              <Link to='/' className='mb-20 max-w-150-px'>
                <img src='assets/images/logo.png' alt='' />
              </Link>
              <h4 className='mb-40 associate-title'>Associate Membership Application</h4>
            </div>

            <div className='card'>
              <div className='card-body'>
                <div className='form-wizard'>
                  <form>
                    {/* Form Wizard Steps */}
                    <div className='form-wizard-header overflow-x-auto scroll-sm pb-8 my-32'>
                      <ul className='list-unstyled form-wizard-list style-two'>
                        {/* Step indicators */}
                        {[1, 2, 3, 4].map((step) => (
                          <li
                            key={step}
                            className={`form-wizard-list__item
                              ${currentStep > step && "activated"}
                              ${currentStep === step && "active"}`}
                          >
                            <div className='form-wizard-list__line'>
                              <span className='count'>{step}</span>
                            </div>
                            <span className='text text-xs fw-semibold'>
                              {step === 1 && "Chapter Info"}
                              {step === 2 && "Personal Details"}
                              {step === 3 && "Business Details"}
                              {step === 4 && "Completed"}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Step 1: Chapter Info */}
                    <fieldset className={`wizard-fieldset ${currentStep === 1 && "show"}`}>
                      <div className='row gy-3'>
                        {/* New Country and State Fields */}
                        <div className="col-6">
                          <label className="form-label">Select Country</label>
                          <select
                            className="form-control form-select"
                            name="country"
                            value={formData.country}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="">Select Country</option>
                            {countries.map(country => (
                              <option key={country.value} value={country.value}>{country.label}</option>
                            ))}
                          </select>
                        </div>

                        <div className="col-6">
                          <label className="form-label">Select State</label>
                          <select
                            className="form-control form-select"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            disabled={!formData.country}
                            required
                          >
                            <option value="">Select State</option>
                            {states.map(state => (
                              <option key={state.value} value={state.value}>{state.label}</option>
                            ))}
                          </select>
                        </div>

                        <div className="col-6">
                          <label className="form-label">Select Zone</label>
                          <select
                            className="form-control form-select"
                            name="zone"
                            value={formData.zone}
                            onChange={handleInputChange}
                            disabled={!formData.state}
                            required
                          >
                            <option value="">Select Zone</option>
                            {zones.map(zone => (
                              <option key={zone._id} value={zone._id}>{zone.zoneName}</option>
                            ))}
                          </select>
                        </div>

                        <div className="col-6">
                          <label className="form-label">Chapter Name</label>
                          <select
                            className="form-control form-select"
                            name="chapter"
                            value={formData.chapter}
                            onChange={handleInputChange}
                            disabled={!formData.zone}
                            required
                          >
                            <option value="">Select Chapter</option>
                            {chapters.map(chapter => (
                              <option key={chapter._id} value={chapter._id}>{chapter.chapterName}</option>
                            ))}
                          </select>
                        </div>

                        <div className="col-6">
                          <label className="form-label">Chapter Induction Directors (CID)</label>
                          <select
                            className="form-control form-select"
                            name="cid"
                            value={formData.cid}
                            onChange={handleInputChange}
                            disabled
                            required
                          >
                            <option value="">Select CID</option>
                            {cids.map(cid => (
                              <option key={cid.value} value={cid.value}>{cid.label}</option>
                            ))}
                          </select>
                        </div>

                        <div className="col-6">
                          <label className="form-label">Who invited you?</label>
                          <input
                            type="text"
                            name="invitedBy"
                            value={formData.invitedBy}
                            onChange={handleInputChange}
                            className="form-control"
                          />
                        </div>

                        <div className="col-6">
                          <label className="form-label">How did you hear about GRIP?</label>
                          <select
                            className="form-control form-select"
                            name="heardAbout"
                            value={formData.heardAbout}
                            onChange={handleInputChange}
                          >
                            <option value="">Select an option</option>
                            <option value="Online">Online</option>
                            <option value="Facebook">Facebook</option>
                            <option value="Instagram">Instagram</option>
                            <option value="Friends">Friends</option>
                            <option value="WhatsApp">WhatsApp</option>
                            <option value="Email">Email</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>

                        <div className='form-group text-end'>
                          <button
                            onClick={nextStep}
                            type='button'
                            className='form-wizard-next-btn btn btn-primary grip px-32'
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    </fieldset>

                    {/* Step 2: Personal Details */}
                    <fieldset className={`wizard-fieldset ${currentStep === 2 && "show"}`}>
                      <div className="row gy-3 mb-5">
                        <div className="col-6">
                          <label className="form-label">First Name</label>
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className="form-control"
                            required
                          />
                        </div>

                        <div className="col-6">
                          <label className="form-label">Last Name</label>
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className="form-control"
                            required
                          />
                        </div>

                        <div className="col-6">
                          <label className="form-label">Company Name</label>
                          <input
                            type="text"
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleInputChange}
                            className="form-control"
                            required
                          />
                        </div>

                        <div className="col-6">
                          <label className="form-label">Industry</label>
                          <input
                            type="text"
                            name="industry"
                            value={formData.industry}
                            onChange={handleInputChange}
                            className="form-control"
                            required
                          />
                        </div>

                        <div className="col-6">
                          <label className="form-label">Category You Represent</label>
                          <input
                            type="text"
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className="form-control"
                            required
                          />
                        </div>

                        <div className="col-6">
                          <label className="form-label">Date of Birth:</label>
                          <div className="d-flex gap-2">
                            {/* Day Dropdown */}
                            <select
                              name="dobDay"
                              value={formData.dobDay}
                              onChange={handleInputChange}
                              className="form-control form-select"
                              required
                            >
                              <option value="">Day</option>
                              {[...Array(31)].map((_, i) => (
                                <option key={i + 1} value={i + 1}>{i + 1}</option>
                              ))}
                            </select>

                            {/* Month Dropdown */}
                            <select
                              name="dobMonth"
                              value={formData.dobMonth}
                              onChange={handleInputChange}
                              className="form-control form-select"
                              required
                            >
                              <option value="">Month</option>
                              {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((month, i) => (
                                <option key={i + 1} value={i + 1}>{month}</option>
                              ))}
                            </select>

                            {/* Year Dropdown */}
                            <select
                              name="dobYear"
                              value={formData.dobYear}
                              onChange={handleInputChange}
                              className="form-control form-select"
                              required
                            >
                              <option value="">Year</option>
                              {Array.from({ length: 100 }, (_, i) => {
                                const year = new Date().getFullYear() - i;
                                return <option key={year} value={year}>{year}</option>;
                              })}
                            </select>
                          </div>
                        </div>

                        <div className="col-12">
                          <label className="form-label">Have you or your company ever been a member of GRIP chapter?</label>
                          <select
                            className="form-control form-select"
                            name="previousMember"
                            value={formData.previousMember}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                          </select>
                        </div>

                        <div className={networkingOrg === "yes" ? "col-6" : "col-12"}>
                          <label className="form-label">
                            Do you belong to any other networking organisations?
                          </label>
                          <select
                            className="form-select"
                            value={networkingOrg}
                            onChange={(e) => {
                              setNetworkingOrg(e.target.value);
                              if (e.target.value !== "yes") {
                                setFormData({ ...formData, otherNetworkingOrgs: "" });
                              }
                            }}
                            required
                          >
                            <option value="">Select</option>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                          </select>
                        </div>

                        {networkingOrg === "yes" && (
                          <div className="col-6">
                            <label className="form-label">Please specify the other networking organisations</label>
                            <input
                              type="text"
                              name="otherNetworkingOrgs"
                              value={formData.otherNetworkingOrgs}
                              onChange={handleInputChange}
                              className="form-control"
                              required
                            />
                          </div>
                        )}

                        <div className="col-12">
                          <label className="form-label">Education</label>
                          <select
                            className="form-control form-select"
                            name="education"
                            value={formData.education}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="">Select Education</option>
                            <option value="High School">High School</option>
                            <option value="Diploma">Diploma in Business</option>
                            <option value="Bachelor">Bachelor's Degree</option>
                            <option value="MBA">MBA / Master's in Business</option>
                            <option value="Professional Degree">Professional Degree</option>
                            <option value="Entrepreneurship Certificate">Entrepreneurship Certificate</option>
                            <option value="Others">Others</option>
                          </select>
                        </div>
                      </div>

                      <h6 className='text-md text-neutral-500'>
                        <b>Contact Details</b>
                      </h6>

                      <div className="row gy-3">
                        <div className="col-4">
                          <label className="form-label">Email</label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="form-control"
                            required
                          />
                        </div>

                        <div className="col-4">
                          <label className="form-label">Mobile Number</label>
                          <input
                            type="tel"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleInputChange}
                            className="form-control"
                            required
                          />
                        </div>

                        <div className="col-4">
                          <label className="form-label">Secondary Phone</label>
                          <input
                            type="tel"
                            name="secondaryPhone"
                            value={formData.secondaryPhone}
                            onChange={handleInputChange}
                            className="form-control"
                          />
                        </div>

                        <div className="col-6">
                          <label className="form-label">Website</label>
                          <input
                            type="url"
                            name="website"
                            value={formData.website}
                            onChange={handleInputChange}
                            className="form-control"
                          />
                        </div>

                        <div className="col-6">
                          <label className="form-label">GST Number (Optional)</label>
                          <input
                            type="text"
                            name="gstNumber"
                            value={formData.gstNumber}
                            onChange={handleInputChange}
                            className="form-control"
                          />
                        </div>

                        <div className='form-group d-flex align-items-center justify-content-end gap-8 mt-5'>
                          <button
                            onClick={prevStep}
                            type='button'
                            className='form-wizard-previous-btn btn btn-neutral-500 border-neutral-100 px-32'
                          >
                            Back
                          </button>
                          <button
                            onClick={nextStep}
                            type='button'
                            className='form-wizard-next-btn btn btn-primary grip px-32'
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    </fieldset>

                    {/* Step 3: Business Details */}
                    <fieldset className={`wizard-fieldset ${currentStep === 3 && "show"}`}>
                      <h6 className='text-md text-neutral-500'><b>Business Address</b></h6>
                      <div className='row gy-3 mb-5'>
                        <div className="col-4">
                          <label className="form-label">Address Line 1</label>
                          <input
                            type="text"
                            name="address1"
                            value={formData.address1}
                            onChange={handleInputChange}
                            className="form-control"
                            required
                          />
                        </div>

                        <div className="col-4">
                          <label className="form-label">Address Line 2</label>
                          <input
                            type="text"
                            name="address2"
                            value={formData.address2}
                            onChange={handleInputChange}
                            className="form-control"
                          />
                        </div>

                        <div className="col-4">
                          <label className="form-label">State / Province</label>
                          <select
                            className="form-control form-select"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="">Select State</option>
                            {states.map(state => (
                              <option key={state.value} value={state.label}>{state.label}</option>
                            ))}
                          </select>
                        </div>

                        <div className="col-6">
                          <label className="form-label">City</label>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            className="form-control"
                            required
                          />
                        </div>

                        <div className="col-6">
                          <label className="form-label">Postal Code</label>
                          <input
                            type="text"
                            name="postalCode"
                            value={formData.postalCode}
                            onChange={handleInputChange}
                            className="form-control"
                            required
                          />
                        </div>
                      </div>

                      <h6 className='text-md text-neutral-500'><b>Your Business Details</b></h6>
                      <div className="row gy-3 mb-5">
                        <div className="col-lg-6">
                          <label className="form-label">Describe Your Business Details</label>
                          <textarea
                            name="businessDetails"
                            value={formData.businessDetails}
                            onChange={handleInputChange}
                            className="form-control"
                            rows={2}
                            cols={50}
                            required
                          />
                        </div>
                        <div className="col-lg-6">
                          <label className="form-label">How many years are you in the business?</label>
                          <select
                            className="form-control form-select"
                            name="businessYears"
                            value={formData.businessYears}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="" disabled>Select duration</option>
                            <option value="below_1_year">Below 1 year</option>
                            <option value="1_5_years">1 to 5 years</option>
                            <option value="6_10_years">6 to 10 years</option>
                            <option value="11_15_years">11 to 15 years</option>
                            <option value="above_15_years">Above 15 years</option>
                          </select>
                        </div>
                      </div>

                      <h6 className="card-title mb-0">Business References</h6>
                      <span>These references won't be used for promotion</span>
                      <div className="row gy-3">
                        <div className="col-4">
                          <label className="form-label">Ref 1: First Name</label>
                          <input
                            type="text"
                            name="ref1FirstName"
                            value={formData.ref1FirstName}
                            onChange={handleInputChange}
                            className="form-control"
                            required
                          />
                        </div>

                        <div className="col-4">
                          <label className="form-label">Ref 1: Last Name</label>
                          <input
                            type="text"
                            name="ref1LastName"
                            value={formData.ref1LastName}
                            onChange={handleInputChange}
                            className="form-control"
                            required
                          />
                        </div>

                        <div className="col-4">
                          <label className="form-label">Business Name</label>
                          <input
                            type="text"
                            name="ref1Business"
                            value={formData.ref1Business}
                            onChange={handleInputChange}
                            className="form-control"
                            required
                          />
                        </div>

                        <div className="col-6">
                          <label className="form-label">Phone</label>
                          <input
                            type="tel"
                            name="ref1Phone"
                            value={formData.ref1Phone}
                            onChange={handleInputChange}
                            className="form-control"
                            required
                          />
                        </div>

                        <div className="col-6 mb-20">
                          <label className="form-label">Relationship</label>
                          <input
                            type="text"
                            name="ref1Relationship"
                            value={formData.ref1Relationship}
                            onChange={handleInputChange}
                            className="form-control"
                            required
                          />
                        </div>

                        <div className="col-12 businessdetail mb-5">
                          <div className="form-check style-check d-flex align-items-center mb-10">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="check1"
                              checked={checkboxes.check1}
                              onChange={handleCheckboxChange}
                            />
                            <label className="form-check-label" htmlFor="check1">
                              I have/will inform the above contacts that I'm sharing their info with GRIP.
                            </label>
                          </div>

                          <div className="form-check style-check d-flex align-items-center">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="check2"
                              checked={checkboxes.check2}
                              onChange={handleCheckboxChange}
                            />
                            <label className="form-check-label" htmlFor="check2">
                              I have/will inform the above contacts that I am sharing their information with GRIP for the purpose of references
                            </label>
                          </div>
                        </div>

                        <div className='form-group d-flex align-items-center justify-content-end gap-8 mt-3'>
                          <button
                            onClick={prevStep}
                            type='button'
                            className='form-wizard-previous-btn btn btn-neutral-500 border-neutral-100 px-32'
                          >
                            Back
                          </button>
                          <button
                            onClick={nextStep}
                            type='button'
                            className='form-wizard-next-btn btn btn-primary grip px-32'
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    </fieldset>

                    {/* Step 4: Terms and Conditions */}
                    <fieldset className={`wizard-fieldset ${currentStep === 4 && "show"}`}>
                      {!submitResponce && (
                        <>
                          <h6 className="card-title mb-0">Terms and Conditions</h6>
                          <div className="row gy-3 pt-3 pb-5">
                            <div className="col-12 pb-30">
                              {/* // Update the terms and conditions checkboxes rendering */}
                              {Object.entries({
                                check3: "I will be able to attend our GRIP weekly meetings on time.",
                                check4: "I will be able to bring visitors to this GRIP chapter meetings.",
                                check5: "I will always display a positive attitude.",
                                check6: "I understand that 'Contributors Win'™",
                                check7: "I will abide by the policies of GRIP.",
                                check8: "I will contribute to the best of my knowledge & ability.",
                              }).map(([id, label]) => (
                                <div className="form-check style-check d-flex align-items-center" key={id}>
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id={id}
                                    onChange={handleCheckboxChange}
                                    checked={checkboxes[id]}
                                  />
                                  <label className="form-check-label" htmlFor={id}>{label}</label>
                                </div>
                              ))}
                            </div>
                          </div>

                        </>
                      )}

                      {allChecked && submitResponce && (
                        <div className='text-center mb-40'>
                          <img
                            src='assets/images/gif/success-img3.gif'
                            alt=''
                            className='gif-image mb-24'
                          />
                          <h6 className='text-md text-neutral-600'>Congratulations</h6>
                          <p className='text-neutral-400 text-sm mb-0'>
                            Well done! You have successfully completed.
                          </p>
                        </div>
                      )}

                      <div className='form-group d-flex align-items-center justify-content-end mt-5 gap-8'>
                        <button
                          onClick={prevStep}
                          type='button'
                          className='form-wizard-previous-btn btn btn-neutral grip-black border-neutral-100 px-32'
                        >
                          Back
                        </button>
                        <button
                          onClick={handleSubmit}
                          type='button'
                          className='form-wizard-submit btn btn-primary grip px-32'
                          disabled={!allChecked || loading}
                        >
                          {loading ? "Submitting..." : "Submit"}
                        </button>
                      </div>
                    </fieldset>

                    {/* Step 4: Terms and Conditions */}
                    {/* <fieldset className={`wizard-fieldset ${currentStep === 4 && "show"}`}>

                      <div className='form-group d-flex align-items-center justify-content-end mt-5 gap-8'>
                        <button
                          onClick={prevStep}
                          type='button'
                          className='form-wizard-previous-btn btn btn-neutral grip-black border-neutral-100 px-32'
                        >
                          Back
                        </button>
                        <button
                          onClick={handleSubmit}
                          type='button'
                          className='form-wizard-submit btn btn-primary grip px-32'
                          disabled={!allChecked || loading}
                        >
                          {loading ? "Submitting..." : "Submit"}
                        </button>
                      </div>
                    </fieldset> */}
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className='col-md-2'></div>
        </div>
      </div>
    </section>
  );
};

export default SignUpLayer;

