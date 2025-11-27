import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import updateMemberProfile from "../services/login";
import loginApiProvider from "../services/login";

const AddUserLayer = () => {
const location = useLocation();
const isViewMode = location.state?.mode === "view";
  const inputDisabled = isViewMode;

  const { id } = useParams();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    personalDetails: {
      firstName: "",
      lastName: "",
      dob: "",
    },
    businessAddress: {
      addressLine1: "",
      addressLine2: "",
      state: "",
      city: "",
      postalCode: "",
    },
    contactDetails: {
      secondaryPhone: "",
      website: "",
    },
    businessDetails: {
      businessDescription: "",
      yearsInBusiness: "",
    },
  });

  // Fetch user data
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData) getMemberById(userData);
    console.log("userData._id", userData?.id);
  }, []);

  const getMemberById = async (userData) => {
    try {
      const res = await loginApiProvider.getMemberById(userData?.id);
      console.log("response123", res?.response?.data);

      if (res?.status && res.response?.data) {
        const d = res.response.data;

        setFormData({
          personalDetails: {
            firstName: d.personalDetails?.firstName || "",
            lastName: d.personalDetails?.lastName || "",
            companyName: d.personalDetails?.companyName || "",
            industry: d.personalDetails?.industry || "",
            dob: d.personalDetails?.dob?.split("T")[0] || "",
            categoryRepresented: d.personalDetails?.categoryRepresented || "",
            previouslyGRIPMember: !!d.personalDetails?.previouslyGRIPMember,
            isOtherNetworkingOrgs: !!d.personalDetails?.isOtherNetworkingOrgs,
            otherNetworkingOrgs: d.personalDetails?.otherNetworkingOrgs || "",
            education: d.personalDetails?.education || "",
            pins: Array.isArray(d.personalDetails?.pins)
              ? d.personalDetails.pins
              : [],
          },
          businessAddress: {
            addressLine1: d.businessAddress?.addressLine1 || "",
            addressLine2: d.businessAddress?.addressLine2 || "",
            state: d.businessAddress?.state || "",
            city: d.businessAddress?.city || "",
            postalCode: d.businessAddress?.postalCode || "",
          },
          contactDetails: {
            email: d.contactDetails?.email || "",
            mobileNumber: d.contactDetails?.mobileNumber || "",
            secondaryPhone: d.contactDetails?.secondaryPhone || "",
            website: d.contactDetails?.website || "",
          },
          businessDetails: {
            businessDescription: d.businessDetails?.businessDescription || "",
            yearsInBusiness: d.businessDetails?.yearsInBusiness || "",
          },
          businessReferences: d.businessReferences || [],
          chapterInfo: {
            countryName: d.chapterInfo?.countryName || "",
            stateName: d.chapterInfo?.stateName || "",
            zoneId: d.chapterInfo?.zoneId || { _id: "", zoneName: "" },
            chapterId: d.chapterInfo?.chapterId || { _id: "", chapterName: "" },
          },
          termsAndCertifications: {
            willAttendMeetingsOnTime:
              !!d.termsAndCertifications?.willAttendMeetingsOnTime,
            willBringVisitors: !!d.termsAndCertifications?.willBringVisitors,
            willDisplayPositiveAttitude:
              !!d.termsAndCertifications?.willDisplayPositiveAttitude,
            willRespectConfidentiality:
              !!d.termsAndCertifications?.willRespectConfidentiality,
          },
          status: d.status || "",
          role: d.role || "",
          type: d.type || "",
          isActive: d.isActive ?? true,
        });
      } else {
        toast.error(res.response?.message || "Failed to fetch member details");
      }
    } catch (error) {
      console.error("Failed to fetch member data:", error);
      toast.error("Error fetching member data");
    }
  };

  // 🧩 HANDLE INPUTS
  const handleInputChange = (e, section, field) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  // 🧩 HANDLE SUBMIT (Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // ✅ Get only the editable fields
      const payload = {
        personalDetails: {
          firstName: formData.personalDetails.firstName,
          lastName: formData.personalDetails.lastName,
          dob: formData.personalDetails.dob,
        },
        businessAddress: {
          addressLine1: formData.businessAddress.addressLine1,
          addressLine2: formData.businessAddress.addressLine2,
          state: formData.businessAddress.state,
          city: formData.businessAddress.city,
          postalCode: formData.businessAddress.postalCode,
        },
        contactDetails: {
          secondaryPhone: formData.contactDetails.secondaryPhone,
          website: formData.contactDetails.website,
        },
        businessDetails: {
          businessDescription: formData.businessDetails.businessDescription,
          yearsInBusiness: formData.businessDetails.yearsInBusiness,
        },
      };

      console.log("clean payload", payload);
      const storedUser = JSON.parse(localStorage.getItem("userData"));
      const userId = storedUser?.member?.id || storedUser?.id;

      // const { status, response } = await loginApiProvider.updateMemberProfile(id, payload);
      const { status, response } = await loginApiProvider.updateMemberProfile(
        userId,
        payload
      );

      if (status) {
        toast.success("Profile updated successfully!");
        navigate("/members");
      } else {
        toast.error(response?.message || "Failed to update profile");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while updating");
    } finally {
      setLoading(false);
    }
  };

  // 🧩 LOADING STATE
  if (loading) return <p className="text-center mt-4">Loading...</p>;

 return (
    <div className="col-lg-12">
      <form onSubmit={handleSubmit}>
        {/* Personal Details */}
        <div className="card mt-24">
          <div className="card-header">
            <h6 className="card-title mb-0">
              {isViewMode ? "View Personal Details" : "Personal Details"}
            </h6>
          </div>
          <div className="card-body">
            <div className="row gy-3">
              <div className="col-4">
                <label className="form-label">
                  First Name<span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  disabled={inputDisabled}
                  value={formData.personalDetails.firstName}
                  onChange={(e) =>
                    handleInputChange(e, "personalDetails", "firstName")
                  }
                />
              </div>

              <div className="col-4">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  className="form-control"
                  disabled={inputDisabled}
                  value={formData.personalDetails.lastName}
                  onChange={(e) =>
                    handleInputChange(e, "personalDetails", "lastName")
                  }
                />
              </div>

              <div className="col-4">
                <label className="form-label">Date of Birth</label>
                <input
                  type="date"
                  className="form-control"
                  disabled={inputDisabled}
                  value={formData.personalDetails.dob}
                  onChange={(e) =>
                    handleInputChange(e, "personalDetails", "dob")
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* Business Address */}
        <div className="card mt-24">
          <div className="card-header">
            <h6 className="card-title mb-0">
              {isViewMode ? "View Business Address" : "Business Address"}
            </h6>
          </div>

          <div className="card-body">
            <div className="row gy-3">
              {["addressLine1", "addressLine2", "state", "city", "postalCode"].map(
                (field) => (
                  <div key={field} className="col-4">
                    <label className="form-label">{field}</label>
                    <input
                      type="text"
                      className="form-control"
                      disabled={inputDisabled}
                      value={formData.businessAddress[field]}
                      onChange={(e) =>
                        handleInputChange(e, "businessAddress", field)
                      }
                    />
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* Contact Details */}
        <div className="card mt-24">
          <div className="card-header">
            <h6 className="card-title mb-0">
              {isViewMode ? "View Contact Details" : "Contact Details"}
            </h6>
          </div>

          <div className="card-body">
            <div className="row gy-3">
              {["secondaryPhone", "website"].map((field) => (
                <div key={field} className="col-6">
                  <label className="form-label">{field}</label>
                  <input
                    type="text"
                    className="form-control"
                    disabled={inputDisabled}
                    value={formData.contactDetails[field]}
                    onChange={(e) =>
                      handleInputChange(e, "contactDetails", field)
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Business Details */}
        <div className="card mt-24">
          <div className="card-header">
            <h5 className="card-title mb-0">
              {isViewMode ? "View Business Details" : "Your Business Details"}
            </h5>
          </div>

          <div className="card-body">
            <div className="row">
              <div className="col-lg-6">
                <label className="form-label">Describe Your Business Details</label>
                <textarea
                  className="form-control"
                  rows={2}
                  disabled={inputDisabled}
                  value={formData.businessDetails.businessDescription}
                  onChange={(e) =>
                    handleInputChange(
                      e,
                      "businessDetails",
                      "businessDescription"
                    )
                  }
                />
              </div>

              <div className="col-6">
                <label className="form-label">Years in Business</label>
                <select
                  className="form-control form-select"
                  disabled={inputDisabled}
                  value={formData.businessDetails.yearsInBusiness}
                  onChange={(e) =>
                    handleInputChange(e, "businessDetails", "yearsInBusiness")
                  }
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
          </div>
        </div>

        {/* Buttons - hidden in View Mode */}
        {!isViewMode && (
          <div className="d-flex align-items-center justify-content-end gap-3 mt-10">
            <button
              type="button"
              className="border border-danger-600 text-danger-600 bg-transparent hover:bg-danger-100 text-md px-56 py-11 radius-8"
              onClick={() => navigate("/dashboard")}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-primary-600 hover:bg-primary-700 text-white text-md px-56 py-12 radius-8 border-0"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </div>
        )}
      </form>

      <ToastContainer />
    </div>
  );
};

export default AddUserLayer;
