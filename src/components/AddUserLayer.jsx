import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { toast } from "react-toastify";
import loginApiProvider from "../services/login";
import { IMAGE_BASE_URL } from "../config";

const AddUserLayer = () => {
  const [userData, setUserData] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    mobileNumber: "",
    email: "",
    image: "",
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreviewUrl(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("firstName", formData.firstName);
      formDataToSend.append("lastName", formData.lastName);
      formDataToSend.append("companyName", formData.companyName);
      formDataToSend.append("mobileNumber", formData.mobileNumber);
      formDataToSend.append("email", formData.email);

      if (selectedFile) {
        formDataToSend.append("profileImage", selectedFile);
      }

      const response = await loginApiProvider.updateMemberProfile(
        userData._id,
        formDataToSend
      );

      if (response?.status) {
        // Update state locally
        setUserData((prev) => ({
          ...prev,
          personalDetails: {
            ...prev.personalDetails,
            firstName: formData.firstName,
            lastName: formData.lastName,
            companyName: formData.companyName,
          },
          contactDetails: {
            ...prev.contactDetails,
            mobileNumber: formData.mobileNumber,
            email: formData.email,
          },
        }));

        toast.success("Profile updated successfully!");
        window.location.href = "/dashboard";
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  /** Fetch user data from API */
  useEffect(() => {
    const fetchUserData = async () => {
      const storedUserData = JSON.parse(localStorage.getItem("userData"));
      if (!storedUserData) return;

      const response = await loginApiProvider.getMemberById(storedUserData?.id);
      if (response?.status) {
        const data = response.response.data;
        setUserData(data);

        setFormData({
          firstName: data.personalDetails?.firstName || "",
          lastName: data.personalDetails?.lastName || "",
          companyName: data.personalDetails?.companyName || "",
          mobileNumber: data.contactDetails?.mobileNumber || "",
          email: data.contactDetails?.email || "",
          image: data.personalDetails?.profileImage || "",
        });

        if (data.profileImageUrl) {
          setImagePreviewUrl(data.profileImageUrl);
        }
      }
    };

    fetchUserData();
  }, []);

  if (!userData) return <div>Loading...</div>;

  // Profile Image Fallback Logic
  const profileImageUrl =
    imagePreviewUrl ||
    (formData.image
      ? `${IMAGE_BASE_URL}/${formData.image.docPath}/${formData.image.docName}`
      : userData.profileImageUrl || "");

  return (
    <div className="card h-100 p-0 radius-12">
      <div className="card-body p-24">
        <div className="row justify-content-center">
          <div className="col-xxl-6 col-xl-8 col-lg-10">
            <div className="card border">
              <div className="card-body">
                {/* Profile Image Upload */}
                <h6 className="text-md text-primary-light mb-16">
                  Profile Image
                </h6>
                <div className="mb-24 mt-16">
                  <div className="avatar-upload">
                    <div className="avatar-edit position-absolute bottom-0 end-0 me-24 mt-16 z-1 cursor-pointer">
                      <input
                        type="file"
                        id="imageUpload"
                        accept=".png, .jpg, .jpeg"
                        hidden
                        onChange={handleImageChange}
                      />
                      <label
                        htmlFor="imageUpload"
                        className="w-32-px h-32-px d-flex justify-content-center align-items-center bg-primary-50 text-primary-600 border border-primary-600 bg-hover-primary-100 text-lg rounded-circle"
                      >
                        <Icon icon="solar:camera-outline" className="icon" />
                      </label>
                    </div>
                    <div className="avatar-preview">
                      <div
                        id="imagePreview"
                        style={{
                          backgroundImage: profileImageUrl
                            ? `url(${profileImageUrl})`
                            : "none",
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                  {/* First Name */}
                  <div className="mb-20">
                    <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                      First Name <span className="text-danger-600">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control radius-8"
                      name="firstName"
                      value={formData.firstName}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^[a-zA-Z]*$/.test(value)) {
                          handleInputChange(e);
                        }
                      }}
                      pattern="[a-zA-Z]+"
                      title="Please enter only alphabets (no numbers or special characters)"
                      required
                    />
                    {formData.firstName &&
                      !/^[a-zA-Z]+$/.test(formData.firstName) && (
                        <div className="text-danger small mt-1">
                          Only alphabets are allowed
                        </div>
                      )}
                  </div>

                  {/* Last Name */}
                  <div className="mb-20">
                    <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                      Last Name <span className="text-danger-600">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control radius-8"
                      name="lastName"
                      value={formData.lastName}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^[a-zA-Z]*$/.test(value)) {
                          handleInputChange(e);
                        }
                      }}
                      pattern="[a-zA-Z]+"
                      title="Please enter only alphabets (no numbers or special characters)"
                      required
                    />
                    {formData.lastName &&
                      !/^[a-zA-Z]+$/.test(formData.lastName) && (
                        <div className="text-danger small mt-1">
                          Only alphabets are allowed
                        </div>
                      )}
                  </div>

                  {/* Company Name */}
                  <div className="mb-20">
                    <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                      Company Name <span className="text-danger-600">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control radius-8"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  {/* Mobile Number */}
                  <div className="mb-20">
                    <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                      Mobile Number
                    </label>
                    <input
                      type="text"
                      className="form-control radius-8"
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      disabled
                    />
                  </div>

                  {/* Email */}
                  <div className="mb-20">
                    <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                      Email <span className="text-danger-600">*</span>
                    </label>
                    <input
                      type="email"
                      className="form-control radius-8"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="d-flex align-items-center justify-content-center gap-3">
                    <button
                      type="button"
                      className="border border-danger-600 bg-hover-danger-200 text-danger-600 text-md px-56 py-11 radius-8"
                      onClick={() => (window.location.href = "/dashboard")}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary grip text-md px-56 py-12 radius-8"
                      disabled={
                        !formData.firstName ||
                        !/^[a-zA-Z]+$/.test(formData.firstName) ||
                        !formData.lastName ||
                        !/^[a-zA-Z]+$/.test(formData.lastName) ||
                        !formData.companyName ||
                        !formData.email
                      }
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUserLayer;
