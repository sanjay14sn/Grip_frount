import * as bootstrap from "bootstrap";
import React, { useEffect, useState, useRef } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import ReactApexChart from "react-apexcharts";
import useReactApexChart from "../../hook/useReactApexChart";
import { Link } from "react-router-dom";
import { Modal } from "bootstrap";
import { useNavigate } from "react-router-dom";
import formApiProvider from "../../services/formApi";
import loginApiProvider from "../../services/login";
import registerApiProvider from "../../services/register";
import topAchiverApi from "../../services/topAchiverApi";
import { IMAGE_BASE_URL } from "../../config";
import { toast, ToastContainer } from "react-toastify";
import "bootstrap-icons/font/bootstrap-icons.css";
import AchieverCarousel from "../../components/TopAchieversCarousel";
import ReferralApiProvider from "../../services/referralApi";


// import socketProvider from '../../services/socketProvider';

const SalesStatisticOne = () => {
  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("userDate"))
  );
  const [useCrossChapter, setUseCrossChapter] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState("");
  const [selectedMember, setSelectedMember] = useState({});
  const [members, setMembers] = useState(false);
  const [inviteByOPtions, setInviteByOPtions] = useState({});
  const [selectInviteBy, setSelectInviteBy] = useState({});
  const [photo, setPhoto] = useState(null);
  const [location, setLocation] = useState("");
  const [topic, setTopic] = useState("");
  const [date, setDate] = useState("");
  const [onToOneDatas, setOnToOneDatas] = useState([]);
  const [visitorsDatas, setVisitorsDatas] = useState([]);
  const [expectedVisitorsDatas, setExpectedVisitorsDatas] = useState([]);
  const [thankYouSlipDatas, setThankYouSlipDatas] = useState([]);
  const [referalDatas, setReferalDatas] = useState([]);
  const [selectedReferral, setSelectedReferral] = useState(null);
  const [thankyouReceivedDatas, setThankyouReceivedDatas] = useState([]);
  const [referalReceivedDatas, setReferalReceivedDatas] = useState([]);
  const [testimonialReceivedDatas, settestimonialReceivedDatas] = useState([]);
  const [testimonialGivenDatas, setTestimonialGivenDatas] = useState([]);
  // const [formCount, setFormCount] = useState({});
  const [meetingLocationType, setMeetingLocationType] = useState("");
  const [visitorName, setVisitorName] = useState("");
  const [company, setCompany] = useState("");
  const [category, setCategory] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [visitDate, setVisitDate] = useState("");
  const [amount, setAmount] = useState("");
  const [comments, setComments] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("this-Week");
  const [formCount, setFormCount] = useState(null);
  const [details, setdetails] = useState(false);
  const [ismemberDetails, setismemberDetails] = useState(false);
  const [memberList, setmemberList] = useState([]);
  const [inputValue, setInputvalue] = useState(null);
  const [errors, setErrors] = useState({});
  const [referalError, setRefferalFormErrors] = useState({});
  const [profilePercentage, setprofilePercentage] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);


  //
  // const [refGiven, setRefGiven] = useState([]);
  // const [loading, setLoading] = useState(false);
  // const [showRefPopup, setShowRefPopup] = useState(false);

  // const [selectedMember, setSelectedMember] = useState({});
  // const [showRefPopup, setShowRefPopup] = useState(false);
  // const [refGiven, setRefGiven] = useState([]);
  // const [loading, setLoading] = useState(false);

  const [isMemberDetails, setIsMemberDetails] = useState(false);
  // const [selectedMember, setSelectedMember] = useState({});
  const [showRefPopup, setShowRefPopup] = useState(false);
  const [refGiven, setRefGiven] = useState([]);
  const [loading, setLoading] = useState(false);

  const [refReceived, setRefReceived] = useState([]);
  const [showRefReceivedPopup, setShowRefReceivedPopup] = useState(false);

  const [showTestimonialGivenPopup, setShowTestimonialGivenPopup] =
    useState(false);
  const [showPopup, setShowPopup] = useState(false);


  const [showTestimonialReceivedPopup, setShowTestimonialReceivedPopup] =
    useState(false);
  // State for Visitor Popup
  const [showVisitorPopup, setShowVisitorPopup] = useState(false);
  const [showThankYouPopup, setShowThankYouPopup] = useState(false);
  const [showOneToOnePopup, setShowOneToOnePopup] = useState(false);

  const [topAchivers, setTopAchivers] = useState([]);
  const loadTopAchivers = async (chapterId) => {
    try {
      const responseResult = await topAchiverApi.getTopAchiver(chapterId);
      if (responseResult && responseResult.status) {
        let data = responseResult.data; // same style as your example
        console.log("topAchieversData", data);

        setTopAchivers(data || []);
      } else {
        console.error(responseResult.message);
      }
    } catch (error) {
      console.error("API ERROR:", error);
    }
  };

  useEffect(() => {
    const chapterId = userData?.chapterInfo?.chapterId?._id;
    if (chapterId) {
      loadTopAchivers(chapterId);
    }
  }, [userData?.chapterInfo?.chapterId?._id]);

  const handleMemberClick = (member) => {
    setSelectedMember(member);
    setIsMemberDetails(true);
    handleRefGivenClick(member._id);
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    const value = e.target.value;
    setSelectedFilter(value);
    getDashboardCounts(value);
  };

  const [formData, setFormData] = useState({
    selectedMember: "",
    selectedChapter: "",
    useCrossChapter: false,
    referralStatus: "",
    givenCard: "",
    toldThem: "",
    name: "",
    mobile: "",
    category: "",
    address: "",
    comments: "",
  });

  const [zones, setZones] = useState([]);
  const [chapter, setChapter] = useState([]);
  const [globalMembers, setGlobalMembers] = useState([]);
  const [member, setMember] = useState([]);
  const [upcomingMeetings, setupcomingMeetings] = useState([]);
  const [upcomingTrainings, setupcomingTrainings] = useState([]);

  // Sample data - in a real app, this would come from an API
  const [chapterList, setChapterList] = useState([]);
  const [upcomingEvents, setupcomingEvents] = useState([
    {
      _id: "32912097409714sasdada",
      eventname: "Chapter Meeting",
      amount: "3000",
      dateTime: "May 29, 2025 (7.05am)",
      place: "The Park Chennai, Nungambakkam, Chennai",
    },
    {
      _id: "32912097409714sasdada",
      eventname: "Chapter Meeting",
      amount: "3000",
      dateTime: "May 29, 2025 (7.05am)",
      place: "The Park Chennai, Nungambakkam, Chennai",
    },
    {
      _id: "32912097409714sasdada",
      eventname: "Chapter Meeting",
      amount: "3000",
      dateTime: "May 29, 2025 (7.05am)",
      place: "The Park Chennai, Nungambakkam, Chennai",
    },
    {
      _id: "32912097409714sasdada",
      eventname: "Chapter Meeting",
      amount: "3000",
      dateTime: "May 29, 2025 (7.05am)",
      place: "The Park Chennai, Nungambakkam, Chennai",
    },
  ]);
  // const [selectedMember, setSelectedMember] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  useEffect(() => {
    let userData = JSON.parse(localStorage.getItem("userData"));
    console.log(userData, "userData");
    if (userData) {
      getMemberById(userData);
      profileCompletionPercentage(userData?.id);
      console.log(userData, "testwert");
    }
  }, []);

  // ---------------- STATE ----------------
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });


  const [attendanceCounts, setAttendanceCounts] = useState({});
  const [oneToOneCounts, setOneToOneCounts] = useState({});
  const [referralCounts, setReferralCounts] = useState({});
  const [thankYouAmounts, setThankYouAmounts] = useState({});
  const [visitorCounts, setVisitorCounts] = useState({});

  const [testimonialCounts, setTestimonialCounts] = useState({});


  const paginatedMembers = userData ? [userData] : [];

  // ---------------- USE EFFECT ----------------
  useEffect(() => {
    fetchMembersWithAttendance()
  }, []);


  // ---------------- MAIN FUNCTION ----------------
  const fetchMembersWithAttendance = async () => {
    try {


      const [
        attendanceRes,
        oneToOneRes,
        referralRes,
        thankYouRes,
        visitorRes,
        testimonialRes,
      ] = await Promise.all([
        formApiProvider.getMembersAttendanceCount(),
        formApiProvider.getOneToOneCounts(),
        formApiProvider.getReferralCounts(),
        formApiProvider.getThankYouSlipAmounts(),
        formApiProvider.getVisitorCounts(),
        formApiProvider.getTestimonialCounts(),
      ]);

      if (attendanceRes?.success) setAttendanceCounts(attendanceRes.data);
      if (oneToOneRes?.success) setOneToOneCounts(oneToOneRes.data);
      if (referralRes?.success) setReferralCounts(referralRes.data);
      if (thankYouRes?.success) setThankYouAmounts(thankYouRes.data);
      if (visitorRes?.success) setVisitorCounts(visitorRes.data);
      if (testimonialRes?.success) setTestimonialCounts(testimonialRes.data);


    } catch (error) {
      console.error("Error fetching members and PALMS data:", error);
    }
  };

  const getMemberById = async (userData) => {
    const responceResult = await loginApiProvider.getMemberById(userData?.id);
    console.log(responceResult, "responceResult");
    if (responceResult && responceResult.status) {
      let data = responceResult?.response?.data;
      console.log("data123", data);
      setUserData(data);
    }
  };
  const profileCompletionPercentage = async (userData) => {
    try {
      setProfileLoading(true);
      const result = await loginApiProvider.profileCompletionPercentage(
        userData
      );
      setprofilePercentage(result?.response?.data?.profileCompletion || 0);
      console.log(result?.response?.data?.profileCompletion, "test33");
    } catch (error) {
      console.error("Error fetching profile completion:", error);
      setprofilePercentage(0);
    } finally {
      setProfileLoading(false);
    }
  };
  const getOneMonthBeforeToday = () => {
    const today = new Date();
    const oneMonthBefore = new Date(today.setMonth(today.getMonth() - 1));
    return oneMonthBefore.toISOString().split("T")[0];
  };

  // Helper functions for dates (already in your code)
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };
  const [dateRange, setDateRange] = useState({
    fromDate: getOneMonthBeforeToday(),
    toDate: getTodayDate(),
  });
  // Handler for date range changes
  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    setDateRange((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Modified API call functions to include date params
  const getOneTooneDatas = async () => {
    console.log(dateRange, "dateRange");

    const result = await formApiProvider.getOneToOneDatasById(
      dateRange.fromDate,
      dateRange.toDate
    );
    if (result && result.status) {
      setOnToOneDatas(result?.response?.data || []);
    }
  };

  const getVisitorDatas = async () => {
    const result = await formApiProvider.getVisitorsDatasById(
      dateRange.fromDate,
      dateRange.toDate
    );
    if (result && result.status) {
      setVisitorsDatas(result?.response?.data || []);
    }
  };

  // expectedvisitors function
  const getExpectedVisitorDatas = async () => {
    const chapterId =
      userData?.chapterInfo?.chapterId?._id || userData?.chapterInfo?.chapterId;

    const result = await formApiProvider.getExpectedVisitorsDatasById(
      chapterId,
      dateRange.fromDate,
      dateRange.toDate
    );

    if (result && result.status) {
      setExpectedVisitorsDatas(result?.response?.data || []);
    }
  };

  const getOneThankYouDatas = async () => {
    const result = await formApiProvider.getThankyouSlipDatasById(
      dateRange.fromDate,
      dateRange.toDate
    );
    if (result && result.status) {
      setThankYouSlipDatas(result?.response?.data || []);
    }
  };

  const getReferalDatas = async () => {
    const result = await formApiProvider.getReferalDatasById(
      dateRange.fromDate,
      dateRange.toDate
    );
    if (result && result.status) {
      setReferalDatas(result?.response?.data || []);
    }
  };

  const getThankyouReceivedDatas = async () => {
    const result = await formApiProvider.getThankyouReceivedDatasById(
      dateRange.fromDate,
      dateRange.toDate
    );
    if (result && result.status) {
      setThankyouReceivedDatas(result?.response?.data || []);
    }
  };
  const getReferalReceivedDatas = async () => {
    const result = await formApiProvider.getReferalReceivedDatasById(
      dateRange.fromDate,
      dateRange.toDate
    );
    if (result && result.status) {
      setReferalReceivedDatas(result?.response?.data || []);
    }
  };
  const getTestiomonialReceivedDatas = async () => {
    const result = await formApiProvider.getTestimonialReceivedDatasById(
      dateRange.fromDate,
      dateRange.toDate
    );
    if (result && result.status) {
      settestimonialReceivedDatas(result?.response?.data || []);
    }
  };

  const getTestimonialGivenDatas = async () => {
    const result = await formApiProvider.getTestimonialGivenDatasById(
      dateRange.fromDate,
      dateRange.toDate
    );
    if (result && result.status) {
      setTestimonialGivenDatas(result?.response?.data || []);
    }
  };

  // Handler for applying date filters
  const handleApplyDateFilter = async (fetchFunction) => {
    await fetchFunction();
  };
  // Handler
  const handleReferalInputChange = (e) => {
    const { name, value, type } = e.target;
    setRefferalFormErrors({});
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Form submission handler
  const handleReferalSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validation rules
    if (!useCrossChapter) {
      if (!selectedMember) {
        newErrors.selectedMember = "Member is required";
      }
    }

    // Case 2: Cross chapter flow
    if (useCrossChapter) {
      if (!selectedChapter) {
        newErrors.selectedChapter = "Chapter is required";
      }
      if (!selectedMember) {
        newErrors.selectedMember = "Member is required";
      }
    }

    if (!formData.referralStatus || formData.referralStatus.trim() === "") {
      newErrors.referralStatus = "Referral status is required";
    }

    if (!formData.name || formData.name.trim() === "") {
      newErrors.name = "Name is required";
    }
    if (!formData.mobile || !/^[6-9]\d{9}$/.test(formData.mobile)) {
      newErrors.mobile = "Valid 10-digit mobile number is required";
    }
    // if (!category || category.trim() === "") {
    //   newErrors.category = "Category is required";
    // }

    setRefferalFormErrors(newErrors);

    // Stop submission if errors
    if (Object.keys(newErrors).length > 0) return;

    const formDatas = {
      toMember: selectedMember,
      referalStatus: formData.referralStatus,
      referalDetail: {
        name: formData.name,
        // category: category,
        mobileNumber: formData.mobile,
        comments: formData.comments,
        address: formData.address,
      },
    };
    console.log("Form submitted:", formDatas);
    const result = await formApiProvider.submitReferal(formDatas);

    if (result && result.status) {
      setSelectedMember("");
      setUseCrossChapter(false);
      setSelectedChapter("");
      setComments("");
      setFormData({
        selectedMember: "",
        selectedChapter: "",
        useCrossChapter: false,
        referralStatus: "",
        name: "",
        mobile: "",
        // category: "",
        address: "",
        comments: "",
      });
      // window.location.reload()
      const modalElement = document.getElementById("exampleModalReferal");
      if (modalElement) {
        const modal = Modal.getInstance(modalElement);
        if (modal) {
          modal.hide();

          // Manually remove backdrop and restore scrolling
          const backdrops = document.querySelectorAll(".modal-backdrop");
          backdrops.forEach((backdrop) => backdrop.remove());

          document.body.classList.remove("modal-open");
          document.body.style.overflow = "";
          document.body.style.paddingRight = "";
        }
      }

      getDashboardCounts(selectedFilter);
    }
    console.log("Form submitted:", formDatas);
  };

  const handletestimonialSubmit = async (e) => {
    e.preventDefault();

    const formDatas = new FormData();

    // Add all form data to FormData object
    formDatas.append("toMember", selectedMember);
    formDatas.append("comments", formData.comments);
    // Add photo if it exists
    if (photo) {
      formDatas.append("images", photo);
    }
    console.log("Form submitted:", ...formDatas);
    const result = await formApiProvider.submitTestimonial(formDatas);

    if (result && result.status) {
      setSelectedMember("");
      setUseCrossChapter(false);
      setSelectedChapter("");
      // setComments('')
      setPhoto("");
      setFormData({
        comments: "",
      });
      // window.location.reload()
      const modalElement = document.getElementById("exampleModalTwo");
      if (modalElement) {
        const modal = Modal.getInstance(modalElement);
        if (modal) {
          modal.hide();

          // Manually remove backdrop and restore scrolling
          const backdrops = document.querySelectorAll(".modal-backdrop");
          backdrops.forEach((backdrop) => backdrop.remove());

          document.body.classList.remove("modal-open");
          document.body.style.overflow = "";
          document.body.style.paddingRight = "";
        }
      }

      getDashboardCounts(selectedFilter);
    }
  };

  const handleCrossChapterClick = () => {
    setUseCrossChapter(!useCrossChapter);
    setSelectedChapter("");
    setSelectedMember("");
    setRefferalFormErrors({});
  };

  const handleChapterChange = (e) => {
    setRefferalFormErrors({});
    setSelectedChapter(e.target.value);

    setSelectedMember("");
    fetchChapterByMember(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("toMember", selectedMember);
    formData.append("address", location);
    formData.append("date", date);
    formData.append("whereDidYouMeet", meetingLocationType);
    // Add photo if it exists
    if (photo) {
      formData.append("images", photo);
    }
    console.log(...formData, "formDataformDataformData");

    try {
      const formSubmit = await formApiProvider.submitOneToOne(formData);
      console.log(formSubmit, "fffffffff");
      if (formSubmit && formSubmit.status) {
        setSelectedMember("");
        setSelectInviteBy("");
        setPhoto(null);
        setUseCrossChapter(false);
        setSelectedChapter("");
        setLocation("");
        setDate("");
        setTopic("");
      }

      const modalElement = document.getElementById("exampleModal");
      if (modalElement) {
        const modal = Modal.getInstance(modalElement);
        if (modal) {
          modal.hide();

          const backdrops = document.querySelectorAll(".modal-backdrop");
          backdrops.forEach((backdrop) => backdrop.remove());

          document.body.classList.remove("modal-open");
          document.body.style.overflow = "";
          document.body.style.paddingRight = "";
        }
      }

      getDashboardCounts(selectedFilter);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleVisitSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!visitorName || visitorName.trim() === "") {
      newErrors.visitorName = "Visitor name is required";
    }

    if (!company || company.trim() === "") {
      newErrors.company = "Company name is required";
    }

    if (!category || category.trim() === "") {
      newErrors.category = "Category is required";
    }

    if (!mobile || !/^[6-9]\d{9}$/.test(mobile)) {
      newErrors.mobile = "Valid 10-digit mobile number is required";
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Valid email address is required";
    }

    if (!address || address.trim() === "") {
      newErrors.address = "Address is required";
    }

    if (!visitDate) {
      newErrors.visitDate = "Visit date is required";
    }

    setErrors(newErrors);

    // stop submission if any errors
    if (Object.keys(newErrors).length > 0) return;

    const formData = {
      name: visitorName.trim(),
      company: company.trim(),
      category: category.trim(),
      mobile: mobile.trim(),
      email: email.trim(),
      address: address.trim(),
      visitDate,
    };

    console.log("Form submitted:", formData);

    try {
      const formSubmit = await formApiProvider.submitvisitors(formData);
      console.log(formSubmit, "formSubmit");
      if (formSubmit && formSubmit.status) {
        setSelectedMember("");
        setSelectInviteBy("");
        setPhoto(null);
        setUseCrossChapter(false);
        setSelectedChapter("");
        setLocation("");
        setDate("");
        setTopic("");
        setErrors({});
        const modalElement = document.getElementById("visitorSubmitModal");
        if (modalElement) {
          const modal = Modal.getInstance(modalElement);
          if (modal) {
            modal.hide();

            const backdrops = document.querySelectorAll(".modal-backdrop");
            backdrops.forEach((backdrop) => backdrop.remove());

            document.body.classList.remove("modal-open");
            document.body.style.overflow = "";
            document.body.style.paddingRight = "";
          }
        }
      } else {
        toast.error(formSubmit.response?.message || "Failed to create visitor");
      }
      getDashboardCounts(selectedFilter);
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrors({ submit: "Something went wrong. Please try again." });
    }
  };

  // expectedvistors handle submit
  const handleExpectedVisitSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!visitorName || visitorName.trim() === "") {
      newErrors.visitorName = "Visitor name is required";
    }

    if (!company || company.trim() === "") {
      newErrors.company = "Company name is required";
    }

    if (!category || category.trim() === "") {
      newErrors.category = "Category is required";
    }

    if (!mobile || !/^[6-9]\d{9}$/.test(mobile)) {
      newErrors.mobile = "Valid 10-digit mobile number is required";
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Valid email address is required";
    }

    if (!address || address.trim() === "") {
      newErrors.address = "Address is required";
    }

    if (!visitDate) {
      newErrors.visitDate = "Visit date is required";
    }

    setErrors(newErrors);

    // Stop submission if errors exist
    if (Object.keys(newErrors).length > 0) return;

    const user = JSON.parse(localStorage.getItem("userData"));

    const formData = {
      name: visitorName.trim(),
      company: company.trim(),
      category: category.trim(),
      mobile: mobile.trim(),
      email: email.trim(),
      address: address.trim(),
      visitDate,
      chapterId: user?.chapterId, // REQUIRED
      createdBy: user?.id, // REQUIRED by DTO
      invitedBy: user?.id,
    };
    console.log("Expected Visitor Form submitted:", formData);
    try {
      const formSubmit = await formApiProvider.submitExpectedVisitors(formData);
      console.log(formSubmit, "expectedVisitor formSubmit");

      if (formSubmit && formSubmit.status) {
        setSelectedMember("");
        setSelectInviteBy("");
        setPhoto(null);
        setUseCrossChapter(false);
        setSelectedChapter("");
        setLocation("");
        setDate("");
        setTopic("");
        setErrors({});

        const modalElement = document.getElementById("expectedVisitorModal");
        if (modalElement) {
          const modal = Modal.getInstance(modalElement);
          if (modal) {
            modal.hide();

            const backdrops = document.querySelectorAll(".modal-backdrop");
            backdrops.forEach((backdrop) => backdrop.remove());

            document.body.classList.remove("modal-open");
            document.body.style.overflow = "";
            document.body.style.paddingRight = "";
          }
        }
      } else {
        toast.error(
          formSubmit.response?.message || "Failed to create expected visitor"
        );
      }

      getDashboardCounts(selectedFilter);
    } catch (error) {
      console.error("Error submitting expected visitor form:", error);
      setErrors({ submit: "Something went wrong. Please try again." });
    }
  };

  const handleBusinessSubmit = async (e) => {
    e.preventDefault();

    const isBusinessClosed = !!selectedReferral;
    // selectedReferral exists ONLY for dropdown -> business closed

    const payload = {
      toMember: selectedMember,
      amount: Number(amount),
      comments,

      ...(isBusinessClosed && {
        referralStatus: "Business Closed",
        referralId: selectedReferral?._id,
        referralName: selectedReferral?.referalDetail?.name,
      })
    };

    const result = await formApiProvider.submitThankyouSlip(payload);

    if (result && result.status) {

      // BUSINESS CLOSED FLOW → SHOW TOAST
      if (isBusinessClosed) {
        toast.success("Business Closed updated & mail sent successfully!");
      }

      // RESET FORM
      setSelectedMember("");
      setUseCrossChapter(false);
      setSelectedChapter("");
      setAmount("");
      setComments("");
      setSelectedReferral(null);

      // CLOSE MODAL
      const modalElement = document.getElementById("exampleModalOne");
      if (modalElement) {
        const modal = Modal.getInstance(modalElement);
        if (modal) modal.hide();
      }

      setTimeout(() => {
        document.querySelectorAll(".modal-backdrop").forEach((b) => b.remove());
        document.body.classList.remove("modal-open");
        document.body.style.overflow = "";
        document.body.style.paddingRight = "";
      }, 300);

      // REFRESH COUNTS
      getDashboardCounts(selectedFilter);

    } else {
      toast.error(result.response?.message || "Failed to submit");
    }
  };


  const handlePrint = () => {
    const content = document.getElementById("printable-area");
    const printWindow = window.open("", "", "height=600,width=800");

    printWindow.document.write(`
    <html>
      <head>
        <title>Print Slips Summary</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/remixicon/fonts/remixicon.css" />
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .radius-8 { border-radius: 8px; }
          .p-20 { padding: 20px; }
          .bg-danger-100 { background-color: #ffe6e6; }
          .text-neutral-700 { color: #4a4a4a; }
          .text-xl { font-size: 1.5rem; }
          .text-center { text-align: center; }
          h6 { margin: 0; font-size: 16px; }
        </style>
      </head>
      <body>
        ${content.innerHTML}
        <script>
          window.onload = function () {
            window.focus();
            window.print();
            setTimeout(() => window.close(), 500); // Give print dialog time to open
          };
        </script>
      </body>
    </html>
  `);

    printWindow.document.close();
  };

  const handleViewClick = (member) => {
    setSelectedMember(member);
    setdetails(true);
  };

  useEffect(() => {
    fetchZones();
  }, []);





  const fetchZones = async () => {
    try {
      const result = await registerApiProvider.getAllZones();
      if (result && result.status) {
        setZones(result.response.data || []);
      }
    } catch (error) {
      console.error("Error fetching zones:", error);
      setZones([]); // Set empty array on error
    }
  };


  function useChapterDateFilter(chapterList, userData) {

    const [allowedDates, setAllowedDates] = useState([]);
    useEffect(() => {
      if (!chapterList || !userData?.chapterInfo?.chapterId?.chapterName) {
        setAllowedDates([]);
        return;
      }

      const chapterName = userData.chapterInfo.chapterId.chapterName;

      const chapter = chapterList.find(
        (c) => c.chapterName === chapterName
      );

      if (!chapter || !chapter.weekday) {
        setAllowedDates([]);
        return;
      }

      const targetWeekday = chapter.weekday.toLowerCase();

      const weekMap = {
        sunday: 0,
        monday: 1,
        tuesday: 2,
        wednesday: 3,
        thursday: 4,
        friday: 5,
        saturday: 6,
      };

      const weekdayNum = weekMap[targetWeekday];
      if (weekdayNum === undefined) {
        setAllowedDates([]);
        return;
      }

      const dates = [];
      let date = new Date();

      // Find next 2 occurrences of that weekday
      while (dates.length < 2) {
        if (date.getDay() === weekdayNum) {
          dates.push(new Date(date));
        }
        date.setDate(date.getDate() + 1);
      }

      setAllowedDates(dates.map((d) => d.toISOString().split("T")[0]));
    }, [chapterList, userData]); // Runs when chapter list OR user data changes

    return allowedDates;
  }




  useEffect(() => {
    const modalEl = document.getElementById("searchResultModal");

    const handleModalHidden = () => {
      document.body.classList.remove("modal-open");
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";

      const backdrop = document.querySelector(".modal-backdrop");
      if (backdrop) backdrop.remove();
    };

    modalEl?.addEventListener("hidden.bs.modal", handleModalHidden);

    return () => {
      modalEl?.removeEventListener("hidden.bs.modal", handleModalHidden);
    };
  }, []);

  // let { donutChartSeriesTwo, donutChartOptionsTwo } = useReactApexChart()
  // useReactApexChart()
  const donutChartSeriesTwo = [
    profilePercentage >= 100 ? 100 : profilePercentage,
    profilePercentage >= 100 ? 0 : 100 - profilePercentage,
  ];

  const donutChartOptionsTwo = {
    colors: ["#a12b2a", "#4e4240"],
    legend: { show: false },
    chart: {
      type: "donut",
      height: 300,
      sparkline: { enabled: true },
    },
    stroke: { width: 0 },
    dataLabels: { enabled: false },
    plotOptions: {
      pie: {
        startAngle: -90,
        endAngle: 90,
        offsetY: 10,
        customScale: 0.8,
        donut: {
          size: "70%",
          labels: {
            show: true,
            total: {
              showAlways: true,
              show: true,
              label: `${profilePercentage}%`,
              style: {
                fontSize: "34px",
                fontWeight: 600,
                color: "#000",
              },
            },
          },
        },
      },
    },
  };
  const [searchFields, setSearchFields] = useState({
    name: "",
    business: "",
    mobile: "",
    chapter: "",
    zone: "",
    category: "",
  });

  const handleInputChange = (e) => {
    setSearchFields({ ...searchFields, [e.target.name]: e.target.value });
    if (e.target.name === "zone") {
      fetchChapterByZone(e.target.value);
    }
  };

  const handleSearch = async () => {
    console.log(searchFields, "searchfeilds");
    const result = await registerApiProvider.globalSearch(
      searchFields.chapter,
      ""
    );
    console.log(result, "result");
    setGlobalMembers(result?.response?.data);
    const globalSearchModal = Modal.getInstance(
      document.getElementById("globalSearchModal")
    );
    globalSearchModal.hide();

    const resultModal = new Modal(document.getElementById("searchResultModal"));
    resultModal.show();
  };

  useEffect(() => {
    if (userData) {
      let chapId = userData?.chapterInfo?.chapterId?._id;
      fetchChapterByMember(chapId);
    }
  }, [userData]);

  useEffect(() => {
    fetchGetAllChapter();
  }, [useCrossChapter]);

  const fetchChapterByMember = async (chapterId) => {
    console.log(chapterId, "chapterId");

    const resultByMember = await formApiProvider.getChapterByMember(chapterId);

    console.log(resultByMember, "resulmember");
    if (resultByMember && resultByMember.status) {
      let userId = userData?._id;
      console.log(userId, "userId");

      const filterMember =
        resultByMember?.response?.data?.filter((ival) => ival._id !== userId) ||
        [];
      console.log("filterMember", filterMember);
      const data = filterMember.map((ival) => {
        const personalDetails = ival.personalDetails || {};
        console.log(personalDetails, "personalDetails");
        return {
          id: ival._id || `unknown_${ival.id}`, // Fallback ID if missing
          name:
            `${personalDetails.firstName || ""} ${personalDetails.lastName || ""
              }`.trim() || "Unnamed Member",
        };
      });
      console.log(data, "data");

      setMembers(data);
    }
  };
  const fetchGetAllChapter = async () => {
    const resultALlChapter = await formApiProvider.getAllChapter();

    console.log("resultALlChapter", resultALlChapter);
    if (resultALlChapter && resultALlChapter.status) {
      let data = resultALlChapter?.response?.data;
      if (data) {
        setChapterList(data);
      }
    }
  };
  const fetchChapterByZone = async (input) => {
    console.log(input, "input");
    const result = await registerApiProvider.getChaptersByZone(input);
    console.log(result, "result");
    setChapter(result?.response?.data);
  };

  useEffect(() => {
    if (selectedMember) {
      console.log(selectedMember, "selectedMember");
      let arrayInviteBy = [];
      if (members) {
        members.map((ival) => {
          if (ival.id === selectedMember) {
            arrayInviteBy.push(ival);
          }
        });
        let userId = userData?._id;
        let userName =
          userData?.personalDetails?.firstName +
          " " +
          userData?.personalDetails?.lastName;
        if (userId && userName) {
          arrayInviteBy.push({ id: userId, name: userName });
        }
      }
      setInviteByOPtions(arrayInviteBy);
    }
  }, [selectedMember]);
  console.log(date, "datedate");

  const getDashboardCounts = async (filter = "this-Week") => {
    let params = {};
    console.log(filter, "filter");

    // Only add filterType if not "Over All"
    if (filter !== "Over-All") {
      params.filterType = filter.toLowerCase();
    }
    console.log(params, "params");

    try {
      const getResponse = await formApiProvider.getDashboardFormCount(params);
      console.log(getResponse, "getResponse-getCount");
      if (getResponse && getResponse.status) {
        setFormCount(getResponse?.response?.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard counts:", error);
    }
  };

  // Initial load
  useEffect(() => {
    getDashboardCounts(selectedFilter);
  }, []);

  // Update chart when profile percentage changes
  useEffect(() => {
    if (profilePercentage !== null && !profileLoading) {
      // Force chart update by triggering a small delay
      const timer = setTimeout(() => {
        // This will trigger a re-render of the chart
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [profilePercentage, profileLoading]);
  console.log(details, selectedMember, "details");
  const handleback = async () => {
    setdetails(false);
    setSelectedMember(null);
  };

  const fetchAllMembers = async () => {
    if (userData) {
      let chapId = userData?.chapterInfo?.chapterId?._id;
      const result = await registerApiProvider.globalSearch(chapId);
      console.log(result, "resultall");
      setmemberList(result?.response?.data);
    }
  };
  const memberInputChange = async (value) => {
    if (userData) {
      let chapId = userData?.chapterInfo?.chapterId?._id;
      const result = await registerApiProvider.globalSearch(chapId, value);
      console.log(result, "resultall");
      setmemberList(result?.response?.data);
    }
  };
  const globalSearch = async (value) => {
    const result = await registerApiProvider.globalSearch(
      searchFields.chapter,
      value
    );
    console.log(result, "resultall");
    setGlobalMembers(result?.response?.data);
  };
  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        const result = await registerApiProvider.getUpcomingEvents();
        console.log(result.response.data, "result events");
        const events = result?.response?.data || [];

        // 🔥 Split based on purpose
        const meetings = events.filter(e => e.purpose === "meeting");
        const trainings = events.filter(e => e.purpose === "training");
        const plainEvents = events.filter(e => e.purpose === "event");

        // Save to stat
        setupcomingMeetings(meetings);
        setupcomingTrainings(trainings);
        setupcomingEvents(plainEvents);

        console.log({ meetings, trainings, plainEvents });
        // Set the data to state if needed:
      } catch (error) {
        console.error("Error fetching events:", error);
        // Handle error (e.g., show error message)
      }
    };

    fetchUpcomingEvents();
  }, []);

  // login
  const handleRefGivenClick = async (member) => {
    const memberId = member?._id || selectedMember?._id;
    if (!memberId) return;

    setSelectedMember(member);
    setRefGiven([]); // reset referrals
    setLoading(true);

    try {
      // Login
      const loginRes = await fetch(
        "https://api.gripforum.com/api/mobile/member-login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mobileNumber: "9890989098", pin: "5577" }),
        }
      );

      const loginData = await loginRes.json();
      if (!loginData.token) throw new Error("Token not received");

      sessionStorage.setItem("token", loginData.token);
      const token = loginData.token;

      // Fetch referrals
      const res = await fetch(
        `https://api.gripforum.com/api/mobile/referralslip/given/list/${memberId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch referrals");

      const data = await res.json();
      console.log("Referrals API returned:", data);

      setRefGiven(Array.isArray(data.data) ? data.data : []);
      console.log("refGiven state:", data);

      setShowRefPopup(true);
    } catch (err) {
      console.error(err);
      setRefGiven([]);
      setShowRefPopup(true);
    } finally {
      setLoading(false);
    }
  };
  //
  const handleRefReceivedClick = async (member) => {
    const memberId = member?._id || selectedMember?._id;
    if (!memberId) return;

    setSelectedMember(member);
    setRefReceived([]);
    setLoading(true);

    try {
      // Login (same as given)
      const loginRes = await fetch(
        "https://api.gripforum.com/api/mobile/member-login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mobileNumber: "9890989098", pin: "5577" }),
        }
      );

      const loginData = await loginRes.json();
      if (!loginData.token) throw new Error("Token not received");
      const token = loginData.token;

      // Fetch referrals RECEIVED
      const res = await fetch(
        `https://api.gripforum.com/api/mobile/referralslip/received/list/${memberId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch referrals");

      const data = await res.json();
      console.log("Referrals Received API returned:", data);

      setRefReceived(Array.isArray(data.data) ? data.data : []);
      setShowRefReceivedPopup(true);
    } catch (err) {
      console.error(err);
      setRefReceived([]);
      setShowRefReceivedPopup(true);
    } finally {
      setLoading(false);
    }
  };

  //

  // const handleTestimonialGivenDatas = async (member) => {
  //   setSelectedMember(member); // <-- add this
  //   try {
  //     const loginRes = await fetch(
  //       "https://api.gripforum.com/api/mobile/member-login",
  //       {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ mobileNumber: "9890989098", pin: "5577" }),
  //       }
  //     );
  //     const loginData = await loginRes.json();
  //     const token = loginData.token;
  //     if (!token) throw new Error("Login failed");

  //     const res = await fetch(
  //       `https://api.gripforum.com/api/mobile/testimonialslips/given/list/${member._id}`,
  //       {
  //         method: "GET",
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     const data = await res.json();
  //     setTestimonialGivenDatas(Array.isArray(data.data) ? data.data : []);
  //     setShowTestimonialGivenPopup(true);
  //   } catch (err) {
  //     console.error("Failed to fetch testimonial slips:", err);
  //     setTestimonialGivenDatas([]);
  //     setShowTestimonialGivenPopup(true);
  //   }
  // };

  // const handleTestimonialGivenDatas = async (member) => {
  //   setSelectedMember(member); // set Running Member + Chapter first

  //   try {
  //     // 1️⃣ Login to get token
  //     const loginRes = await fetch(
  //       "https://api.gripforum.com/api/mobile/member-login",
  //       {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ mobileNumber: "9890989098", pin: "5577" }),
  //       }
  //     );
  //     const loginData = await loginRes.json();
  //     const token = loginData.token;
  //     if (!token) throw new Error("Login failed");

  //     // 2️⃣ Fetch testimonial slips for the specific member
  //     const res = await fetch(
  //       `https://api.gripforum.com/api/mobile/testimonialslips/given/list?memberId=${member._id}`, // query param
  //       {
  //         method: "GET",
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     const data = await res.json();
  //     console.log("Testimonial Given Data:", data); // check API response

  //     // 3️⃣ Set data and only then show modal
  //     setTestimonialGivenDatas(Array.isArray(data.data) ? data.data : []);
  //     setShowTestimonialGivenPopup(true); // <-- show modal after data is ready
  //   } catch (err) {
  //     console.error("Failed to fetch testimonial slips:", err);
  //     setTestimonialGivenDatas([]);
  //     setShowTestimonialGivenPopup(true); // you can also choose to NOT show modal on error
  //   }
  // };

  // const handleTestimonialGivenDatas = async (member) => {
  //   setSelectedMember(member); // keep current member
  //   try {
  //     const loginRes = await fetch(
  //       "https://api.gripforum.com/api/mobile/member-login",
  //       {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ mobileNumber: "9890989098", pin: "5577" }),
  //       }
  //     );
  //     const loginData = await loginRes.json();
  //     const token = loginData.token;
  //     if (!token) throw new Error("Login failed");

  //     // Fetch testimonial slips for this member
  //     const res = await fetch(
  //       `https://api.gripforum.com/api/mobile/testimonialslips/given/list?memberId=${member._id}`,
  //       {
  //         method: "GET",
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     const data = await res.json();
  //     setTestimonialGivenDatas(Array.isArray(data.data) ? data.data : []);

  //     // Show popup on same page
  //     setShowTestimonialGivenPopup(true);
  //   } catch (err) {
  //     console.error("Failed to fetch testimonial slips:", err);
  //     setTestimonialGivenDatas([]);
  //     setShowTestimonialGivenPopup(true);
  //   }
  // };
  // const handleTestimonialGivenDatas = async (member) => {
  //   if (!member?._id) return;

  //   // Temporarily set the selected member
  //   setSelectedMember(member);

  //   try {
  //     // Login to get JWT token
  //     const loginRes = await fetch(
  //       "https://api.gripforum.com/api/mobile/member-login",
  //       {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ mobileNumber: "9890989098", pin: "5577" }),
  //       }
  //     );

  //     const loginData = await loginRes.json();
  //     const token = loginData.token;
  //     if (!token) throw new Error("Login failed");

  //     // Fetch Testimonial Given list for this member
  //     const res = await fetch(
  //       `https://api.gripforum.com/api/mobile/testimonialslips/given/list?memberId=${member._id}`,
  //       {
  //         method: "GET",
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     const data = await res.json();

  //     // Set testimonial data
  //     setTestimonialGivenDatas(Array.isArray(data.data) ? data.data : []);

  //     // If API provides full member info, update selectedMember
  //     if (data.memberDetails) {
  //       setSelectedMember(data.memberDetails);
  //     }

  //     // Show popup
  //     setShowTestimonialGivenPopup(true);
  //   } catch (err) {
  //     console.error("Failed to fetch testimonial slips:", err);
  //     setTestimonialGivenDatas([]);
  //     setShowTestimonialGivenPopup(true);
  //   }
  // };
  // Function to fetch testimonial given data for clicked member
  // given
  const handleTestimonialGivenDatas = async (member) => {
    if (!member?._id) return;

    setSelectedMember(member);

    try {
      const loginRes = await fetch(
        "https://api.gripforum.com/api/mobile/member-login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mobileNumber: "9890989098", pin: "5577" }),
        }
      );

      const loginData = await loginRes.json();
      const token = loginData.token;
      if (!token) throw new Error("Login failed");

      const res = await fetch(
        `https://api.gripforum.com/api/mobile/testimonialslips/given/list/${member._id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();
      const allTestimonials = Array.isArray(data.data) ? data.data : [];

      const filteredTestimonials = allTestimonials.filter(
        (t) => t.fromMember._id === member._id
      );

      setTestimonialGivenDatas(filteredTestimonials);

      // 4️⃣ Show popup
      setShowTestimonialGivenPopup(true);
    } catch (err) {
      console.error("Failed to fetch testimonial slips:", err);
      setTestimonialGivenDatas([]);
      setShowTestimonialGivenPopup(true);
    }
  };

  //recevied

  const handleTestimonialReceivedDatas = async (member) => {
    if (!member?._id) return;

    setSelectedMember(member);

    try {
      // Login to get token
      const loginRes = await fetch(
        "https://api.gripforum.com/api/mobile/member-login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mobileNumber: "9890989098", pin: "5577" }),
        }
      );

      const loginData = await loginRes.json();
      const token = loginData.token;
      if (!token) throw new Error("Login failed");

      // Fetch received testimonials
      const res = await fetch(
        `https://api.gripforum.com/api/mobile/testimonialslips/received/list/${member._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = await res.json();
      const filtered = Array.isArray(data.data)
        ? data.data.filter((t) => t.toMember?._id === member._id)
        : [];

      settestimonialReceivedDatas(filtered);
      setShowTestimonialReceivedPopup(true);
    } catch (err) {
      console.error("Received fetch failed:", err);
      settestimonialReceivedDatas([]);
      setShowTestimonialReceivedPopup(true);
    }
  };
  // visitors
  const handleVisitorDatas = async (member) => {
    if (!member?._id) return;

    setSelectedMember(member);

    try {
      // 1. Login to get token
      const loginRes = await fetch(
        "https://api.gripforum.com/api/mobile/member-login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mobileNumber: "9890989098",
            pin: "5577",
          }),
        }
      );

      const loginData = await loginRes.json();
      const token = loginData.token;
      if (!token) throw new Error("Login failed");

      // 2. Fetch visitors of this member
      const res = await fetch(
        `https://api.gripforum.com/api/mobile/visitors/list/${member._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = await res.json();

      // 3. Some APIs send visitors as array → adjust as per response
      const visitors = Array.isArray(data.data) ? data.data : [];

      setVisitorsDatas(visitors); // save visitors
      setShowVisitorPopup(true); // open popup (like you did for testimonial)
    } catch (err) {
      console.error("Visitors fetch failed:", err);
      setVisitorsDatas([]);
      setShowVisitorPopup(true);
    }
  };
  // thankugiven
  const handleThankYouDatas = async (member) => {
    if (!member?._id) return;

    setSelectedMember(member); // Save selected member for modal

    try {
      // 1. Login to get token
      const loginRes = await fetch(
        "https://api.gripforum.com/api/mobile/member-login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mobileNumber: "9890989098",
            pin: "5577",
          }),
        }
      );

      const loginData = await loginRes.json();
      const token = loginData.token;
      if (!token) throw new Error("Login failed");

      // 2. Fetch thank you slips given by this member
      const res = await fetch(
        `https://api.gripforum.com/api/mobile/thankyouslips/given/list/${member._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = await res.json();
      const slips = Array.isArray(data.data) ? data.data : [];

      setThankYouSlipDatas(slips); // save data for modal
      setShowThankYouPopup(true); // open modal
    } catch (err) {
      console.error("Thank You Slips fetch failed:", err);
      setThankYouSlipDatas([]);
      setShowThankYouPopup(true); // still open modal with empty table
    }
  };
  // one-to-one
  const handleOneToOneDatas = async (member) => {
    if (!member?._id) return;

    setSelectedMember(member);

    try {
      // 1. Login
      const loginRes = await fetch(
        "https://api.gripforum.com/api/mobile/member-login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mobileNumber: "9890989098",
            pin: "5577",
          }),
        }
      );

      const loginData = await loginRes.json();
      const token = loginData.token;
      if (!token) throw new Error("Login failed");

      // 2. Fetch one-to-one data
      const res = await fetch(
        `https://api.gripforum.com/api/mobile/onetoone/list/${member._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = await res.json();
      const oneToOneList = Array.isArray(data.data) ? data.data : [];

      setOnToOneDatas(oneToOneList);
      setShowOneToOnePopup(true); // open modal
    } catch (err) {
      console.error("One-to-One fetch failed:", err);
      setOnToOneDatas([]);
      setShowOneToOnePopup(true); // still open modal
    }
  };



  const updateReferralStatusInState = (id, newStatus) => {
    setReferalReceivedDatas(prev =>
      prev.map(item =>
        item._id === id ? { ...item, referalStatus: newStatus } : item
      )
    );
  };

  const handleReferralStatusChange = async (status, item) => {
    // Update UI state immediately
    updateReferralStatusInState(item._id, status);

    // 1️⃣ Business Closed → open Thank You modal
    if (status === "Business Closed") {
      setSelectedReferral(item);   // <-- IMPORTANT: SAVE REFERRAL FOR SUBMIT

      const referralModalEl = document.getElementById("referralreceiveReportModal");
      const referralModal = Modal.getInstance(referralModalEl);
      if (referralModal) referralModal.hide();

      referralModalEl.addEventListener(
        "hidden.bs.modal",
        () => {
          document.querySelectorAll(".modal-backdrop").forEach(el => el.remove());
          document.body.classList.remove("modal-open");
          document.body.style.overflow = "";
          document.body.style.paddingRight = "";

          const thankyouModalEl = document.getElementById("exampleModalOne");
          const thankyouModal = new Modal(thankyouModalEl);
          thankyouModal.show();
        },
        { once: true }
      );

      return;
    }

    // 2️⃣ Not Required / Contacted → Send Mail & Close Modal
    if (status === "Not Required" || status === "Contacted") {
      const payload = {
        referralId: item._id,
        status,
        toMember: {
          firstName: item.toMember?.personalDetails?.firstName,
          lastName: item.toMember?.personalDetails?.lastName,
          email: item.toMember?.personalDetails?.email,
        },
        fromMember: {
          firstName: item.fromMember?.personalDetails?.firstName,
          lastName: item.fromMember?.personalDetails?.lastName,
          email: item.fromMember?.personalDetails?.email,
        },
        referralDetail: {
          name: item.referalDetail?.name,
          category: item.referalDetail?.category,
          mobileNumber: item.referalDetail?.mobileNumber,
          address: item.referalDetail?.address,
          comments: item.referalDetail?.comments,
          status: item.referalStatus,
          createdDate: item.createdAt,
        },
      };

      try {
        const apiRes = await ReferralApiProvider.sendReferralStatusMail(payload);

        if (apiRes.status) {
          toast.success(apiRes.response.message ?? "Mail sent!");

          // Close modal after success
          const referralModalEl = document.getElementById("referralreceiveReportModal");
          const referralModal = Modal.getInstance(referralModalEl);

          if (referralModal) referralModal.hide();

          setTimeout(() => {
            document.querySelectorAll(".modal-backdrop").forEach(el => el.remove());
            document.body.classList.remove("modal-open");
            document.body.style.overflow = "";
            document.body.style.paddingRight = "";
          }, 300);

        } else {
          toast.error(apiRes.response?.message ?? "Mail failed");
        }

      } catch (err) {
        console.error(err);
        toast.error("Something went wrong.");
      }
    }
  };



  const allowedDates = useChapterDateFilter(chapterList, userData);


  return (
    <>
      <div className="card h-100 p-0 radius-12">
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between">
          <div className="d-flex align-items-center flex-wrap gap-3">
            <h6 class="fw-semibold mb-0">
              Hello,{" "}
              {userData?.personalDetails?.firstName +
                " " +
                userData?.personalDetails?.lastName}
            </h6>
          </div>

          <div className="firstpartt d-flex align-items-center flex-wrap gap-2">

            {/* ⭐ PINS BUTTON — MOVED TO THE FIRST POSITION */}
            <Link
              to=""
              className="btn text-white bg-gradient-blue-warning text-sm btn-sm d-flex align-items-center justify-content-center gap-2 text-center"
              data-bs-toggle="modal"
              data-bs-target="#pinsModal"
              style={{
                width: "200px",
                height: "50px",
                borderRadius: "8px",
                padding: "12px",
                whiteSpace: "normal",
                lineHeight: "1.2",
              }}
            >
              Pins
            </Link>

            {/* PRINT SLIPS */}
            <button
              onClick={handlePrint}
              className="btn text-white bg-gradient-blue-warning text-sm btn-sm d-flex align-items-center justify-content-center gap-2 text-center"
              style={{
                width: "200px",
                height: "50px",
                borderRadius: "8px",
                padding: "12px",
                whiteSpace: "normal",
                lineHeight: "1.2",
              }}
            >
              Print Your Slips
            </button>

            {/* MEMBER SEARCH */}
            <Link
              to=""
              className="btn text-white bg-gradient-blue-warning text-sm btn-sm d-flex align-items-center justify-content-center gap-2 text-center"
              data-bs-toggle="modal"
              data-bs-target="#memberSearchModal"
              onClick={() => {
                fetchAllMembers();
              }}
              style={{
                width: "200px",
                height: "50px",
                borderRadius: "8px",
                padding: "12px",
                whiteSpace: "normal",
                lineHeight: "1.2",
              }}
            >
              Member search
            </Link>

            {/* GLOBAL SEARCH */}
            <Link
              to=""
              className="btn text-white bg-gradient-blue-warning text-sm btn-sm d-flex align-items-center justify-content-center gap-2 text-center"
              data-bs-toggle="modal"
              data-bs-target="#globalSearchModal"
              style={{
                width: "200px",
                height: "50px",
                borderRadius: "8px",
                padding: "12px",
                whiteSpace: "normal",
                lineHeight: "1.2",
              }}
            >
              Global search
            </Link>

            {/* RENEWAL DATE */}
            <Link
              to=""
              className="btn text-white bg-gradient-blue-warning text-sm btn-sm d-flex align-items-center justify-content-center gap-2 text-center"
              style={{
                width: "200px",
                height: "50px",
                borderRadius: "8px",
                padding: "12px",
                whiteSpace: "normal",
                lineHeight: "1.2",
              }}
            >
              Renewal Due Date:
              <br />
              {userData?.personalDetails?.renewalDate
                ? new Date(userData.personalDetails.renewalDate).toLocaleDateString(
                  "en-GB"
                )
                : ""}
            </Link>
          </div>

          {/* ⭐ PINS MODAL (unchanged) */}
          <div
            className="modal fade"
            id="pinsModal"
            tabIndex="-1"
            aria-labelledby="pinsModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content">

                <div className="modal-header">
                  <h5 className="modal-title" id="pinsModalLabel">Your Pins</h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>

                <div className="modal-body">
                  {userData?.personalDetails?.pins?.length > 0 ? (
                    <div className="row g-3">

                      {userData.personalDetails.pins.map((pin) => (
                        <div key={pin._id} className="col-6 col-md-4 text-center">
                          <div
                            className="p-3 border rounded"
                            style={{ borderRadius: "12px" }}
                          >
                            <img
                              src={`${process.env.REACT_APP_IMAGE_URL}/pins/${pin.image}`}
                              alt={pin.name}
                              style={{
                                width: "80px",
                                height: "80px",
                                objectFit: "cover",
                                borderRadius: "10px",
                              }}
                            />
                            <p className="mt-2 fw-semibold">{pin.name}</p>
                          </div>
                        </div>
                      ))}

                    </div>
                  ) : (
                    <p className="text-center">No Pins Found</p>
                  )}
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-12">
        <div className="card h-100 mb-3">
          <div className="card-body">
            <div className="d-flex align-items-center flex-wrap gap-2 justify-content-between mb-20">
              <h6 className="mb-2 fw-bold text-lg mb-0">Dashboard</h6>
              <select
                className="form-select form-select-sm w-auto bg-base border-grip text-secondary-light"
                value={selectedFilter}
                onChange={handleFilterChange}
              >
                <option value="this-Week">This Week</option>
                <option value="this-Month">This Month</option>
                <option value="6-months">6 Months</option>
                <option value="12-months">12 Months</option>
                <option value="Over-All">Over All</option>
              </select>
            </div>
            <div className="row gy-4">
              {/* Right side details */}
              <div className="col-lg-9 col-sm-12" id="printable-area">
                <div className="row g-3">
                  <div className="col-sm-3 col-xs-3">
                    <div className="radius-8 h-100 text-center p-20 bg-danger-100 cursor-pointer">
                      <span className="w-44-px h-44-px radius-8 d-inline-flex justify-content-center align-items-center text-xl mb-12  border border-danger-400 text-black">
                        <i className="ri-heart-fill" />
                      </span>
                      <span className="text-neutral-700 d-block">
                        Thank you Notes Received
                      </span>
                      <h6 className="mb-0 mt-4">
                        ₹{formCount?.thankYouReceivedAmount || 0}
                      </h6>
                      <div className="d-flex align-items-center flex-wrap mt-12 gap-8">
                        <Link
                          to="#"
                          className="btn rounded-pill bg-gradient-blue-warning text-white radius-8 px-12 py-6 flex-grow-1"
                          data-bs-toggle="modal"
                          data-bs-target="#tyreceiveReportModal"
                          onClick={() => getThankyouReceivedDatas()}
                        >
                          Review
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="col-sm-3 col-xs-3">
                    <div className="radius-8 h-100 text-center p-20 bg-danger-100">
                      <span className="w-44-px h-44-px radius-8 d-inline-flex justify-content-center align-items-center text-xl mb-12  border border-danger-400 text-black">
                        <i className="ri-group-fill" />
                      </span>
                      <span className="text-neutral-700 d-block">
                        Referrals Received
                      </span>
                      <h6 className="mb-0 mt-4">
                        {formCount?.referralReceivedCount || 0}
                      </h6>
                      <div className="d-flex align-items-center flex-wrap mt-12 gap-8">
                        <Link
                          to="#"
                          className="btn rounded-pill bg-gradient-blue-warning text-white radius-8 px-12 py-6 flex-grow-1"
                          data-bs-toggle="modal"
                          data-bs-target="#referralreceiveReportModal"
                          onClick={() => getReferalReceivedDatas()}
                        >
                          Review
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="col-sm-3 col-xs-3">
                    <div className="radius-8 h-100 text-center p-20 bg-danger-100">
                      <span className="w-44-px h-44-px radius-8 d-inline-flex justify-content-center align-items-center text-xl mb-12  border border-danger-400 text-black">
                        <i className="ri-chat-quote-fill" />
                      </span>
                      <span className="text-neutral-700 d-block">
                        Testimonial Received
                      </span>
                      <h6 className="mb-0 mt-4">
                        {formCount?.testimonialReceivedCount || 0}
                      </h6>
                      <div className="d-flex align-items-center flex-wrap mt-12 gap-8">
                        <Link
                          to="#"
                          className="btn rounded-pill bg-gradient-blue-warning text-white radius-8 px-12 py-6 flex-grow-1"
                          data-bs-toggle="modal"
                          data-bs-target="#testimonialReceivedReportModal"
                          onClick={() => getTestiomonialReceivedDatas()}
                        >
                          Review
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="col-sm-3 col-xs-3">
                    <div className="radius-8 h-100 text-center p-20 bg-danger-100">
                      <span className="w-44-px h-44-px radius-8 d-inline-flex justify-content-center align-items-center text-xl mb-12  border border-danger-400 text-black">
                        <i className="ri-user-follow-line" />
                      </span>
                      <span className="text-neutral-700 d-block">Visitor</span>
                      <h6 className="mb-0 mt-4">
                        {formCount?.visitorCount || 0}
                      </h6>
                      <div className="d-flex align-items-center flex-wrap mt-12 gap-8">
                        {/* <Link
                          to="#"
                          className="btn rounded-pill border btn-primary-black text-white border-neutral-500 radius-8 px-12 py-6 bg-hover-neutral-500 text-hover-white flex-grow-1"
                          data-bs-toggle="modal"
                          data-bs-target="#visitorSubmitModal"
                        >
                          Submit
                        </Link> */}

                        <Link
                          to="#"
                          className="btn rounded-pill bg-gradient-blue-warning text-white radius-8 px-12 py-6 flex-grow-1"
                          data-bs-toggle="modal"
                          data-bs-target="#visitorReceiveModal"
                          onClick={() => getVisitorDatas()}
                        >
                          Review
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* expected visitors */}
                  <div className="col-sm-3 col-xs-3">
                    <div className="radius-8 h-100 text-center p-20 bg-danger-100">
                      <span className="w-44-px h-44-px radius-8 d-inline-flex justify-content-center align-items-center text-xl mb-12 border border-danger-400 text-black">
                        <i className="ri-user-follow-line" />
                      </span>

                      <span className="text-neutral-700 d-block">
                        Expected Visitor
                      </span>

                      <h6 className="mb-0 mt-4">
                        {formCount?.expectedVisitorCount || 0}
                      </h6>

                      <div className="d-flex align-items-center flex-wrap mt-12 gap-8">
                        <Link
                          to="#"
                          className="btn rounded-pill bg-gradient-blue-warning text-white radius-8 px-12 py-6 flex-grow-1"
                          data-bs-toggle="modal"
                          data-bs-target="#expectedVisitorModal"
                        >
                          Submit
                        </Link>
                        <Link
                          to="#"
                          className="btn rounded-pill bg-gradient-blue-warning text-white radius-8 px-12 py-6 flex-grow-1"
                          data-bs-toggle="modal"
                          data-bs-target="#expectedVisitorReceiveModal"
                          onClick={() => getExpectedVisitorDatas()}
                        >
                          Review
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="col-sm-3 col-xs-3">
                    <div className="radius-8 h-100 text-center p-20 bg-danger-100 ">
                      <span className="w-44-px h-44-px radius-8 d-inline-flex justify-content-center align-items-center text-xl mb-12  border border-danger-400 text-black">
                        <i className="ri-hand-heart-fill" />
                      </span>
                      <span className="text-neutral-700 d-block">
                        Thank you Notes Given
                      </span>
                      <h6 className="mb-0 mt-4">
                        ₹{formCount?.thankYouGivenAmount || 0}
                      </h6>
                      <div className="d-flex align-items-center flex-wrap mt-12 gap-8">
                        <Link
                          to="#"
                          className="btn rounded-pill bg-gradient-blue-warning text-white radius-8 px-12 py-6 flex-grow-1"
                          data-bs-toggle="modal"
                          data-bs-target="#exampleModalOne"
                        >
                          Submit
                        </Link>
                        <Link
                          to="#"
                          className="btn rounded-pill bg-gradient-blue-warning text-white radius-8 px-12 py-6 flex-grow-1"
                          data-bs-toggle="modal"
                          data-bs-target="#tygivenReportModal"
                          onClick={() => getOneThankYouDatas()}
                        >
                          Review
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="col-sm-3 col-xs-3">
                    <div className="radius-8 h-100 text-center p-20 bg-danger-100">
                      <span className="w-44-px h-44-px radius-8 d-inline-flex justify-content-center align-items-center text-xl mb-12  border border-danger-400 text-black">
                        <i className="ri-send-plane-fill" />
                      </span>
                      <span className="text-neutral-700 d-block">
                        Referrals Given
                      </span>
                      <h6 className="mb-0 mt-4">
                        {formCount?.referralGivenCount || 0}
                      </h6>
                      <div className="d-flex align-items-center flex-wrap mt-12 gap-8">
                        <Link
                          to="#"
                          className="btn rounded-pill bg-gradient-blue-warning text-white radius-8 px-12 py-6 flex-grow-1"
                          data-bs-toggle="modal"
                          data-bs-target="#exampleModalReferal"
                        >
                          Submit
                        </Link>
                        <Link
                          to="#"
                          className="btn rounded-pill bg-gradient-blue-warning text-white radius-8 px-12 py-6 flex-grow-1"
                          data-bs-toggle="modal"
                          data-bs-target="#referralgivenReportModal"
                          onClick={() => getReferalDatas()}
                        >
                          Review
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-3 col-xs-3">
                    <div className="radius-8 h-100 text-center p-20 bg-danger-100">
                      <span className="w-44-px h-44-px radius-8 d-inline-flex justify-content-center align-items-center text-xl mb-12  border border-danger-400 text-black">
                        <i className="ri-feedback-fill" />
                      </span>
                      <span className="text-neutral-700 d-block">
                        Testimonial Given
                      </span>
                      <h6 className="mb-0 mt-4">
                        {formCount?.testimonialGivenCount || 0}
                      </h6>
                      <div className="d-flex align-items-center flex-wrap mt-12 gap-8">
                        <Link
                          to="#"
                          className="btn rounded-pill bg-gradient-blue-warning text-white radius-8 px-12 py-6 flex-grow-1"
                          data-bs-toggle="modal"
                          data-bs-target="#exampleModalTwo"
                        >
                          Submit
                        </Link>
                        <Link
                          to="#"
                          className="btn rounded-pill bg-gradient-blue-warning text-white radius-8 px-12 py-6 flex-grow-1"
                          data-bs-toggle="modal"
                          data-bs-target="#testimonialgivenReportModal"
                          onClick={() => getTestimonialGivenDatas()}
                        >
                          Review
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="col-sm-3 col-xs-3">
                    <div className="radius-8 h-100 text-center p-20 bg-danger-100">
                      <span className="w-44-px h-44-px radius-8 d-inline-flex justify-content-center align-items-center text-xl mb-12  border border-danger-400 text-black">
                        <i className="ri-discuss-fill" />
                      </span>
                      <span className="text-neutral-700 d-block">
                        One-to-Ones
                      </span>
                      <h6 className="mb-0 mt-4">
                        {formCount?.oneToOneCount || 0}
                      </h6>
                      <div className="d-flex align-items-center flex-wrap mt-12 gap-8">
                        <Link
                          to="#"
                          className="btn rounded-pill bg-gradient-blue-warning text-white radius-8 px-12 py-6 flex-grow-1"
                          data-bs-toggle="modal"
                          data-bs-target="#exampleModal"
                        >
                          Submit
                        </Link>
                        <Link
                          to="#"
                          className="btn rounded-pill bg-gradient-blue-warning text-white radius-8 px-12 py-6 flex-grow-1 cursor-pointer"
                          data-bs-toggle="modal"
                          data-bs-target="#oneToOneReportModal"
                          onClick={() => getOneTooneDatas()}
                        >
                          Review
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-sm-12">
                <div className="card box-shadow radius-16 pb-3">
                  <div className="card-header">
                    <div className="d-flex align-items-center flex-wrap gap-2 justify-content-between">
                      <h6 className="mb-2 fw-bold text-lg mb-0">Payment </h6>
                      <Link
                        to="#"
                        className="text-grip hover-text-primary d-flex align-items-center gap-1"
                        data-bs-toggle="modal"
                        data-bs-target="#paymentDetails"
                      >
                        View All
                        <iconify-icon
                          icon="solar:alt-arrow-right-linear"
                          className="icon"
                        />
                      </Link>
                    </div>
                  </div>
                  <div className="card-body">
                    {upcomingEvents?.map((event) => (
                      <div
                        key={event.id}
                        className="d-flex align-items-center justify-content-between pb-10 mb-10 border-bottom border-neutral-200"
                      >
                        <div className="col-8">
                          <h6 className="text-md mb-0">
                            {event.topic || "Monthly meeting fee"}
                          </h6>
                          <span className="text-xs text-secondary-light fw-medium">
                            {event.date
                              ? new Date(event.date).toLocaleDateString(
                                "en-US",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                }
                              )
                              : "Date not specified"}
                          </span>
                        </div>
                        <div className="text-center col-4">
                          <h6 className="text-sm mb-1">
                            ₹{event.amount || "1000"}
                          </h6>
                          <button
                            className={`text-xs fw-medium px-3 border-0 ${event.paid
                              ? "text-success-600 bg-success-100"
                              : "text-danger-600 bg-danger-100"
                              }`}
                            style={{
                              padding: "2px 7px",
                              borderRadius: "4px",
                              cursor: "pointer",
                            }}
                            data-bs-toggle="modal"
                            data-bs-target="#paymentDetails"
                          // onClick={() => handlePayment(event.id)}
                          >
                            {event.paid ? "Paid" : "Pay Now"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>{" "}
            {/* row gy-4 */}
          </div>{" "}
          {/* col-xxl-8 */}
        </div>{" "}
        {/* row gy-4 */}
      </div>{" "}
      {/* col-xxl-12 col-xl-12 */}
      <div className="col-xxl-6 col-xl-6">
        <div className="card h-100 radius-8  overflow-hidden">
          <div className="card-body p-24">
            <div className="d-flex align-items-center flex-wrap gap-2 justify-content-between ">
              <div>
                <h6 className="mb-2 fw-bold text-xl">Profile Optimisation</h6>
                <p>Complete your profile to optimize your network</p>
              </div>

              <div className="">
                <Link
                  to="/add-user"
                  className="text-grip hover-text-primary d-flex align-items-center gap-1"
                >
                  Update
                  <Icon icon="solar:alt-arrow-right-linear" className="icon" />
                </Link>
              </div>
            </div>
            <div className="d-flex flex-wrap align-items-center justify-content-between mt-3">
              <div>
                {profileLoading ? (
                  <div
                    className="d-flex align-items-center justify-content-center"
                    style={{ width: "200px", height: "300px" }}
                  >
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : profilePercentage !== null ? (
                  <ReactApexChart
                    key={`profile-chart-${profilePercentage}`}
                    options={donutChartOptionsTwo}
                    series={donutChartSeriesTwo}
                    type="donut"
                    width={200}
                    height={300}
                    id="donutChart"
                    className="flex-grow-1 apexcharts-tooltip-z-none title-style circle-none"
                  />
                ) : (
                  <div
                    className="d-flex align-items-center justify-content-center"
                    style={{ width: "200px", height: "300px" }}
                  >
                    <span className="text-muted">No data available</span>
                  </div>
                )}
              </div>

              <ul className="flex-shrink-0">
                <li className="d-flex align-items-center gap-2 mb-28">
                  <span className="w-12-px h-12-px rounded-circle bg-success-grip" />
                  <span className="text-secondary-light text-sm fw-medium">
                    Complete your My Bio by Filling Tops Profile
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* carousel slider component added */}
      <div className="col-xxl-6 col-xl-6">
        <div className="card h-100 radius-8 overflow-hidden">
          {/* Add padding here */}
          <div className="p-3">
            <h3 className="mb-2 fw-bold text-xl">TOP PERFORMER OF THE MONTH</h3>
          </div>
          <div
            className="card-body p-2 d-flex justify-content-center"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <div style={{ width: "100%", maxWidth: "500px" }}>
              <AchieverCarousel topAchivers={topAchivers} />
            </div>
          </div>
        </div>
      </div>

      {/* Row 1 → Meetings + Trainings */}
      <div className="row">

        {/* Upcoming Meetings */}
        <div className="col-xxl-6 col-xl-6 col-lg-6 mb-5">
          <div className="card h-100">
            <div className="card-body">
              <h6 className="mb-3 fw-bold text-xl">Upcoming Meetings</h6>

              <div
                className="d-flex align-items-stretch py-2"
                style={{
                  overflowX: "auto",
                  overflowY: "hidden",
                  whiteSpace: "nowrap",
                  gap: "1rem",
                }}
              >
                {upcomingMeetings?.map((event, index) => (
                  <div
                    key={event._id || index}
                    className="flex-shrink-0"
                    style={{
                      width: "250px",
                      backgroundColor: "#ffe3e3",
                      minHeight: "300px"
                    }}
                  >
                    <div className="border rounded p-3 h-100 d-flex flex-column">
                      <img
                        src={
                          event.image
                            ? `${IMAGE_BASE_URL}/${event.image.docPath}/${event.image.docName}`
                            : "https://media.istockphoto.com/id/499517325/photo/a-man-speaking-at-a-business-conference.jpg?s=612x612"
                        }
                        alt="Event"
                        style={{
                          width: "100%",
                          height: "200px",
                          objectFit: "cover",
                          borderRadius: "8px"
                        }}
                      />

                      <div className="mt-2 small">
                        <p><strong>Topic:</strong> {event.topic}</p>
                        <p><strong>Hotel Name:</strong> {event.hotelName}</p>
                        <p><strong>Start:</strong> {new Date(event.startDate).toLocaleString()}</p>
                        <p><strong>End:</strong> {new Date(event.endDate).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>

        {/* Upcoming Trainings */}
        <div className="col-xxl-6 col-xl-6 col-lg-6 mb-5">
          <div className="card h-100">
            <div className="card-body p-4">
              <h6 className="mb-3 fw-bold text-xl">Upcoming Trainings</h6>

              <div
                className="d-flex align-items-stretch py-2"
                style={{
                  overflowX: "auto",
                  overflowY: "hidden",
                  whiteSpace: "nowrap",
                  gap: "1rem",
                }}
              >
                {upcomingTrainings?.map((event, index) => (
                  <div
                    key={event._id || index}
                    className="flex-shrink-0"
                    style={{
                      width: "250px",
                      backgroundColor: "#ffe3e3",
                      minHeight: "300px"
                    }}
                  >
                    <div className="border rounded p-3 h-100 d-flex flex-column">

                      <div className="overflow-hidden flex-grow-1">
                        <img
                          src={
                            event.image
                              ? `${IMAGE_BASE_URL}/${event.image.docPath}/${event.image.docName}`
                              : "https://media.istockphoto.com/id/499517325/photo/a-man-speaking-at-a-business-conference.jpg"
                          }
                          style={{
                            width: "100%",
                            maxHeight: "200px",
                            objectFit: "cover",
                            borderRadius: "8px"
                          }}
                        />
                      </div>

                      <div className="mt-2 small">
                        <p><strong>Topic:</strong> {event.topic}</p>
                        <p><strong>Start:</strong> {new Date(event.startDate).toLocaleString()}</p>
                        <p><strong>End:</strong> {new Date(event.endDate).toLocaleString()}</p>

                        {event.trainingType && (
                          <p><strong>Training Type:</strong> {event?.trainingType || "entire_day"}</p>
                        )}
                      </div>

                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>

      </div>

      {/* Row 2 → Events */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card h-100">
            <div className="card-body">
              <h6 className="mb-3 fw-bold text-xl">Upcoming Events</h6>

              <div
                className="d-flex align-items-stretch py-2"
                style={{
                  overflowX: "auto",
                  overflowY: "hidden",
                  whiteSpace: "nowrap",
                  gap: "1rem",
                }}
              >
                {upcomingEvents?.filter(ev => ev && ev.topic)?.map((event, index) => (
                  <div
                    key={event._id || index}
                    className="flex-shrink-0"
                    style={{
                      width: "250px",
                      backgroundColor: "#ffe3e3",
                      minHeight: "300px"
                    }}
                  >
                    <div className="border rounded p-3 h-100 d-flex flex-column">

                      <img
                        src={
                          event.image
                            ? `${IMAGE_BASE_URL}/${event.image.docPath}/${event.image.docName}`
                            : "https://media.istockphoto.com/id/499517325/photo/a-man-speaking-at-a-business-conference.jpg"
                        }
                        style={{
                          width: "100%",
                          maxHeight: "200px",
                          objectFit: "cover",
                          borderRadius: "8px"
                        }}
                      />

                      <div className="mt-2 small">
                        <p><strong>Topic:</strong> {event.topic}</p>

                        {event.hotelName && (
                          <p><strong>Hotel Name:</strong> {event.hotelName}</p>
                        )}

                        <p><strong>Start:</strong> {new Date(event.startDate).toLocaleString()}</p>
                        <p><strong>End:</strong> {new Date(event.endDate).toLocaleString()}</p>
                      </div>

                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>
      {/* PALMS REPORT */}
      <div className="card h-100 p-0 radius-12">
        <div className="card-header border-bottom bg-base py-16 px-24">
          <h6 className="text-lg fw-semibold mb-0">PALMS Report</h6>
        </div>

        <div className="card-body chapterwisebox p-24">
          {paginatedMembers?.length > 0 ? (
            <>
              {/* TABLE */}
              <div className="table-responsive" style={{ overflowX: "auto" }}>
                <table className="table table-bordered align-middle">
                  <thead className="bg-light">
                    <tr>
                      <th>S.NO</th>
                      <th>Meetings</th>
                      <th>P</th>
                      <th>A</th>
                      <th>L</th>
                      <th>M</th>
                      <th>S</th>
                      <th>Events</th>      {/* NEW */}
                      <th>Training</th>    {/* NEW */}
                      <th>One-to-One</th>
                      <th>Referral Given</th>
                      <th>Referral Received</th>
                      <th>ThankYou Given</th>
                      <th>ThankYou Received</th>
                      <th>Visitors</th>
                      <th>Testimonial Given</th>
                      <th>Testimonial Received</th>
                    </tr>
                  </thead>

                  <tbody>
                    {paginatedMembers.map((member, index) => {
                      const defaultCounts = {
                        present: 0,
                        absent: 0,
                        late: 0,
                        managed: 0,
                        substitute: 0,
                      };

                      const meetings = attendanceCounts?.[member._id]?.meeting || defaultCounts;
                      const events = attendanceCounts?.[member._id]?.event || defaultCounts;
                      const training = attendanceCounts?.[member._id]?.training || defaultCounts;

                      const totalMeetings =
                        meetings.present +
                        meetings.absent +
                        meetings.late +
                        meetings.managed +
                        meetings.substitute;

                      const totalEvents =
                        events.present +
                        events.absent +
                        events.late +
                        events.managed +
                        events.substitute;

                      const totalTraining =
                        training.present +
                        training.absent +
                        training.late +
                        training.managed +
                        training.substitute;

                      return (
                        <tr key={member._id}>
                          <td>{index + 1}</td>
                          <td>{totalMeetings}</td>
                          <td>{meetings.present}</td>
                          <td>{meetings.absent}</td>
                          <td>{meetings.late}</td>
                          <td>{meetings.managed}</td>
                          <td>{meetings.substitute}</td>

                          <td>{totalEvents}</td>
                          <td>{totalTraining}</td>

                          <td>{oneToOneCounts[member._id]?.fromCount || 0}</td>
                          <td>{referralCounts[member._id]?.given || 0}</td>
                          <td>{referralCounts[member._id]?.received || 0}</td>
                          <td>{thankYouAmounts[member._id]?.given || 0}</td>
                          <td>{thankYouAmounts[member._id]?.received || 0}</td>
                          <td>{visitorCounts[member._id] || 0}</td>
                          <td>{testimonialCounts[member._id]?.given || 0}</td>
                          <td>{testimonialCounts[member._id]?.received || 0}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <p>No PALMS report found.</p>
          )}
        </div>
      </div>
      {/* onoe to one submit model */}
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl modal-dialog-centered">
          <div className="modal-content radius-16 bg-base">
            <div className="modal-header py-16 px-24 border border-top-0 border-start-0 border-end-0">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                One-to-One follow up
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>

            <div className="modal-body">
              <div className="row mb-3">
                <div className="col-sm-6 fw-medium">
                  Chapter: {userData?.chapterInfo?.chapterId?.chapterName}
                </div>
                <div className="col-sm-6 text-end fw-medium">
                  <span className="text-danger">*</span> Required fields
                </div>
              </div>

              <form
                onSubmit={handleSubmit}
                className="mx-auto pb-3"
                style={{ maxWidth: "700px" }}
              >
                <div className="row mb-24 gy-3 align-items-center">
                  <label className="form-label mb-0 col-sm-3">
                    Met With<span className="text-danger">*</span>
                  </label>
                  <div className="col-sm-4">
                    <select
                      className="form-select"
                      disabled={useCrossChapter}
                      value={selectedMember}
                      name="selectedMember"
                      onChange={(e) => setSelectedMember(e.target.value)}
                    >
                      <option value="">Select a member</option>
                      {members &&
                        members.map((member) => (
                          <option key={member.id} value={member.id}>
                            {member.name}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="col-sm-1 text-center">OR</div>
                  <div className="col-sm-4">
                    <button
                      type="button"
                      className="btn btn-primary grip w-100"
                      onClick={handleCrossChapterClick}
                    >
                      Search Cross Chapter
                    </button>
                  </div>
                </div>

                {useCrossChapter && (
                  <>
                    <div className="row mb-24 gy-3 align-items-center">
                      <label className="form-label mb-0 col-sm-3">
                        Select Chapter<span className="text-danger">*</span>
                      </label>
                      <div className="col-sm-9">
                        <select
                          className="form-select"
                          value={selectedChapter}
                          onChange={handleChapterChange}
                          required
                        >
                          <option value="">Select a chapter</option>
                          {chapterList.map((chapter) => (
                            <option key={chapter._id} value={chapter._id}>
                              {chapter.chapterName}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {selectedChapter && (
                      <div className="row mb-24 gy-3 align-items-center">
                        <label className="form-label mb-0 col-sm-3">
                          Select Member<span className="text-danger">*</span>
                        </label>
                        <div className="col-sm-9">
                          <select
                            className="form-select"
                            value={selectedMember}
                            onChange={(e) => {
                              setSelectedMember(e.target.value);
                              setRefferalFormErrors({});
                            }}
                            required
                          >
                            <option value="">Select a member</option>
                            {members &&
                              members.map((member) => (
                                <option key={member.name} value={member.id}>
                                  {member.name}
                                </option>
                              ))}
                          </select>
                        </div>
                      </div>
                    )}
                  </>
                )}

                <div className="row mb-24 gy-3 align-items-center">
                  <label className="form-label mb-0 col-sm-3">
                    Where did you meet?<span className="text-danger">*</span>
                  </label>
                  <div className="col-sm-9">
                    <select
                      className="form-select"
                      value={meetingLocationType}
                      onChange={(e) => setMeetingLocationType(e.target.value)}
                      required
                    >
                      <option value="">Select meeting location type</option>
                      <option value="yourlocation">At your location</option>
                      <option value="theirlocation">At their location</option>
                      <option value="commonlocation">
                        At a common location
                      </option>
                    </select>
                  </div>
                </div>

                <div className="row mb-24 gy-3 align-items-center">
                  <label className="form-label mb-0 col-sm-3">
                    Address<span className="text-danger">*</span>
                  </label>
                  <div className="col-sm-9">
                    <textarea
                      type="text"
                      className="form-control"
                      placeholder="Enter Address"
                      required
                      name="address"
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                </div>

                <div className="row mb-24 gy-3 align-items-center">
                  <label className="form-label mb-0 col-sm-3">
                    Date<span className="text-danger">*</span>
                  </label>
                  <div className="col-sm-9">
                    <input
                      type="date"
                      className="form-control"
                      defaultValue="2025-05-23"
                      required
                      name="date"
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="row mb-24 gy-3 align-items-center">
                  <label className="form-label mb-0 col-sm-3">
                    Upload Photo
                  </label>
                  <div className="col-sm-9">
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={(e) => setPhoto(e.target.files[0])}
                    />
                    <small className="text-muted">
                      Upload a photo related to the meeting (optional)
                    </small>
                  </div>
                </div>

                <div className="d-flex align-items-center justify-content-center gap-3 mt-24">
                  <button
                    type="submit"
                    className="btn btn-primary grip px-40 py-11 radius-8"
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-grip px-40 py-11 radius-8"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* Global search modal */}
      <div
        className="modal fade"
        id="globalSearchModal"
        tabIndex={-1}
        aria-labelledby="globalSearchModal"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-md modal-dialog-centered">
          <div
            className="modal-content radius-16 bg-base"
            style={{ height: "400px" }}
          >
            <div className="modal-header py-16 px-24 border border-top-0 border-start-0 border-end-0">
              <h1 className="modal-title fs-5" id="globalSearchModal">
                Global Search
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body ">
              <form action="#">
                <div className="row align-items-center">
                  <div className="col-12">
                    <div className="mb-20">
                      <label
                        htmlFor="desig"
                        className="form-label fw-semibold text-primary-light text-sm mb-8"
                      >
                        Zone
                      </label>
                      <select
                        name="zone"
                        className="form-select radius-8"
                        value={searchFields.zone}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Zone</option>
                        {zones?.map((zone) => (
                          <option key={zone._id} value={zone._id}>
                            {zone.zoneName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="mb-20">
                      <label
                        htmlFor="depart"
                        className="form-label fw-semibold text-primary-light text-sm mb-8"
                      >
                        Chapter Name
                      </label>
                      <select
                        name="chapter"
                        className="form-select radius-8"
                        value={searchFields.chapter}
                        onChange={handleInputChange}
                      >
                        <option value="">Select chapter</option>
                        {chapter?.map((item) => (
                          <option key={item._id} value={item._id}>
                            {item.chapterName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center mt-20 mb-20 justify-content-center gap-3">
                  <button
                    type="button"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    className="border border-danger-600 bg-hover-danger-200 text-danger-600 text-md px-56 py-11 radius-8"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn bg-gradient-blue-warning  text-white px-56 py-12 radius-8"
                    onClick={handleSearch}
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* member search modal */}
      <div
        className="modal fade"
        id="memberSearchModal"
        aria-labelledby="memberSearchModal"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content radius-16 bg-base">
            {/* Modal Header */}
            <div className="modal-header py-16 px-24 border border-top-0 border-start-0 border-end-0">
              <h1 className="modal-title fs-5" id="memberSearchModal">
                Search Results
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => {
                  setIsMemberDetails(false);
                  setSelectedMember({});
                  setShowRefPopup(false);
                }}
              />
            </div>

            {/* Modal Body */}
            <div className="modal-body">
              {isMemberDetails ? (
                <div className="container">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="col-12 text-center">
                      {/* Profile Image */}
                      <img
                        src={
                          selectedMember?.personalDetails?.profileImage
                            ?.docPath &&
                            selectedMember?.personalDetails?.profileImage?.docName
                            ? `${IMAGE_BASE_URL}/${selectedMember.personalDetails.profileImage.docPath}/${selectedMember.personalDetails.profileImage.docName}`
                            : "assets/images/avatar/avatar.jpg"
                        }
                        alt="avatar"
                        className="rounded-circle mb-3"
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                          border: "5px solid #51a5c4",
                        }}
                      />

                      {/* Member Name & Company */}
                      <p className="m-0" style={{ fontSize: "17px" }}>
                        <strong>
                          {selectedMember.personalDetails?.firstName}{" "}
                          {selectedMember.personalDetails?.lastName}
                        </strong>
                      </p>
                      <span style={{ color: "#cc4747", fontSize: "15px" }}>
                        <strong>
                          {selectedMember.personalDetails?.companyName}
                        </strong>
                      </span>
                      <br />
                      <span style={{ fontSize: "14px" }}>
                        <strong>
                          {selectedMember.personalDetails?.categoryRepresented}
                        </strong>
                      </span>

                      {/* Actions */}
                      <div className="d-flex justify-content-around mb-4 flex-wrap text-center mt-3">
                        {/* Referrals Given */}
                        <div className="d-flex flex-column align-items-center m-2">
                          <button
                            className="btn rounded-circle d-flex align-items-center justify-content-center"
                            style={{
                              width: "70px",
                              height: "70px",
                              background:
                                "linear-gradient(135deg, #b30000, #800000, #0b0b0bff)",
                              color: "white",
                            }}
                            onClick={() => handleRefGivenClick(selectedMember)}
                          >
                            <i className="bi bi-people fs-3"></i>
                          </button>
                          <small style={{ fontSize: "11px", marginTop: "5px" }}>
                            Referrals Given
                          </small>
                        </div>
                        <div className="d-flex flex-column align-items-center m-2">
                          <button
                            className="btn rounded-circle d-flex align-items-center justify-content-center"
                            style={{
                              width: "70px",
                              height: "70px",
                              background:
                                "linear-gradient(135deg, #b30000, #800000, #0b0b0bff)",
                              color: "white",
                            }}
                            onClick={() =>
                              handleRefReceivedClick(selectedMember)
                            }
                          >
                            <i className="bi bi-person-plus fs-3"></i>
                          </button>
                          <small style={{ fontSize: "11px", marginTop: "5px" }}>
                            Referrals Received
                          </small>
                        </div>

                        <div className="d-flex flex-column align-items-center m-2">
                          <button
                            className="btn rounded-circle d-flex align-items-center justify-content-center"
                            style={{
                              width: "70px",
                              height: "70px",
                              background:
                                "linear-gradient(135deg, #b30000, #800000, #0b0b0bff)",
                              color: "white",
                            }}
                            onClick={() =>
                              handleTestimonialGivenDatas(selectedMember)
                            }
                          >
                            <i className="bi bi-chat-left-quote fs-3"></i>
                          </button>
                          <small style={{ fontSize: "11px", marginTop: "5px" }}>
                            Testimonial Given
                          </small>
                        </div>

                        <div className="d-flex flex-column align-items-center m-2">
                          <button
                            className="btn rounded-circle d-flex align-items-center justify-content-center"
                            style={{
                              width: "70px",
                              height: "70px",
                              background:
                                "linear-gradient(135deg, #b30000, #800000, #0b0b0bff)",
                              color: "white",
                            }}
                            onClick={() =>
                              handleTestimonialReceivedDatas(selectedMember)
                            }
                          >
                            <i className="bi bi-chat-dots fs-3"></i>
                          </button>
                          <small style={{ fontSize: "11px", marginTop: "5px" }}>
                            Testimonial Received
                          </small>
                        </div>
                        {/* <div className="d-flex flex-column align-items-center m-2">
                          <button
                            className="btn rounded-circle"
                            onClick={() =>
                              handleTestimonialReceivedDatas(member)
                            }
                          >
                            <i className="bi bi-chat-right-quote fs-3"></i>
                          </button>
                          <small>Test. Received</small>
                        </div> */}

                        <div className="d-flex flex-column align-items-center m-2">
                          <button
                            className="btn rounded-circle d-flex align-items-center justify-content-center"
                            style={{
                              width: "70px",
                              height: "70px",
                              background:
                                "linear-gradient(135deg, #b30000, #800000, #0b0b0bff)", // red to maroon
                              color: "white",
                            }}
                            onClick={() => handleOneToOneDatas(selectedMember)}
                          >
                            <i className="bi bi-people-fill fs-3"></i>
                          </button>
                          <small style={{ fontSize: "11px", marginTop: "5px" }}>
                            One-to-One
                          </small>
                        </div>

                        <div className="d-flex flex-column align-items-center m-2">
                          <button
                            className="btn rounded-circle d-flex align-items-center justify-content-center"
                            style={{
                              width: "70px",
                              height: "70px",
                              background:
                                "linear-gradient(135deg, #b30000, #800000, #0b0b0bff)",
                              color: "white",
                            }}
                            onClick={() => handleVisitorDatas(selectedMember)}
                          >
                            <i className="bi bi-eye fs-3"></i>
                          </button>
                          <small style={{ fontSize: "11px", marginTop: "5px" }}>
                            Visitors
                          </small>
                        </div>

                        <div className="d-flex flex-column align-items-center m-2">
                          <button
                            className="btn rounded-circle d-flex align-items-center justify-content-center"
                            style={{
                              width: "70px",
                              height: "70px",
                              background:
                                "linear-gradient(135deg, #b30000, #800000, #0b0b0bff)",
                              color: "white",
                            }}
                          >
                            <i className="bi bi-building fs-3"></i>
                          </button>
                          <small style={{ fontSize: "11px", marginTop: "5px" }}>
                            Business
                          </small>
                        </div>

                        <div className="d-flex flex-column align-items-center m-2">
                          <button
                            className="btn rounded-circle d-flex align-items-center justify-content-center"
                            style={{
                              width: "70px",
                              height: "70px",
                              background:
                                "linear-gradient(135deg, #b30000, #800000, #0b0b0bff)",
                              color: "white",
                            }}
                            onClick={() => handleThankYouDatas(selectedMember)}
                          >
                            {/* Change icon to "bi-chat-text" for notes/messages */}
                            <i className="bi bi-chat-text fs-3"></i>
                          </button>
                          <small style={{ fontSize: "11px", marginTop: "5px" }}>
                            Thank You Notes Given
                          </small>
                        </div>
                      </div>

                      {/* Business Description */}
                      <div className="mt-3">
                        <span style={{ fontSize: "13px" }}>
                          {selectedMember.businessDetails
                            ?.businessDescription ||
                            "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout."}
                        </span>
                      </div>

                      {/* Contact Info */}
                      <div className="mt-3 text-start">
                        <p className="mb-2" style={{ fontSize: "13px" }}>
                          <strong>Mobile:</strong>{" "}
                          {selectedMember.contactDetails?.mobileNumber || "N/A"}
                        </p>
                        <p className="mb-2" style={{ fontSize: "13px" }}>
                          <strong>Email:</strong>{" "}
                          {selectedMember.contactDetails?.email || "N/A"}
                        </p>
                        <p className="mb-2" style={{ fontSize: "13px" }}>
                          <strong>Website:</strong>{" "}
                          {selectedMember.contactDetails?.website || "N/A"}
                        </p>
                        <p className="mb-2" style={{ fontSize: "13px" }}>
                          <strong>Chapter:</strong>{" "}
                          {selectedMember.chapterInfo?.chapterId?.chapterName ||
                            "N/A"}
                        </p>
                        <p className="mb-2" style={{ fontSize: "13px" }}>
                          <strong>Zone:</strong>{" "}
                          {selectedMember.chapterInfo?.zoneId?.zoneName ||
                            "N/A"}
                        </p>
                      </div>

                      {/* Back Button */}
                      <div className="text-end mt-3">
                        <button
                          style={{
                            border: "none",
                            outline: "none",
                            backgroundColor: "#51a5c4",
                            padding: "5px 10px",
                            color: "white",
                            borderRadius: "5px",
                          }}
                          onClick={() => {
                            setIsMemberDetails(false);
                            setSelectedMember({});
                            setShowRefPopup(false);
                          }}
                        >
                          Back
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Member Search */}
                  <form
                    className="navbar-searchh position-relative"
                    style={{ width: "400px", height: "50px" }}
                  >
                    <input
                      type="text"
                      name="search"
                      className="bg-white border-grip rounded-2 text-sm px-3 pe-5 h-100 w-100"
                      placeholder="Member search..."
                      onChange={(e) => memberInputChange(e.target.value)}
                      style={{ lineHeight: "1.1" }}
                    />
                    <Icon
                      icon="ion:search-outline"
                      className="position-absolute text-grip"
                      style={{
                        right: "12px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        fontSize: "20px",
                      }}
                    />
                  </form>

                  {/* Member List */}
                  <div className="d-flex flex-wrap gap-4 justify-content-center p-20">
                    {memberList.map((member, idx) => {
                      const initials = `${member.personalDetails?.firstName?.charAt(0) || ""
                        }${member.personalDetails?.lastName?.charAt(0) || ""}`;
                      const imageUrl = member.personalDetails?.profileImage
                        ?.docPath
                        ? `${IMAGE_BASE_URL}/${member.personalDetails.profileImage.docPath}/${member.personalDetails.profileImage.docName}`
                        : null;

                      return (
                        <div
                          key={member._id || idx}
                          onClick={() => {
                            handleMemberClick(member); // existing
                            // handleRefGivenClick(member);
                          }}
                          // on
                          className="d-flex flex-column align-items-center p-3 cursor-pointer"
                          style={{
                            width: "150px",
                            borderRadius: "16px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                            backgroundColor: "#fff",
                          }}
                        >
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt="avatar"
                              className="rounded"
                              style={{
                                width: "80px",
                                height: "70px",
                                borderRadius: "12px",
                                objectFit: "cover",
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: "80px",
                                height: "70px",
                                borderRadius: "12px",
                                backgroundColor: "#E53935",
                                color: "white",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "24px",
                                fontWeight: "bold",
                              }}
                            >
                              {initials}
                            </div>
                          )}

                          <div
                            className="fw-bold mt-2"
                            style={{ color: "#E53935", fontSize: "12px" }}
                          >
                            {member.personalDetails?.firstName}{" "}
                            {member.personalDetails?.lastName}
                          </div>

                          <div
                            className="text-center mb-2"
                            style={{ fontSize: "10px" }}
                          >
                            {member.personalDetails?.companyName}
                          </div>

                          <div
                            className="fw-bold text-white mt-auto text-center"
                            style={{
                              backgroundColor: "red",
                              borderRadius: "4px",
                              padding: "2px",
                              fontSize: "10px",
                              width: "100%",
                            }}
                          >
                            {member.personalDetails?.categoryRepresented?.toUpperCase() ||
                              "MEMBER"}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Referrals Popup */}
          </div>
        </div>
      </div>
      {/* popup1 */}
      <div
        className={`modal fade ${showRefPopup ? "show d-block" : ""}`}
        tabIndex="-1"
      >
        <div className="modal-dialog modal-xl modal-dialog-centered">
          <div
            className="modal-content"
            style={{ height: "80vh", width: "100vw" }}
          >
            {/* Header */}
            <div className="container modal-header">
              <p className="modal-title fw-bold text-danger m-0">
                Chapter : Referrals Given Report
              </p>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowRefPopup(false)}
              ></button>
            </div>
            <div
              className="d-flex align-items-end gap-3 mb-3 "
              style={{ paddingLeft: "8px", paddingRight: "8px" }}
            >
              <div>
                <label className="form-label">
                  Start Date <span className="text-danger">*</span>
                </label>
                <input
                  type="date"
                  className="form-control"
                  name="fromDate"
                  value={dateRange.fromDate}
                  onChange={handleDateRangeChange}
                />
              </div>
              <div>
                <label className="form-label">
                  End Date <span className="text-danger">*</span>
                </label>
                <input
                  type="date"
                  className="form-control"
                  name="toDate"
                  value={dateRange.toDate}
                  onChange={handleDateRangeChange}
                />
              </div>
              <button
                className="btn btn-primary grip"
                onClick={() => handleApplyDateFilter(getVisitorDatas)} // Change the function for each modal
              >
                Go
              </button>
            </div>
            {/* User + Chapter Info with Export/Print */}
            <div
              style={{
                backgroundColor: "#f8d7da",
                padding: "10px 15px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div className="d-flex align-items-center">
                <p className="m-0 me-3">
                  <strong>Running Member:</strong>{" "}
                  {selectedMember?.personalDetails?.firstName || "-"}{" "}
                  {selectedMember?.personalDetails?.lastName || "-"}
                </p>

                <p className="m-0 me-3">
                  <strong>Chapter:</strong>{" "}
                  {selectedMember?.chapterInfo?.chapterId?.chapterName || "-"}
                </p>
              </div>

              <div>
                <button
                  className="btn text-white btn-sm me-2"
                  style={{ background: "#b30000" }}
                >
                  Export
                </button>
                <button
                  className="btn text-white btn-sm"
                  style={{ background: "#b30000" }}
                >
                  Print
                </button>
              </div>
            </div>

            {/* Table with scroll if content overflows */}
            <div
              className="modal-body table-responsive"
              style={{
                flex: "1",
                overflowY: "auto",
                maxHeight: "65vh", // keeps table scrollable inside modal
              }}
            >
              {refGiven.length > 0 ? (
                <table
                  className="table table-bordered table-striped"
                  style={{ border: "1px solid #ddd", fontSize: "14px" }}
                >
                  <thead>
                    <tr>
                      {[
                        "Date",
                        "To Member",
                        "From Member",
                        "Referral Name",
                        "Category",
                        "Status",
                        "Phone Number",
                        "Address",
                        "Comments",
                      ].map((title, i) => (
                        <th
                          key={i}
                          style={{
                            backgroundColor: "#f8d7da",
                            textAlign: "center",
                          }}
                        >
                          {title}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {refGiven.map((ref, idx) => (
                      <tr
                        key={idx}
                        style={{
                          backgroundColor:
                            idx % 2 === 0 ? "#ffffff" : "#f9f9f9",
                        }}
                      >
                        <td>{new Date(ref.createdAt).toLocaleDateString()}</td>
                        <td>
                          {/* <p className="m-0 fw-bold">Member</p> */}
                          {ref.toMember?.personalDetails?.firstName || "-"}{" "}
                          {ref.toMember?.personalDetails?.lastName || "-"}
                        </td>
                        <td>
                          {/* <p className="m-0 fw-bold">From</p> */}
                          {ref.fromMember?.personalDetails?.firstName ||
                            "-"}{" "}
                          {ref.fromMember?.personalDetails?.lastName || "-"}
                        </td>
                        <td>{ref.referalDetail?.name || "-"}</td>
                        <td>{ref.referalDetail?.category || "-"}</td>
                        <td>{ref.referalStatus || "-"}</td>
                        <td>{ref.referalDetail?.mobileNumber || "-"}</td>
                        <td>{ref.referalDetail?.address || "-"}</td>
                        <td>{ref.referalDetail?.comments || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-center">No Referrals Found</p>
              )}
            </div>

            {/* Footer with Close button */}
            <div className="modal-footer">
              <button
                type="button"
                className="btn"
                onClick={() => setShowRefPopup(false)}
                style={{ border: "1px solid red", fontSize: "14px" }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`modal fade ${showRefReceivedPopup ? "show d-block" : ""}`}
        tabIndex="-1"
      >
        <div className="modal-dialog modal-xl modal-dialog-centered">
          <div
            className="modal-content"
            style={{
              height: "80vh", // fixed height
              width: "90vw", // fixed width
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Header */}
            <div className="container modal-header">
              <p className="modal-title fw-bold text-danger m-0">
                Chapter : Referrals Received Report
              </p>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowRefReceivedPopup(false)}
              ></button>
            </div>
            <div
              className="d-flex align-items-end gap-3 mb-3 "
              style={{ paddingLeft: "8px", paddingRight: "8px" }}
            >
              <div>
                <label className="form-label">
                  Start Date <span className="text-danger">*</span>
                </label>
                <input
                  type="date"
                  className="form-control"
                  name="fromDate"
                  value={dateRange.fromDate}
                  onChange={handleDateRangeChange}
                />
              </div>
              <div>
                <label className="form-label">
                  End Date <span className="text-danger">*</span>
                </label>
                <input
                  type="date"
                  className="form-control"
                  name="toDate"
                  value={dateRange.toDate}
                  onChange={handleDateRangeChange}
                />
              </div>
              <button
                className="btn btn-primary grip"
                onClick={() => handleApplyDateFilter(getVisitorDatas)} // Change the function for each modal
              >
                Go
              </button>
            </div>

            {/* Running Member + Buttons */}
            <div
              className="mt-2 d-flex flex-wrap justify-content-between align-items-center"
              style={{
                backgroundColor: "#f8d7da",
                padding: "10px 15px",
              }}
            >
              <div className="d-flex align-items-center">
                <p className="m-0 me-3">
                  <strong>Running Member:</strong>{" "}
                  {selectedMember?.personalDetails?.firstName || "-"}{" "}
                  {selectedMember?.personalDetails?.lastName || "-"}
                </p>

                <p className="m-0 me-3">
                  <strong>Chapter:</strong>{" "}
                  {selectedMember?.chapterInfo?.chapterId?.chapterName || "-"}
                </p>
              </div>

              <div className="d-flex gap-2">
                <button
                  className="btn text-white btn-sm"
                  style={{ background: "#b30000" }}
                >
                  Export
                </button>
                <button
                  className="btn text-white btn-sm"
                  style={{ background: "#b30000" }}
                >
                  Print
                </button>
              </div>
            </div>

            {/* Body (scrolls inside fixed height) */}
            <div
              className="modal-body table-responsive flex-grow-1"
              style={{ overflowY: "auto" }}
            >
              {refReceived.length > 0 ? (
                <table
                  className="table table-bordered table-striped"
                  style={{ fontSize: "14px" }}
                >
                  <thead>
                    <tr>
                      {[
                        "Date",
                        "To Member",
                        "From Member",
                        "Referral Name",
                        "Category",
                        "Status",
                        "Phone Number",
                        "Address",
                        "Comments",
                      ].map((title, i) => (
                        <th
                          key={i}
                          style={{ background: "#f8d7da", textAlign: "center" }}
                        >
                          {title}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {refReceived.map((ref, idx) => (
                      <tr
                        key={idx}
                        style={{
                          backgroundColor: idx % 2 === 0 ? "#fff" : "#f9f9f9",
                        }}
                      >
                        <td>{new Date(ref.createdAt).toLocaleDateString()}</td>
                        <td>
                          {ref.toMember?.personalDetails?.firstName || "-"}{" "}
                          {ref.toMember?.personalDetails?.lastName || "-"}
                        </td>
                        <td>
                          {ref.fromMember?.personalDetails?.firstName || "-"}{" "}
                          {ref.fromMember?.personalDetails?.lastName || "-"}
                        </td>
                        <td>{ref.referalDetail?.name || "-"}</td>
                        <td>{ref.referalDetail?.category || "-"}</td>
                        <td>{ref.referalStatus || "-"}</td>
                        <td>{ref.referalDetail?.mobileNumber || "-"}</td>
                        <td>{ref.referalDetail?.address || "-"}</td>
                        <td>{ref.referalDetail?.comments || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-center">No Referrals Found</p>
              )}
            </div>

            {/* Footer */}
            <div className="modal-footer">
              <button
                type="button"
                className="btn"
                onClick={() => setShowRefReceivedPopup(false)}
                style={{ border: "1px solid red" }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Testimonial Given Modal */}
      <div
        className={`modal fade ${showTestimonialGivenPopup ? "show d-block" : ""
          }`}
        tabIndex="-1"
      >
        <div
          className="modal-dialog modal-xl modal-dialog-centered"
          style={{ maxWidth: "1450px", minWidth: "320px" }}
        >
          <div
            className="modal-content radius-16 bg-base d-flex flex-column"
            style={{ height: "90vh" }}
          >
            {/* Header */}
            <div className="modal-header py-2 px-3 px-md-4 border-0 flex-shrink-0">
              <h5 className="modal-title text-danger">
                Chapter : Testimonial Given Report
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowTestimonialGivenPopup(false)}
              />
            </div>

            {/* Date Filters */}
            <div className="d-flex flex-column flex-md-row align-items-start align-md-end gap-2 px-2 px-md-3 flex-shrink-0">
              <div className="flex-fill" style={{ maxWidth: "200px" }}>
                <label className="form-label">
                  Start Date <span className="text-danger">*</span>
                </label>
                <input
                  type="date"
                  className="form-control"
                  name="fromDate"
                  value={dateRange.fromDate}
                  onChange={handleDateRangeChange}
                />
              </div>
              <div className="flex-fill" style={{ maxWidth: "200px" }}>
                <label className="form-label">
                  End Date <span className="text-danger">*</span>
                </label>
                <input
                  type="date"
                  className="form-control"
                  name="toDate"
                  value={dateRange.toDate}
                  onChange={handleDateRangeChange}
                />
              </div>
              <div className="mt-2 mt-md-0">
                <button
                  className="btn btn-primary grip"
                  onClick={handleApplyDateFilter}
                >
                  Go
                </button>
              </div>
            </div>

            {/* Info + Actions */}
            <div
              className="d-flex flex-column flex-md-row justify-content-between align-items-start align-md-center p-2 p-md-3 mb-3 flex-shrink-0"
              style={{
                backgroundColor: "#f8d7da",
                gap: "10px",
                height: "auto",
              }}
            >
              {/* Member + Chapter Info */}
              <div className="d-flex flex-column flex-sm-row gap-2 gap-md-3">
                <div>
                  <p className="m-0 fw-bold">
                    <strong>Running Member</strong> <br />
                    {selectedMember?.personalDetails?.firstName || "-"}{" "}
                    {selectedMember?.personalDetails?.lastName || "-"}
                  </p>
                </div>
                <div>
                  <p className="m-0 fw-bold">
                    <strong>Chapter</strong> <br />
                    {selectedMember?.chapterInfo?.chapterId?.chapterName || "-"}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-flex flex-row gap-2 mt-2 mt-md-0 flex-wrap">
                <button
                  className="btn btn-sm text-white"
                  style={{ background: "#b30000" }}
                >
                  Export
                </button>
                <button
                  className="btn btn-sm text-white"
                  style={{ background: "#b30000" }}
                >
                  Print
                </button>
              </div>
            </div>

            {/* Body with Table (scrollable, partially visible on small screens) */}
            <div
              className="modal-body flex-grow-1 p-0"
              style={{
                overflowY: "auto",
                minHeight: "150px",
              }}
            >
              <div className="table-responsive">
                {testimonialGivenDatas.length > 0 ? (
                  <table className="table table-bordered table-striped mb-0">
                    <thead className="table-danger grip">
                      <tr>
                        <th>Date</th>
                        <th>To Member</th>
                        <th>From Member</th>
                        <th>Photo</th>
                        <th>Comments</th>
                      </tr>
                    </thead>
                    <tbody>
                      {testimonialGivenDatas.map((item) => {
                        const formatDate = (dateString) =>
                          new Date(dateString).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "2-digit",
                          });
                        const toMemberName = `${item.toMember.personalDetails.firstName} ${item.toMember.personalDetails.lastName}`;
                        const fromMemberName = `${item.fromMember.personalDetails.firstName} ${item.fromMember.personalDetails.lastName}`;
                        return (
                          <tr key={item._id}>
                            <td>{formatDate(item.createdAt)}</td>
                            <td>{toMemberName}</td>
                            <td>{fromMemberName}</td>
                            <td>
                              <img
                                style={{
                                  width: "50px",
                                  maxWidth: "50px",
                                  borderRadius: "4px",
                                }}
                                src={`${IMAGE_BASE_URL}/${item.images[0]?.docPath}/${item.images[0]?.docName}`}
                                alt="testimonial"
                              />
                            </td>
                            <td>{item.comments}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-center m-2">No Testimonials Found</p>
                )}
              </div>
            </div>

            {/* Footer */}
            {/* Footer */}
            <div className="modal-footer border-top-0 flex-shrink-0 justify-content-end">
              <button
                type="button"
                className="btn btn-outline-danger"
                style={{ minWidth: "80px" }}
                onClick={() => setShowTestimonialGivenPopup(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Testimonial received Modal */}
      <div
        className={`modal ${showTestimonialReceivedPopup ? "d-block" : "d-none"
          }`}
        tabIndex="-1"
      >
        <div
          className="modal-dialog modal-xl modal-dialog-centered"
          style={{
            width: "90%",
            maxWidth: "1450px",
            minWidth: "300px",
            maxHeight: "90vh",
            margin: "auto",
          }}
        >
          <div
            className="modal-content radius-16 bg-base d-flex flex-column"
            style={{ height: "90vh" }}
          >
            {/* Header */}
            <div className="modal-header py-16 px-2 px-md-4 border-top-0 border-start-0 border-end-0">
              <h1 className="modal-title fs-5 text-danger">
                Chapter : Testimonial Received Report
              </h1>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowTestimonialReceivedPopup(false)}
              />
            </div>

            {/* Filters */}
            <div className="d-flex flex-column flex-md-row align-items-start align-md-end gap-2 mb-3 px-2">
              <div className="flex-fill" style={{ maxWidth: "200px" }}>
                <label className="form-label">
                  Start Date <span className="text-danger">*</span>
                </label>
                <input
                  type="date"
                  className="form-control"
                  name="fromDate"
                  value={dateRange.fromDate}
                  onChange={handleDateRangeChange}
                />
              </div>
              <div className="flex-fill" style={{ maxWidth: "200px" }}>
                <label className="form-label">
                  End Date <span className="text-danger">*</span>
                </label>
                <input
                  type="date"
                  className="form-control"
                  name="toDate"
                  value={dateRange.toDate}
                  onChange={handleDateRangeChange}
                />
              </div>
              <div className="mt-2 mt-md-0">
                <button
                  className="btn btn-primary grip w-100 w-md-auto"
                  onClick={() => handleApplyDateFilter(getVisitorDatas)}
                >
                  Go
                </button>
              </div>
            </div>

            {/* Running Member + Chapter */}
            <div
              className="mt-2 p-3 d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center"
              style={{ backgroundColor: "#f8d7da", gap: "10px" }}
            >
              <div className="d-flex flex-column flex-sm-row gap-3 w-100 w-md-auto">
                <div>
                  <p className="m-0">
                    <strong>Running Member</strong> <br />
                    {selectedMember?.personalDetails?.firstName || "-"}{" "}
                    {selectedMember?.personalDetails?.lastName || "-"}
                  </p>
                </div>
                <div>
                  <p className="m-0">
                    <strong>Chapter</strong> <br />
                    {selectedMember?.chapterInfo?.chapterId?.chapterName || "-"}
                  </p>
                </div>
              </div>

              <div className="d-flex gap-2 mt-2 mt-md-0">
                <button
                  className="btn text-white btn-sm"
                  style={{ background: "#b30000" }}
                >
                  Export
                </button>
                <button
                  className="btn text-white btn-sm"
                  style={{ background: "#b30000" }}
                >
                  Print
                </button>
              </div>
            </div>

            {/* Table */}
            <div
              className="modal-body p-0 mt-3"
              style={{
                overflowY: "auto",
                flex: "1 1 auto",
                minHeight: "100px",
                maxHeight: "calc(90vh - 200px)", // adjust for header + filters + member info
              }}
            >
              <div className="table-responsive" style={{ overflowX: "auto" }}>
                {testimonialReceivedDatas.length > 0 ? (
                  <table
                    className="table table-bordered table-striped mb-0"
                    style={{ minWidth: "600px" }}
                  >
                    <thead className="table-danger grip">
                      <tr className="text-xs">
                        <th>Date</th>
                        <th>To Member</th>
                        <th>From Member</th>
                        <th>Photo</th>
                        <th>Comments</th>
                      </tr>
                    </thead>
                    <tbody>
                      {testimonialReceivedDatas.map((item) => {
                        const formatDate = (dateString) =>
                          new Date(dateString).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "2-digit",
                          });
                        const toMemberName = `${item.toMember.personalDetails.firstName} ${item.toMember.personalDetails.lastName}`;
                        const fromMemberName = `${item.fromMember.personalDetails.firstName} ${item.fromMember.personalDetails.lastName}`;
                        return (
                          <tr key={item._id} className="text-xs">
                            <td>{formatDate(item.createdAt)}</td>
                            <td>{toMemberName}</td>
                            <td>{fromMemberName}</td>
                            <td>
                              <img
                                style={{ width: "50px", maxWidth: "50px" }}
                                src={`${IMAGE_BASE_URL}/${item.images[0]?.docPath}/${item.images[0]?.docName}`}
                                alt="testimonial"
                              />
                            </td>
                            <td>{item.comments}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-center m-2">No Testimonials Found</p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="modal-footer border-top-0">
              <button
                type="button"
                className="btn text-grip btn-outline-grip"
                onClick={() => setShowTestimonialReceivedPopup(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* visitor popup */}
      {/* <div
          className="modal fade"
          id="visitorReceiveModal"
          tabIndex="-1"
          aria-labelledby="visitorReceiveModal"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-xl modal-dialog-centered">
            <div className="modal-content radius-16 bg-base">
              <div className="modal-header py-16 px-24 border border-top-0 border-start-0 border-end-0">
                <h1
                  className="modal-title fs-5 text-danger"
                  id="visitorReceiveModal"
                >
                  Chapter : Visitor Report
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>

              <div className="modal-body">
               
                <div className="d-flex align-items-end gap-3 mb-3">
                  <div>
                    <label className="form-label">
                      Start Date <span className="text-danger">*</span>
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      name="fromDate"
                      value={dateRange.fromDate}
                      onChange={handleDateRangeChange}
                    />
                  </div>
                  <div>
                    <label className="form-label">
                      End Date <span className="text-danger">*</span>
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      name="toDate"
                      value={dateRange.toDate}
                      onChange={handleDateRangeChange}
                    />
                  </div>
                  <button
                    className="btn btn-primary grip"
                    onClick={() => handleApplyDateFilter(getVisitorDatas)}
                  >
                    Go
                  </button>
                </div>

               
                <div className="reportdetailss overflow-x-auto">
                  <div className="bg-danger-100 p-3 rounded d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <div>
                        <strong>Chapter : Visitor Report</strong>
                      </div>
                      <div className="d-flex gap-5 mt-2">
                        <small>
                          Selected Member
                          <br />
                          <strong>
                            {selectedMember?.personalDetails?.firstName}{" "}
                            {selectedMember?.personalDetails?.lastName}
                          </strong>
                        </small>
                        <small>
                          Chapter
                          <br />
                          <strong>
                            {
                              selectedMember?.chapterInfo?.chapterId
                                ?.chapterName
                            }
                          </strong>
                        </small>
                      </div>
                    </div>

                    <div className="d-flex gap-2">
                      <button className="btn btn-primary grip text-xs btn-sm">
                        Export
                      </button>
                      <button className="btn btn-primary grip text-xs btn-sm">
                        Print
                      </button>
                    </div>
                  </div>

               
                  <div className="table-responsive">
                    <table className="table table-bordered table-striped">
                      <thead className="table-danger grip">
                        <tr className="text-xs">
                          <th>Visit Date</th>
                          <th>Name</th>
                          <th>Company</th>
                          <th>Category</th>
                          <th>Mobile</th>
                          <th>Email</th>
                          <th>Address</th>
                          <th>Invited By</th>
                        </tr>
                      </thead>
                      <tbody>
                        {visitorsDatas &&
                          visitorsDatas.map((item) => {
                            const formattedDate = new Date(item.visitDate)
                              .toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "2-digit",
                              })
                              .replace(/\//g, "/");

                            const invitedByName = `${item.invitedBy.personalDetails.firstName} ${item.invitedBy.personalDetails.lastName}`;

                            return (
                              <tr key={item._id} className="text-xs">
                                <td>{formattedDate}</td>
                                <td>{item.name}</td>
                                <td>{item.company}</td>
                                <td>{item.category}</td>
                                <td>{item.mobile}</td>
                                <td>{item.email}</td>
                                <td>{item.address}</td>
                                <td>{invitedByName}</td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="modal-footer border-top-0">
                <button
                  type="button"
                  className="btn text-grip btn-outline-grip"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div> */}
      {showVisitorPopup && (
        <>
          {/* Backdrop */}
          <div
            className="modal-backdrop fade show"
            style={{ zIndex: 1040 }}
            onClick={() => setShowVisitorPopup(false)}
          ></div>

          <div
            className="modal fade show d-block"
            tabIndex="-1"
            role="dialog"
            style={{ zIndex: 2000 }}
          >
            <div
              className="modal-dialog modal-xl modal-dialog-centered"
              role="document"
            >
              <div className="modal-content radius-16 bg-base">
                {/* Header */}
                <div className="modal-header py-16 px-24 border border-top-0 border-start-0 border-end-0">
                  <h1 className="modal-title fs-5 text-danger">
                    Chapter : Visitor Report
                  </h1>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowVisitorPopup(false)}
                  ></button>
                </div>

                {/* Body */}
                <div className="modal-body">
                  {/* Date Filter */}
                  <div className="d-flex flex-wrap align-items-end gap-3 mb-3">
                    {/* Start Date */}
                    <div
                      className="flex-grow-1"
                      style={{ minWidth: "120px", maxWidth: "200px" }}
                    >
                      <label className="form-label">
                        Start Date <span className="text-danger">*</span>
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        name="fromDate"
                        value={dateRange.fromDate}
                        onChange={handleDateRangeChange}
                      />
                    </div>

                    {/* End Date */}
                    <div
                      className="flex-grow-1"
                      style={{ minWidth: "120px", maxWidth: "200px" }}
                    >
                      <label className="form-label">
                        End Date <span className="text-danger">*</span>
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        name="toDate"
                        value={dateRange.toDate}
                        onChange={handleDateRangeChange}
                      />
                    </div>

                    {/* Go Button */}
                    <div>
                      <button
                        className="btn btn-primary grip"
                        style={{ minWidth: "60px" }}
                      // onClick={() => handleApplyDateFilter(visitorsDatas)}
                      >
                        Go
                      </button>
                    </div>
                  </div>

                  {/* Selected Member Info */}
                  <div className="reportdetailss overflow-x-auto">
                    <div className="bg-danger-100 p-3 rounded d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <strong>Selected Member:</strong>{" "}
                        {selectedMember?.personalDetails?.firstName}{" "}
                        {selectedMember?.personalDetails?.lastName} | Chapter:{" "}
                        {selectedMember?.chapterInfo?.chapterId?.chapterName}
                      </div>
                      <div className="d-flex gap-2 mt-2 mt-md-0">
                        <button
                          className="btn text-white btn-sm"
                          style={{ background: "#b30000" }}
                        >
                          Export
                        </button>
                        <button
                          className="btn text-white btn-sm"
                          style={{ background: "#b30000" }}
                        >
                          Print
                        </button>
                      </div>
                    </div>

                    {/* Visitors Table */}
                    <div className="table-responsive">
                      <table className="table table-bordered table-striped">
                        <thead className="table-danger grip">
                          <tr className="text-xs">
                            <th>Visit Date</th>
                            <th>Name</th>
                            <th>Company</th>
                            <th>Category</th>
                            <th>Mobile</th>
                            <th>Email</th>
                            <th>Address</th>
                            <th>Invited By</th>
                          </tr>
                        </thead>
                        <tbody>
                          {visitorsDatas.length > 0 ? (
                            visitorsDatas.map((item) => {
                              const formattedDate = new Date(
                                item.visitDate
                              ).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "2-digit",
                              });
                              const invitedByName = `${item.invitedBy.personalDetails.firstName} ${item.invitedBy.personalDetails.lastName}`;
                              return (
                                <tr key={item._id}>
                                  <td>{formattedDate}</td>
                                  <td>{item.name}</td>
                                  <td>{item.company}</td>
                                  <td>{item.category}</td>
                                  <td>{item.mobile}</td>
                                  <td>{item.email}</td>
                                  <td>{item.address}</td>
                                  <td>{invitedByName}</td>
                                </tr>
                              );
                            })
                          ) : (
                            <tr>
                              <td colSpan="8" className="text-center">
                                No visitors found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="modal-footer border-top-0">
                  <button
                    type="button"
                    className="btn text-grip btn-outline-grip"
                    onClick={() => setShowVisitorPopup(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {/* thankugiven */}
      {showThankYouPopup && (
        <>
          {/* Backdrop */}
          <div
            className="modal-backdrop fade show"
            style={{ zIndex: 1040 }}
            onClick={() => setShowThankYouPopup(false)}
          ></div>

          <div
            className="modal fade show d-block"
            tabIndex="-1"
            role="dialog"
            style={{ zIndex: 2000 }}
          >
            <div
              className="modal-dialog modal-xl modal-dialog-centered"
              role="document"
            >
              <div className="modal-content radius-16 bg-base">
                {/* Header */}
                <div className="modal-header py-16 px-24 border border-top-0 border-start-0 border-end-0">
                  <h1 className="modal-title fs-5 text-danger">
                    Chapter: Thank You Given Report
                  </h1>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowThankYouPopup(false)}
                  ></button>
                </div>

                {/* Body */}
                <div className="modal-body">
                  {/* Date Filter */}
                  <div className="d-flex flex-wrap align-items-end gap-3 mb-3">
                    <div
                      className="flex-grow-1"
                      style={{ minWidth: "120px", maxWidth: "200px" }}
                    >
                      <label className="form-label">
                        Start Date <span className="text-danger">*</span>
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        name="fromDate"
                        value={dateRange.fromDate}
                        onChange={handleDateRangeChange}
                      />
                    </div>
                    <div
                      className="flex-grow-1"
                      style={{ minWidth: "120px", maxWidth: "200px" }}
                    >
                      <label className="form-label">
                        End Date <span className="text-danger">*</span>
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        name="toDate"
                        value={dateRange.toDate}
                        onChange={handleDateRangeChange}
                      />
                    </div>
                    <button
                      className="btn btn-primary grip"
                      onClick={() => handleApplyDateFilter(thankYouSlipDatas)}
                    >
                      Go
                    </button>
                  </div>

                  {/* Selected Member Info */}
                  <div className="reportdetailss overflow-x-auto mb-3">
                    <div className="bg-danger-100 p-3 rounded d-flex justify-content-between align-items-center">
                      <div>
                        <strong>Selected Member:</strong>{" "}
                        {selectedMember?.personalDetails?.firstName}{" "}
                        {selectedMember?.personalDetails?.lastName} | Chapter:{" "}
                        {selectedMember?.chapterInfo?.chapterId?.chapterName}
                      </div>
                    </div>
                  </div>

                  {/* Table */}
                  <div className="table-responsive">
                    <table className="table table-bordered table-striped">
                      <thead className="table-danger grip">
                        <tr className="text-xs">
                          <th>Date</th>
                          <th>To Member</th>
                          <th>From Member</th>
                          <th>Amount</th>
                          <th>Comments</th>
                        </tr>
                      </thead>
                      <tbody>
                        {thankYouSlipDatas.length > 0 ? (
                          thankYouSlipDatas.map((item) => {
                            const formatDate = new Date(
                              item.createdAt
                            ).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "2-digit",
                            });
                            const toMember = `${item.toMember?.personalDetails?.firstName} ${item.toMember?.personalDetails?.lastName}`;
                            const fromMember = `${item.fromMember?.personalDetails?.firstName} ${item.fromMember?.personalDetails?.lastName}`;
                            return (
                              <tr key={item._id}>
                                <td>{formatDate}</td>
                                <td>{toMember}</td>
                                <td>{fromMember}</td>
                                <td>{item.amount}</td>
                                <td>{item.comments}</td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan="5" className="text-center">
                              No records found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Footer */}
                <div className="modal-footer border-top-0">
                  <button
                    type="button"
                    className="btn text-grip btn-outline-grip"
                    onClick={() => setShowThankYouPopup(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {/* one-to-one */}
      {showOneToOnePopup && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ zIndex: 2000 }}
        >
          <div
            className="modal-dialog modal-xl modal-dialog-centered"
            role="document"
          >
            <div className="modal-content radius-16 bg-base">
              {/* Header */}
              <div className="modal-header py-16 px-24 border border-top-0 border-start-0 border-end-0">
                <h1 className="modal-title fs-5 text-danger">
                  Chapter : One to One Report
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowOneToOnePopup(false)}
                ></button>
              </div>

              {/* Body */}
              <div className="modal-body">
                <div className="d-flex flex-wrap align-items-end gap-3 mb-3">
                  <div
                    className="flex-grow-1"
                    style={{ minWidth: "120px", maxWidth: "200px" }}
                  >
                    <label className="form-label">
                      Start Date <span className="text-danger">*</span>
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      name="fromDate"
                      value={dateRange.fromDate}
                      onChange={handleDateRangeChange}
                    />
                  </div>
                  <div
                    className="flex-grow-1"
                    style={{ minWidth: "120px", maxWidth: "200px" }}
                  >
                    <label className="form-label">
                      End Date <span className="text-danger">*</span>
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      name="toDate"
                      value={dateRange.toDate}
                      onChange={handleDateRangeChange}
                    />
                  </div>
                  <button
                    className="btn btn-primary grip"
                    onClick={() => handleApplyDateFilter(thankYouSlipDatas)}
                  >
                    Go
                  </button>
                </div>

                <div className="reportdetailss overflow-x-auto mb-3">
                  <div className="bg-danger-100 p-3 rounded d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <strong>Ruuning Member: </strong>
                      {selectedMember?.personalDetails
                        ? `${selectedMember.personalDetails.firstName || ""} ${selectedMember.personalDetails.lastName || ""
                        }`
                        : "N/A"}{" "}
                      | Chapter:{" "}
                      {selectedMember?.chapterInfo?.chapterId?.chapterName ||
                        "N/A"}
                    </div>
                    <div className="d-flex gap-2 mt-2 mt-md-0">
                      <button
                        className="btn text-white btn-sm"
                        style={{ background: "#b30000" }}
                      >
                        Export
                      </button>
                      <button
                        className="btn text-white btn-sm"
                        style={{ background: "#b30000" }}
                      >
                        Print
                      </button>
                    </div>
                  </div>

                  <div className="table-responsive">
                    <table className="table table-bordered table-striped">
                      <thead className="table-danger grip">
                        <tr className="text-xs">
                          <th>Date</th>
                          <th>To Member</th>
                          <th>From Member</th>
                          <th>Meeting Location</th>
                          <th>Photo</th>
                          <th>Address</th>
                          <th>Created At</th>
                        </tr>
                      </thead>
                      <tbody>
                        {onToOneDatas?.length ? (
                          onToOneDatas.map((item) => {
                            if (!item) return null; // skip null items

                            const formatDate = (date) =>
                              date
                                ? new Date(date).toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "2-digit",
                                })
                                : "N/A";

                            const toMemberName = item.toMember?.personalDetails
                              ? `${item.toMember.personalDetails.firstName || ""
                              } ${item.toMember.personalDetails.lastName || ""
                              }`
                              : "N/A";

                            const fromMemberName = item.fromMember
                              ?.personalDetails
                              ? `${item.fromMember.personalDetails.firstName ||
                              ""
                              } ${item.fromMember.personalDetails.lastName || ""
                              }`
                              : "N/A";

                            const meetingLocation =
                              item.whereDidYouMeet === "commonlocation"
                                ? "Common Location"
                                : item.whereDidYouMeet
                                  ? item.whereDidYouMeet.charAt(0).toUpperCase() +
                                  item.whereDidYouMeet.slice(1)
                                  : "N/A";

                            return (
                              <tr key={item._id || Math.random()}>
                                <td>{formatDate(item.date)}</td>
                                <td>{toMemberName}</td>
                                <td>{fromMemberName}</td>
                                <td>{meetingLocation}</td>
                                <td>
                                  {item.images?.[0]?.docPath &&
                                    item.images?.[0]?.docName ? (
                                    <img
                                      style={{ width: "50px" }}
                                      src={`${IMAGE_BASE_URL}/${item.images[0].docPath}/${item.images[0].docName}`}
                                      alt="One-to-One"
                                    />
                                  ) : (
                                    "N/A"
                                  )}
                                </td>
                                <td>{item.address || "N/A"}</td>
                                <td>{formatDate(item.createdAt)}</td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan="7" className="text-center">
                              No records found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="modal-footer border-top-0">
                <button
                  type="button"
                  className="btn text-grip btn-outline-grip"
                  onClick={() => setShowOneToOnePopup(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Result Modal */}
      <div
        className="modal fade"
        id="searchResultModal"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content radius-16 bg-base">
            <div className="modal-header py-16 px-24 border border-top-0 border-start-0 border-end-0">
              <h1 className="modal-title fs-5" id="searchResultModal">
                Search Results
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => {
                  setdetails(false);
                  setSelectedMember({});
                  setismemberDetails(false);
                }}
              />
            </div>
            <div className="modal-body">
              {details ? (
                <>
                  <div className="container">
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="col-12">
                        <div className="text-center">
                          {selectedMember?.personalDetails?.profileImage
                            ?.docPath &&
                            selectedMember?.personalDetails?.profileImage
                              ?.docName ? (
                            <img
                              src={`${IMAGE_BASE_URL}/${selectedMember.personalDetails.profileImage.docPath}/${selectedMember.personalDetails.profileImage.docName}`}
                              alt="avatar"
                              className="rounded-circle mb-3"
                              style={{
                                width: "100px",
                                height: "100px",
                                objectFit: "cover",
                                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                                border: "5px solid #51a5c4",
                              }}
                            />
                          ) : (
                            // fallback to initials if no image available
                            <img
                              src="assets/images/avatar/avatar.jpg"
                              className="rounded-circle mb-3"
                              style={{
                                width: "100px",
                                height: "100px",
                                objectFit: "cover",
                                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                                border: "5px solid #51a5c4",
                              }}
                            ></img>
                          )}
                        </div>

                        <div className="text-center">
                          <p className="m-0" style={{ fontSize: "17px" }}>
                            <strong>
                              {selectedMember.personalDetails?.firstName}{" "}
                              {selectedMember.personalDetails?.lastName}
                            </strong>
                          </p>
                          <span style={{ color: "#cc4747", fontSize: "15px" }}>
                            <strong>
                              {selectedMember.personalDetails?.companyName}
                            </strong>
                          </span>
                          <br />
                          <span style={{ fontSize: "14px" }}>
                            <strong>
                              {
                                selectedMember.personalDetails
                                  ?.categoryRepresented
                              }
                            </strong>
                          </span>
                        </div>

                        <div className="mt-3">
                          <span style={{ fontSize: "13px" }}>
                            {selectedMember.businessDetails
                              ?.businessDescription ||
                              `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.`}
                          </span>
                        </div>
                        <div className="mt-3">
                          <p className="mb-2" style={{ fontSize: "13px" }}>
                            <strong>Mobile:</strong>{" "}
                            {selectedMember.contactDetails?.mobileNumber}
                          </p>
                          <p className="mb-2" style={{ fontSize: "13px" }}>
                            <strong>Email:</strong>{" "}
                            {selectedMember.contactDetails?.email ||
                              "admin@gmail.com"}
                          </p>
                          <p className="mb-2" style={{ fontSize: "13px" }}>
                            <strong>Website:</strong>{" "}
                            {selectedMember.contactDetails?.website || "N/A"}
                          </p>
                          <p className="mb-2" style={{ fontSize: "13px" }}>
                            <strong>Chapter:</strong>{" "}
                            {selectedMember.chapterInfo.chapterId
                              ?.chapterName || "N/A"}
                          </p>
                          <p className="mb-2" style={{ fontSize: "13px" }}>
                            <strong>Zone:</strong>{" "}
                            {selectedMember.chapterInfo.zoneId?.zoneName ||
                              "N/A"}
                          </p>
                          <p className="mb-2" style={{ fontSize: "13px" }}>
                            <strong>Address:</strong>{" "}
                            {`
                                                        ${selectedMember
                                .businessAddress
                                ?.addressLine1 || ""
                              }
                                                        ${selectedMember
                                .businessAddress
                                ?.addressLine2 || ""
                              }
                                                        ${selectedMember
                                .businessAddress
                                ?.city || ""
                              }
                                                        ${selectedMember
                                .businessAddress
                                ?.postalCode || ""
                              }
                                                        ${selectedMember
                                .businessAddress
                                ?.state || ""
                              }
                                                    `
                              .replace(/\s+/g, " ")
                              .trim() || "N/A"}
                          </p>
                        </div>
                        <div className="text-end mt-3">
                          <button
                            style={{
                              border: "none",
                              outline: "none",
                              backgroundColor: "#51a5c4",
                              padding: "5px 10px",
                              color: "white",
                              borderRadius: "5px",
                            }}
                            onClick={() => {
                              handleback();
                            }}
                          >
                            Back
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <form
                    className="navbar-searchh position-relative"
                    style={{ width: "400px", height: "50px" }}
                  >
                    <input
                      type="text"
                      name="search"
                      className="bg-white border-grip rounded-2 text-sm px-3 pe-5 h-100 w-100"
                      placeholder="Member search..."
                      onChange={(e) => {
                        globalSearch(e.target.value);
                      }}
                      style={{
                        lineHeight: "1.1",
                      }}
                    />
                    <Icon
                      icon="ion:search-outline"
                      className="position-absolute text-grip"
                      style={{
                        right: "12px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        fontSize: "20px",
                      }}
                    />
                  </form>
                  <div className="d-flex flex-wrap gap-4 justify-content-center p-20">
                    {globalMembers.map((member, idx) => {
                      // Extract the first letter of first and last name for avatar fallback
                      const initials = `${member.personalDetails?.firstName?.charAt(0) || ""
                        }${member.personalDetails?.lastName?.charAt(0) || ""}`;
                      const imageUrl = `${IMAGE_BASE_URL}/${member.personalDetails?.profileImage?.docPath}/${member.personalDetails?.profileImage?.docName}`;

                      return (
                        <div
                          key={member._id || idx} // Better to use database ID if available
                          onClick={() => handleViewClick(member)}
                          className="d-flex flex-column align-items-center p-3 cursor-pointer"
                          style={{
                            width: "150px",
                            borderRadius: "16px",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                            backgroundColor: "#fff",
                            transition: "transform 0.2s",
                            ":hover": {
                              transform: "translateY(-5px)",
                            },
                          }}
                        >
                          {/* Avatar with fallback to initials */}
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt="avatar"
                              className="rounded"
                              style={{
                                width: "80px",
                                height: "70px",
                                borderRadius: "12px",
                                objectFit: "cover",
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: "80px",
                                height: "70px",
                                borderRadius: "12px",
                                backgroundColor: "#E53935",
                                color: "white",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "24px",
                                fontWeight: "bold",
                              }}
                            >
                              {initials}
                            </div>
                          )}

                          <div
                            className="fw-bold mt-2"
                            style={{ color: "#E53935", fontSize: "12px" }}
                          >
                            {member.personalDetails?.firstName}{" "}
                            {member.personalDetails?.lastName}
                          </div>

                          <div
                            className="text-center mb-2"
                            style={{ fontSize: "10px" }}
                          >
                            {member.personalDetails?.companyName}
                          </div>

                          {/* Category with dynamic color based on role */}
                          <div
                            className="fw-bold text-white mt-auto text-center"
                            style={{
                              backgroundColor: "red",
                              borderRadius: "4px",
                              padding: "2px",
                              fontSize: "10px",
                              width: "100%",
                            }}
                          >
                            {member.personalDetails?.categoryRepresented?.toUpperCase() ||
                              "MEMBER"}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* View Member Modal */}
      {showViewModal && selectedMember && (
        <div
          className="modal fade show"
          style={{ display: "block" }}
          tabIndex={-1}
          aria-modal="true"
          role="dialog"
          id="memberSearchModal"
        >
          <div className="modal-dialog modal-md modal-dialog-centered">
            <div className="modal-content radius-16 bg-base">
              <div className="modal-header py-16 px-24 border border-top-0 border-start-0 border-end-0">
                <h1 className="modal-title fs-5" id="memberSearchModal">
                  Member Details
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowViewModal(false)}
                  aria-label="Close"
                />
              </div>

              <div className="modal-body">
                <div className="container">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="col-12">
                      <div className="text-center">
                        <img
                          src="assets/images/avatar/avatar.jpg"
                          alt="avatar"
                          className="rounded-circle mb-3"
                          style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "cover",
                            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                            border: "5px solid #51a5c4",
                          }}
                        />
                      </div>
                      <div className="text-center">
                        <p className="m-0">
                          <strong>{selectedMember.name}</strong>
                        </p>
                        <span style={{ color: "#cc4747" }}>
                          <strong>{selectedMember.business}</strong>
                        </span>
                        <br></br>
                        <span>{selectedMember.category}</span>
                      </div>
                      <div>
                        <span style={{ fontSize: "13px" }}>
                          {selectedMember.about ||
                            `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.`}
                        </span>
                      </div>
                      <div>
                        <span style={{ fontSize: "13px" }}>
                          <b>Mobile:</b> {selectedMember.mobile}
                        </span>
                        <p className="mb-2" style={{ fontSize: "13px" }}>
                          <strong>Email:</strong>{" "}
                          {selectedMember.email || "admin@gmail.com"}
                        </p>
                        <p className="mb-2" style={{ fontSize: "13px" }}>
                          <strong>Chapter:</strong> {selectedMember.chapter}
                        </p>
                        <p className="mb-0" style={{ fontSize: "13px" }}>
                          <strong>Zone:</strong> {selectedMember.zone}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowViewModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div
        className="modal fade"
        id="exampleModalOne"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
      >
        <div className="modal-dialog modal-xl modal-dialog-centered">
          <div className="modal-content radius-16 bg-base">
            <div className="modal-header py-16 px-24 border border-top-0 border-start-0 border-end-0">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Thank you for closed business
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>

            <div className="modal-body">
              <div className="row mb-3">
                <div className="col-sm-6 fw-medium">
                  Chapter: {userData?.chapterInfo?.chapterId?.chapterName}{" "}
                </div>
                <div className="col-sm-6 text-end fw-medium">
                  <span className="text-danger">*</span> Required fields
                </div>
              </div>

              <form
                onSubmit={handleBusinessSubmit}
                className="mx-auto pb-3"
                style={{ maxWidth: "1000px" }}
              >
                {/* Met With Section */}
                <div className="row mb-24 gy-3 align-items-center">
                  <label className="form-label mb-0 col-sm-3">
                    Met With<span className="text-danger">*</span>
                  </label>
                  <div className="col-sm-4">
                    <select
                      className="form-select"
                      disabled={useCrossChapter}
                      value={selectedMember}
                      name="selectedMember"
                      onChange={(e) => setSelectedMember(e.target.value)}
                      required
                    >
                      <option value="">Select a member</option>
                      {members &&
                        members.map((member) => (
                          <option key={member.id} value={member.id}>
                            {member.name}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="col-sm-1 text-center">OR</div>
                  <div className="col-sm-4">
                    <button
                      type="button"
                      className="btn btn-primary grip w-100"
                      onClick={handleCrossChapterClick}
                    >
                      Search Cross Chapter
                    </button>
                  </div>
                </div>

                {useCrossChapter && (
                  <>
                    <div className="row mb-24 gy-3 align-items-center">
                      <label className="form-label mb-0 col-sm-3">
                        Select Chapter<span className="text-danger">*</span>
                      </label>
                      <div className="col-sm-9">
                        <select
                          className="form-select"
                          value={selectedChapter}
                          onChange={handleChapterChange}
                          required
                        >
                          <option value="">Select a chapter</option>
                          {chapterList.map((chapter) => (
                            <option key={chapter._id} value={chapter._id}>
                              {chapter.chapterName}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {selectedChapter && (
                      <div className="row mb-24 gy-3 align-items-center">
                        <label className="form-label mb-0 col-sm-3">
                          Select Member<span className="text-danger">*</span>
                        </label>
                        <div className="col-sm-9">
                          <select
                            className="form-select"
                            value={selectedMember}
                            onChange={(e) => setSelectedMember(e.target.value)}
                            required
                          >
                            <option value="">Select a member</option>
                            {members &&
                              members.map((member) => (
                                <option key={member.name} value={member.id}>
                                  {member.name}
                                </option>
                              ))}
                          </select>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Amount Field */}
                <div className="row mb-24 gy-3 align-items-center">
                  <label className="form-label mb-0 col-sm-3">
                    For a referral in the amount of{" "}
                    <span className="text-danger">*</span>
                  </label>
                  <div className="col-sm-9">
                    <input
                      type="text"
                      className="form-control"
                      value={amount}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Allow numbers, commas, and backspace
                        if (/^[0-9,]*$/.test(value) || value === "") {
                          setAmount(value);
                        }
                      }}
                      pattern="[0-9,]+"
                      title="Please enter only numbers and commas"
                      required
                    />
                    {amount && !/^[0-9,]+$/.test(amount) && (
                      <div className="text-danger small mt-1">
                        Only numbers and commas are allowed
                      </div>
                    )}
                    <span className="pr-5">Always use local currency</span>
                  </div>
                </div>

                {/* Comments Field */}
                <div className="row mb-24 gy-3 align-items-center">
                  <label className="form-label mb-0 col-sm-3">
                    Comments<span className="text-danger">*</span>
                  </label>
                  <div className="col-sm-9">
                    <textarea
                      className="form-control"
                      rows="3"
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      required
                    ></textarea>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="d-flex align-items-center justify-content-center gap-3 mt-24">
                  <button
                    type="submit"
                    className="btn btn-primary grip px-40 py-11 radius-8"
                    disabled={
                      !amount ||
                      !/^[0-9,]+$/.test(amount) ||
                      !comments ||
                      !selectedMember
                    }
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-grip px-40 py-11 radius-8"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* referal */}
      <div
        className="modal fade"
        id="exampleModalReferal"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >

        {/* referal submition with email trigger */}
        <div className="modal-dialog modal-xl modal-dialog-centered">
          <div className="modal-content radius-16 bg-base">
            <div className="modal-header py-16 px-24 border border-top-0 border-start-0 border-end-0">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Referral Submission
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>

            <div className="modal-body">
              <div className="row mb-3">
                <div className="col-sm-6 fw-medium"></div>
                <div className="col-sm-6 text-end fw-medium">
                  <span className="text-danger">*</span> Required fields
                </div>
              </div>

              <form
                onSubmit={handleReferalSubmit}
                className="mx-auto pb-3"
                style={{ maxWidth: "700px" }}
              >
                {/* Met With section */}
                {/* ✅ Met With (normal member selection) */}
                <div className="row mb-24 gy-3 align-items-center">
                  <label className="form-label mb-0 col-sm-3">
                    Met With<span className="text-danger">*</span>
                  </label>
                  <div className="col-sm-4">
                    <select
                      className="form-select"
                      disabled={useCrossChapter}
                      value={selectedMember}
                      name="selectedMember"
                      onChange={(e) => setSelectedMember(e.target.value)}
                    >
                      <option value="">Select a member</option>
                      {members &&
                        members.map((member) => (
                          <option key={member.id} value={member.id}>
                            {member.name}
                          </option>
                        ))}
                    </select>
                    {/* ✅ Show error only if not using cross chapter */}
                    {!useCrossChapter && referalError.selectedMember && (
                      <div className="text-danger small">
                        {referalError.selectedMember}
                      </div>
                    )}
                  </div>

                  <div className="col-sm-1 text-center">OR</div>
                  <div className="col-sm-4">
                    <button
                      type="button"
                      className="btn btn-primary grip w-100"
                      onClick={handleCrossChapterClick}
                    >
                      Search Cross Chapter
                    </button>
                  </div>
                </div>

                {/* ✅ Cross Chapter flow */}
                {useCrossChapter && (
                  <>
                    {/* Select Chapter */}
                    <div className="row mb-24 gy-3 align-items-center">
                      <label className="form-label mb-0 col-sm-3">
                        Select Chapter<span className="text-danger">*</span>
                      </label>
                      <div className="col-sm-9">
                        <select
                          className="form-select"
                          value={selectedChapter}
                          onChange={handleChapterChange}
                        >
                          <option value="">Select a chapter</option>
                          {chapterList.map((chapter) => (
                            <option key={chapter._id} value={chapter._id}>
                              {chapter.chapterName}
                            </option>
                          ))}
                        </select>
                        {/* ✅ Chapter validation */}
                        {referalError.selectedChapter && (
                          <div className="text-danger small">
                            {referalError.selectedChapter}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Select Member (from that chapter) */}
                    {selectedChapter && (
                      <div className="row mb-24 gy-3 align-items-center">
                        <label className="form-label mb-0 col-sm-3">
                          Select Member<span className="text-danger">*</span>
                        </label>
                        <div className="col-sm-9">
                          <select
                            className="form-select"
                            value={selectedMember}
                            onChange={(e) => setSelectedMember(e.target.value)}
                          >
                            <option value="">Select a member</option>
                            {members &&
                              members.map((member) => (
                                <option key={member.id} value={member.id}>
                                  {member.name}
                                </option>
                              ))}
                          </select>
                          {/* ✅ Member validation in cross chapter */}
                          {referalError.selectedMember && (
                            <div className="text-danger small">
                              {referalError.selectedMember}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Referral Status Checkboxes */}
                <div className="row mb-24 gy-3 align-items-center">
                  <label className="form-label mb-0 col-sm-3">
                    Referral Status<span className="text-danger">*</span>
                  </label>
                  <div className="col-sm-9">
                    <div className="d-flex align-items-center flex-wrap gap-28">
                      <div className="form-check checked-danger d-flex align-items-center gap-2">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="referralStatus"
                          value="given your card"
                          checked={
                            formData.referralStatus === "given your card"
                          }
                          onChange={handleReferalInputChange}
                        />
                        <label className="form-check-label">
                          Given your Card
                        </label>
                      </div>
                      <div className="form-check checked-danger d-flex align-items-center gap-2">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="referralStatus"
                          value="told them you would call"
                          checked={
                            formData.referralStatus ===
                            "told them you would call"
                          }
                          onChange={handleReferalInputChange}
                        />
                        <label className="form-check-label">
                          Told them you would call
                        </label>
                      </div>
                    </div>
                    {referalError.referralStatus && (
                      <div className="text-danger small">
                        {referalError.referralStatus}
                      </div>
                    )}
                  </div>
                </div>

                {/* Name */}
                <div className="row mb-24 gy-3 align-items-center">
                  <label className="form-label mb-0 col-sm-3">
                    Name<span className="text-danger">*</span>
                  </label>
                  <div className="col-sm-9">
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^[a-zA-Z\s]*$/.test(value)) {
                          handleReferalInputChange(e);
                          setErrors({});
                        }
                      }}
                      pattern="[a-zA-Z\s]+"
                      title="Please enter only alphabets"
                      required
                    />
                    {formData.name && !/^[a-zA-Z\s]+$/.test(formData.name) && (
                      <div className="text-danger small mt-1">
                        Only alphabets are allowed
                      </div>
                    )}
                  </div>
                </div>

                {/* Mobile */}
                <div className="row mb-24 gy-3 align-items-center">
                  <label className="form-label mb-0 col-sm-3">
                    Mobile<span className="text-danger">*</span>
                  </label>
                  <div className="col-sm-9">
                    <input
                      type="tel"
                      className="form-control"
                      name="mobile"
                      value={formData.mobile}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*$/.test(value) && value.length <= 10) {
                          handleReferalInputChange(e);
                          setErrors({});
                        }
                      }}
                      pattern="\d{10}"
                      title="Please enter exactly 10 digits"
                      required
                    />
                    {formData.mobile && !/^\d{10}$/.test(formData.mobile) && (
                      <div className="text-danger small mt-1">
                        Please enter exactly 10 digits
                      </div>
                    )}
                  </div>
                </div>

                {/* Category */}
                {/* <div className="row mb-24 gy-3 align-items-center">
                  <label className="form-label mb-0 col-sm-3">Category</label>
                  <div className="col-sm-9">
                    <input
                      type="text"
                      className="form-control"
                      value={category}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^[a-zA-Z\s]*$/.test(value)) {
                          setCategory(value);
                          setErrors({});
                        }
                      }}
                      pattern="[a-zA-Z\s]+"
                      title="Please enter only alphabets"
                      required
                    />
                    {category && !/^[a-zA-Z\s]+$/.test(category) && (
                      <div className="text-danger small mt-1">
                        Only alphabets are allowed
                      </div>
                    )}
                  </div>
                </div> */}

                {/* Address */}
                <div className="row mb-24 gy-3 align-items-center">
                  <label className="form-label mb-0 col-sm-3">Address</label>
                  <div className="col-sm-9">
                    <textarea
                      className="form-control"
                      rows="3"
                      name="address"
                      value={formData.address}
                      onChange={handleReferalInputChange}
                    ></textarea>
                  </div>
                </div>

                {/* Comments */}
                <div className="row mb-24 gy-3 align-items-center">
                  <label className="form-label mb-0 col-sm-3">Comments</label>
                  <div className="col-sm-9">
                    <textarea
                      className="form-control"
                      rows="3"
                      name="comments"
                      value={formData.comments}
                      onChange={handleReferalInputChange}
                    ></textarea>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="d-flex align-items-center justify-content-center gap-3 mt-24">
                  <button
                    type="submit"
                    className="btn btn-primary grip px-40 py-11 radius-8"
                    disabled={
                      !formData.name ||
                      !/^[a-zA-Z\s]+$/.test(formData.name) ||
                      !formData.mobile ||
                      !/^\d{10}$/.test(formData.mobile)
                      // !category ||                     // category not available in the form field
                      // !/^[a-zA-Z\s]+$/.test(category)  // category not available in the form field 
                    }
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-grip px-40 py-11 radius-8"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* testimonial */}
      <div
        className="modal fade"
        id="exampleModalTwo"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl modal-dialog-centered">
          <div className="modal-content radius-16 bg-base">
            <div className="modal-header py-16 px-24 border border-top-0 border-start-0 border-end-0">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Testimonial Referral Submission
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>

            <div className="modal-body">
              <div className="row mb-3">
                <div className="col-sm-6 fw-medium"></div>
                <div className="col-sm-6 text-end fw-medium">
                  <span className="text-danger">*</span> Required fields
                </div>
              </div>

              <form
                onSubmit={handletestimonialSubmit}
                className="mx-auto pb-3"
                style={{ maxWidth: "700px" }}
              >
                {/* Met With section */}
                <div className="row mb-24 gy-3 align-items-center">
                  <label className="form-label mb-0 col-sm-3">
                    Met With<span className="text-danger">*</span>
                  </label>
                  <div className="col-sm-4">
                    <select
                      className="form-select"
                      disabled={useCrossChapter}
                      value={selectedMember}
                      name="selectedMember"
                      onChange={(e) => setSelectedMember(e.target.value)}
                    >
                      <option value="">Select a member</option>
                      {members &&
                        members.map((member) => (
                          <option key={member.id} value={member.id}>
                            {member.name}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="col-sm-1 text-center">OR</div>
                  <div className="col-sm-4">
                    <button
                      type="button"
                      className="btn btn-primary grip w-100"
                      onClick={handleCrossChapterClick}
                    >
                      Search Cross Chapter
                    </button>
                  </div>
                </div>

                {useCrossChapter && (
                  <>
                    <div className="row mb-24 gy-3 align-items-center">
                      <label className="form-label mb-0 col-sm-3">
                        Select Chapter<span className="text-danger">*</span>
                      </label>
                      <div className="col-sm-9">
                        <select
                          className="form-select"
                          value={selectedChapter}
                          onChange={handleChapterChange}
                          required
                        >
                          <option value="">Select a chapter</option>
                          {chapterList.map((chapter) => (
                            <option key={chapter._id} value={chapter._id}>
                              {chapter.chapterName}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {selectedChapter && (
                      <div className="row mb-24 gy-3 align-items-center">
                        <label className="form-label mb-0 col-sm-3">
                          Select Member<span className="text-danger">*</span>
                        </label>
                        <div className="col-sm-9">
                          <select
                            className="form-select"
                            value={selectedMember}
                            onChange={(e) => setSelectedMember(e.target.value)}
                            required
                          >
                            <option value="">Select a member</option>
                            {members &&
                              members.map((member) => (
                                <option key={member.name} value={member.id}>
                                  {member.name}
                                </option>
                              ))}
                          </select>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Photo Upload */}
                <div className="row mb-24 gy-3 align-items-center">
                  <label className="form-label mb-0 col-sm-3">
                    Upload Photo
                  </label>
                  <div className="col-sm-9">
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={(e) => setPhoto(e.target.files[0])}
                      multiple
                    />
                    <small className="text-muted">
                      Upload a photo related to the referral (optional)
                    </small>
                  </div>
                </div>

                {/* Comments */}
                <div className="row mb-24 gy-3 align-items-center">
                  <label className="form-label mb-0 col-sm-3">Comments</label>
                  <div className="col-sm-9">
                    <textarea
                      className="form-control"
                      rows="3"
                      name="comments"
                      value={formData.comments}
                      onChange={handleReferalInputChange}
                    ></textarea>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="d-flex align-items-center justify-content-center gap-3 mt-24">
                  <button
                    type="submit"
                    className="btn btn-primary grip px-40 py-11 radius-8"
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-grip px-40 py-11 radius-8"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade"
        id="exampleModalThree"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl modal-dialog-centered">
          <div className="modal-content radius-16 bg-base">
            <div className="modal-header py-16 px-24 border border-top-0 border-start-0 border-end-0">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Referral Slip (Be Sure To Announce This At The meeting)
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>

            <div className="modal-body ">
              <div className="row mb-3">
                <div className="col-sm-6  fw-medium">
                  Date: 23/05/2025 | From: Vignesh Prathap
                </div>

                <div className="col-sm-6 text-end  fw-medium">
                  <span className="text-danger">*</span> Required fields
                </div>
              </div>
              <form
                action="#"
                className="mx-auto pb-3"
                style={{ maxWidth: "700px" }}
              >
                <div className="row mb-24 gy-3 align-items-center">
                  <label className="form-label text-end mb-0 col-sm-3">
                    To<span className="text-danger">*</span>
                  </label>
                  <div className="col-sm-9">
                    Please select from dropdown below or search cross chapter
                  </div>
                </div>
                <div className="row mb-24 gy-3 align-items-center">
                  <label className="form-label mb-0 col-sm-3"></label>
                  <div className="col-sm-4">
                    <select className="form-select">
                      <option>Select a member from your chapter</option>
                      <option>Vishwa</option>
                      <option>Suresh</option>
                      <option>Nitheesh</option>
                    </select>
                  </div>
                  <div className="col-sm-1 text-center">OR</div>
                  <div className="col-sm-4">
                    <button
                      type="button"
                      className="btn btn-primary grip w-100"
                    >
                      Search Cross Chapter
                    </button>
                  </div>
                </div>

                <div className="row mb-24 gy-3 align-items-center">
                  <label className="form-label mb-0 text-end col-sm-3">
                    Referral <span className="text-danger">*</span>
                  </label>
                  <div className="col-sm-9">
                    <input type="text" className="form-control" />
                  </div>
                </div>

                <div className="row mb-24 gy-3 align-items-center">
                  <label className="form-label mb-0 text-end col-sm-3">
                    Referral Type<span className="text-danger">*</span>
                  </label>
                  <div className="col-sm-9">
                    <div className="d-flex align-items-center flex-wrap gap-28">
                      <div className="form-check checked-danger d-flex align-items-center gap-2">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="label"
                          id="Personal"
                        />
                        <label
                          className="form-check-label line-height-1 fw-medium text-secondary-light text-sm d-flex align-items-center gap-1"
                          htmlFor="Personal"
                        >
                          Tier 1 (inside)
                        </label>
                      </div>
                      <div className="form-check checked-danger d-flex align-items-center gap-2">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="label"
                          id="Holiday"
                        />
                        <label
                          className="form-check-label line-height-1 fw-medium text-secondary-light text-sm d-flex align-items-center gap-1"
                          htmlFor="Holiday"
                        >
                          Tier 2 (outside)
                        </label>
                      </div>

                      <div className="form-check checked-danger d-flex align-items-center gap-2">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="label"
                          id="Holiday"
                        />
                        <label
                          className="form-check-label line-height-1 fw-medium text-secondary-light text-sm d-flex align-items-center gap-1"
                          htmlFor="Holiday"
                        >
                          Tier 3+
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row mb-24 gy-3 align-items-center">
                  <label className="form-label mb-0 text-end col-sm-3">
                    Business Type<span className="text-danger">*</span>
                  </label>
                  <div className="col-sm-9">
                    <div className="d-flex align-items-center flex-wrap gap-28">
                      <div className="form-check checked-danger d-flex align-items-center gap-2">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="label"
                          id="Personal"
                        />
                        <label
                          className="form-check-label line-height-1 fw-medium text-secondary-light text-sm d-flex align-items-center gap-1"
                          htmlFor="Personal"
                        >
                          Given your Card
                        </label>
                      </div>
                      <div className="form-check checked-danger d-flex align-items-center gap-2">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="label"
                          id="Holiday"
                        />
                        <label
                          className="form-check-label line-height-1 fw-medium text-secondary-light text-sm d-flex align-items-center gap-1"
                          htmlFor="Holiday"
                        >
                          Told them you would all
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row mb-24 gy-3 align-items-center">
                  <label className="form-label text-end mb-0 col-sm-3">
                    Address
                  </label>
                  <div className="col-sm-9">
                    <textarea className="form-control" rows="3"></textarea>
                  </div>
                </div>

                <div className="row mb-24 gy-3 align-items-center">
                  <label className="form-label text-end mb-0 col-sm-3">
                    Telephone<span className="text-danger">*</span>
                  </label>
                  <div className="col-sm-9">
                    <input type="text" className="form-control" />
                  </div>
                </div>

                <div className="row mb-24 gy-3 align-items-center">
                  <label className="form-label mb-0 text-end col-sm-3">
                    Email
                  </label>
                  <div className="col-sm-9">
                    <input type="text" className="form-control" />
                  </div>
                </div>

                <div className="row mb-24 gy-3 align-items-center">
                  <label className="form-label text-end mb-0 col-sm-3">
                    Comments
                  </label>
                  <div className="col-sm-9">
                    <textarea className="form-control" rows="3"></textarea>
                  </div>
                </div>

                <div className="d-flex align-items-center justify-content-center gap-3 mt-24">
                  {/* <button
                                        type="submit"
                                        className="btn btn-primary grip px-40 py-11 radius-8"
                                    >
                                        Submit And New
                                    </button> */}
                  <button
                    type="submit"
                    className="btn btn-primary grip px-40 py-11 radius-8"
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-grip px-40 py-11 radius-8"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* visitor submit model */}
      <div
        className="modal fade"
        id="visitorSubmitModal"
        tabIndex={-1}
        aria-labelledby="visitorSubmitModal"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl modal-dialog-centered">
          <div className="modal-content radius-16 bg-base">
            <div className="modal-header py-16 px-24 border border-top-0 border-start-0 border-end-0">
              <h1 className="modal-title fs-5" id="visitorSubmitModal">
                Visitor follow up
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>

            <div className="modal-body">
              <div className="row mb-3">
                <div className="col-sm-6 fw-medium">
                  Chapter: {userData?.chapterInfo?.chapterId?.chapterName}
                </div>
                {/* <div className="col-sm-6 text-end fw-medium"><span className="text-danger">*</span> Required fields</div> */}
              </div>

              <form
                onSubmit={handleVisitSubmit}
                className="mx-auto pb-3"
                style={{ maxWidth: "700px" }}
              >
                {/* Name Field */}
                <div className="row mb-24 gy-3 align-items-center">
                  <label className="form-label mb-0 col-sm-2">
                    Name<span className="text-danger"></span>
                  </label>
                  <div className="col-sm-10">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter visitor name"
                      value={visitorName}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^[a-zA-Z\s]*$/.test(value)) {
                          setVisitorName(value);
                        }
                      }}
                      pattern="[a-zA-Z\s]+"
                      title="Please enter only alphabets"
                    />
                    {visitorName && !/^[a-zA-Z\s]+$/.test(visitorName) && (
                      <div className="text-danger small mt-1">
                        Only alphabets and spaces are allowed
                      </div>
                    )}
                  </div>
                </div>

                {/* Company Field */}
                <div className="row mb-24 gy-3 align-items-center">
                  <label className="form-label mb-0 col-sm-2">Company</label>
                  <div className="col-sm-10">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter company name"
                      value={company}
                      onChange={(e) => {
                        setCompany(e.target.value);
                        setErrors({});
                      }}
                    />
                    {errors.company && (
                      <div className="text-danger small">{errors.company}</div>
                    )}
                  </div>
                </div>

                {/* Category Field */}
                <div className="row mb-24 gy-3 align-items-center">
                  <label className="form-label mb-0 col-sm-2">Category</label>
                  <div className="col-sm-10">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter category name"
                      value={category}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^[a-zA-Z\s]*$/.test(value)) {
                          setCategory(value);
                          setErrors({});
                        }
                      }}
                      pattern="[a-zA-Z\s]+"
                      title="Please enter only alphabets"
                      required
                    />
                    {category && !/^[a-zA-Z\s]+$/.test(category) && (
                      <div className="text-danger small mt-1">
                        Only alphabets and spaces are allowed
                      </div>
                    )}
                  </div>
                </div>

                {/* Mobile Field */}
                <div className="row mb-24 gy-3 align-items-center">
                  <label className="form-label mb-0 col-sm-2">
                    Mobile<span className="text-danger"></span>
                  </label>
                  <div className="col-sm-10">
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="Enter mobile number"
                      value={mobile}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*$/.test(value) && value.length <= 10) {
                          setMobile(value);
                          setErrors({});
                        }
                      }}
                      pattern="\d{10}"
                      title="Please enter exactly 10 digits"
                    />
                    {mobile && !/^\d{10}$/.test(mobile) && (
                      <div className="text-danger small mt-1">
                        Please enter exactly 10 digits
                      </div>
                    )}
                  </div>
                </div>

                {/* Email Field */}
                <div className="row mb-24 gy-3 align-items-center">
                  <label className="form-label mb-0 col-sm-2">Email</label>
                  <div className="col-sm-10">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Enter email address"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setErrors({});
                      }}
                    />
                    {errors.email && (
                      <div className="text-danger small">{errors.email}</div>
                    )}
                  </div>
                </div>

                {/* Address Field */}
                <div className="row mb-24 gy-3 align-items-center">
                  <label className="form-label mb-0 col-sm-2">Address</label>
                  <div className="col-sm-10">
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="Enter address"
                      value={address}
                      onChange={(e) => {
                        setAddress(e.target.value);
                        setErrors({});
                      }}
                    ></textarea>
                    {errors.address && (
                      <div className="text-danger small">{errors.address}</div>
                    )}
                  </div>
                </div>

                {/* Visit Date Field */}
                <div className="row mb-24 gy-3 align-items-center">
                  <label className="form-label mb-0 col-sm-2">
                    Visit Date<span className="text-danger"></span>
                  </label>
                  <div className="col-sm-10">
                    <input
                      type="date"
                      className="form-control"
                      value={visitDate}
                      onChange={(e) => {
                        setVisitDate(e.target.value);
                        setErrors({});
                      }}
                    />
                    {errors.visitDate && (
                      <div className="text-danger small">
                        {errors.visitDate}
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="d-flex align-items-center justify-content-center gap-3 mt-24">
                  <button
                    type="submit"
                    className="btn btn-primary grip px-40 py-11 radius-8"
                    disabled={
                      !visitorName ||
                      !/^[a-zA-Z\s]+$/.test(visitorName) ||
                      !mobile ||
                      !/^\d{10}$/.test(mobile) ||
                      !category ||
                      !/^[a-zA-Z\s]+$/.test(category) ||
                      !visitDate
                    }
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-grip px-40 py-11 radius-8"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* expected visitor submit modal */}
      <div
        className="modal fade"
        id="expectedVisitorModal"
        tabIndex={-1}
        aria-labelledby="expectedVisitorModal"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl modal-dialog-centered">
          <div className="modal-content radius-16 bg-base">
            <div className="modal-header py-16 px-24 border border-top-0 border-start-0 border-end-0">
              <h1 className="modal-title fs-5" id="expectedVisitorModal">
                Expected Visitor Follow Up
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>

            <div className="modal-body">
              <div className="row mb-3">
                <div className="col-sm-6 fw-medium">
                  Chapter: {userData?.chapterInfo?.chapterId?.chapterName}
                </div>
              </div>

              <form
                onSubmit={handleExpectedVisitSubmit}
                className="mx-auto pb-3"
                style={{ maxWidth: "700px" }}
              >
                {/* Name Field */}
                <div className="row mb-24 gy-3 align-items-center">
                  <label className="form-label mb-0 col-sm-2">
                    Name<span className="text-danger"></span>
                  </label>
                  <div className="col-sm-10">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter expected visitor name"
                      value={visitorName}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^[a-zA-Z\s]*$/.test(value)) {
                          setVisitorName(value);
                        }
                      }}
                      pattern="[a-zA-Z\s]+"
                      title="Please enter only alphabets"
                    />
                    {visitorName && !/^[a-zA-Z\s]+$/.test(visitorName) && (
                      <div className="text-danger small mt-1">
                        Only alphabets and spaces are allowed
                      </div>
                    )}
                  </div>
                </div>

                {/* Company Field */}
                <div className="row mb-24 gy-3 align-items-center">
                  <label className="form-label mb-0 col-sm-2">Company</label>
                  <div className="col-sm-10">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter company name"
                      value={company}
                      onChange={(e) => {
                        setCompany(e.target.value);
                        setErrors({});
                      }}
                    />
                    {errors.company && (
                      <div className="text-danger small">{errors.company}</div>
                    )}
                  </div>
                </div>

                {/* Category Field */}
                <div className="row mb-24 gy-3 align-items-center">
                  <label className="form-label mb-0 col-sm-2">Category</label>
                  <div className="col-sm-10">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter category name"
                      value={category}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^[a-zA-Z\s]*$/.test(value)) {
                          setCategory(value);
                          setErrors({});
                        }
                      }}
                      pattern="[a-zA-Z\s]+"
                      title="Please enter only alphabets"
                      required
                    />
                    {category && !/^[a-zA-Z\s]+$/.test(category) && (
                      <div className="text-danger small mt-1">
                        Only alphabets and spaces are allowed
                      </div>
                    )}
                  </div>
                </div>

                {/* Mobile Field */}
                <div className="row mb-24 gy-3 align-items-center">
                  <label className="form-label mb-0 col-sm-2">Mobile</label>
                  <div className="col-sm-10">
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="Enter mobile number"
                      value={mobile}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*$/.test(value) && value.length <= 10) {
                          setMobile(value);
                          setErrors({});
                        }
                      }}
                      pattern="\d{10}"
                      title="Please enter exactly 10 digits"
                    />
                    {mobile && !/^\d{10}$/.test(mobile) && (
                      <div className="text-danger small mt-1">
                        Please enter exactly 10 digits
                      </div>
                    )}
                  </div>
                </div>

                {/* Email Field */}
                <div className="row mb-24 gy-3 align-items-center">
                  <label className="form-label mb-0 col-sm-2">Email</label>
                  <div className="col-sm-10">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Enter email address"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setErrors({});
                      }}
                    />
                    {errors.email && (
                      <div className="text-danger small">{errors.email}</div>
                    )}
                  </div>
                </div>

                {/* Address Field */}
                <div className="row mb-24 gy-3 align-items-center">
                  <label className="form-label mb-0 col-sm-2">Address</label>
                  <div className="col-sm-10">
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="Enter address"
                      value={address}
                      onChange={(e) => {
                        setAddress(e.target.value);
                        setErrors({});
                      }}
                    ></textarea>
                    {errors.address && (
                      <div className="text-danger small">{errors.address}</div>
                    )}
                  </div>
                </div>

                {/* Visit Date Field */}

                <div className="row mb-24 gy-3 align-items-center">
                  <label className="form-label mb-0 col-sm-2">
                    Visit Date<span className="text-danger"></span>
                  </label>

                  <div className="col-sm-10">

                    <input
                      type="date"
                      className="form-control"
                      value={visitDate}
                      min={allowedDates.length > 0 ? allowedDates[0] : ""}
                      max={allowedDates.length > 1 ? allowedDates[1] : ""}
                      onChange={(e) => {
                        const selected = e.target.value;

                        // Validate against allowed dates
                        if (!allowedDates.includes(selected)) {
                          setErrors({ visitDate: "Please select a valid meeting day." });
                          setVisitDate("");
                          return;
                        }

                        setVisitDate(selected);
                        setErrors({});
                      }}
                    />

                    {errors.visitDate && (
                      <div className="text-danger small">{errors.visitDate}</div>
                    )}
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="d-flex align-items-center justify-content-center gap-3 mt-24">
                  <button
                    type="submit"
                    className="btn btn-primary grip px-40 py-11 radius-8"
                    disabled={
                      !visitorName ||
                      !/^[a-zA-Z\s]+$/.test(visitorName) ||
                      !mobile ||
                      !/^\d{10}$/.test(mobile) ||
                      !category ||
                      !/^[a-zA-Z\s]+$/.test(category) ||
                      !visitDate
                    }
                  >
                    Submit
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline-grip px-40 py-11 radius-8"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* visitor submit model */}
      <div
        className="modal fade"
        id="visitorSubmitModal"
        tabIndex={-1}
        aria-labelledby="visitorSubmitModal"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl modal-dialog-centered">
          <div className="modal-content radius-16 bg-base">
            <div className="modal-header py-16 px-24 border border-top-0 border-start-0 border-end-0">
              <h1 className="modal-title fs-5" id="visitorSubmitModal">
                Visitor follow up
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>

            <div className="modal-body">
              <div className="row mb-3">
                <div className="col-sm-6 fw-medium">
                  Chapter: {userData?.chapterInfo?.chapterId?.chapterName}
                </div>
                {/* <div className="col-sm-6 text-end fw-medium"><span className="text-danger">*</span> Required fields</div> */}
              </div>

              <form
                onSubmit={handleVisitSubmit}
                className="mx-auto pb-3"
                style={{ maxWidth: "700px" }}
              >
                {/* Name Field */}
                <div className="row mb-24 gy-3 align-items-center">
                  <label className="form-label mb-0 col-sm-2">
                    Name<span className="text-danger"></span>
                  </label>
                  <div className="col-sm-10">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter visitor name"
                      value={visitorName}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^[a-zA-Z\s]*$/.test(value)) {
                          setVisitorName(value);
                        }
                      }}
                      pattern="[a-zA-Z\s]+"
                      title="Please enter only alphabets"
                    />
                    {visitorName && !/^[a-zA-Z\s]+$/.test(visitorName) && (
                      <div className="text-danger small mt-1">
                        Only alphabets and spaces are allowed
                      </div>
                    )}
                  </div>
                </div>

                {/* Company Field */}
                <div className="row mb-24 gy-3 align-items-center">
                  <label className="form-label mb-0 col-sm-2">Company</label>
                  <div className="col-sm-10">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter company name"
                      value={company}
                      onChange={(e) => {
                        setCompany(e.target.value);
                        setErrors({});
                      }}
                    />
                    {errors.company && (
                      <div className="text-danger small">{errors.company}</div>
                    )}
                  </div>
                </div>

                {/* Category Field */}
                <div className="row mb-24 gy-3 align-items-center">
                  <label className="form-label mb-0 col-sm-2">Category</label>
                  <div className="col-sm-10">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter category name"
                      value={category}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^[a-zA-Z\s]*$/.test(value)) {
                          setCategory(value);
                          setErrors({});
                        }
                      }}
                      pattern="[a-zA-Z\s]+"
                      title="Please enter only alphabets"
                      required
                    />
                    {category && !/^[a-zA-Z\s]+$/.test(category) && (
                      <div className="text-danger small mt-1">
                        Only alphabets and spaces are allowed
                      </div>
                    )}
                  </div>
                </div>

                {/* Mobile Field */}
                <div className="row mb-24 gy-3 align-items-center">
                  <label className="form-label mb-0 col-sm-2">
                    Mobile<span className="text-danger"></span>
                  </label>
                  <div className="col-sm-10">
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="Enter mobile number"
                      value={mobile}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*$/.test(value) && value.length <= 10) {
                          setMobile(value);
                          setErrors({});
                        }
                      }}
                      pattern="\d{10}"
                      title="Please enter exactly 10 digits"
                    />
                    {mobile && !/^\d{10}$/.test(mobile) && (
                      <div className="text-danger small mt-1">
                        Please enter exactly 10 digits
                      </div>
                    )}
                  </div>
                </div>

                {/* Email Field */}
                <div className="row mb-24 gy-3 align-items-center">
                  <label className="form-label mb-0 col-sm-2">Email</label>
                  <div className="col-sm-10">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Enter email address"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setErrors({});
                      }}
                    />
                    {errors.email && (
                      <div className="text-danger small">{errors.email}</div>
                    )}
                  </div>
                </div>

                {/* Address Field */}
                <div className="row mb-24 gy-3 align-items-center">
                  <label className="form-label mb-0 col-sm-2">Address</label>
                  <div className="col-sm-10">
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="Enter address"
                      value={address}
                      onChange={(e) => {
                        setAddress(e.target.value);
                        setErrors({});
                      }}
                    ></textarea>
                    {errors.address && (
                      <div className="text-danger small">{errors.address}</div>
                    )}
                  </div>
                </div>

                {/* Visit Date Field */}
                <div className="row mb-24 gy-3 align-items-center">
                  <label className="form-label mb-0 col-sm-2">
                    Visit Date<span className="text-danger"></span>
                  </label>
                  <div className="col-sm-10">
                    <input
                      type="date"
                      className="form-control"
                      value={visitDate}
                      onChange={(e) => {
                        setVisitDate(e.target.value);
                        setErrors({});
                      }}
                    />
                    {errors.visitDate && (
                      <div className="text-danger small">
                        {errors.visitDate}
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="d-flex align-items-center justify-content-center gap-3 mt-24">
                  <button
                    type="submit"
                    className="btn btn-primary grip px-40 py-11 radius-8"
                    disabled={
                      !visitorName ||
                      !/^[a-zA-Z\s]+$/.test(visitorName) ||
                      !mobile ||
                      !/^\d{10}$/.test(mobile) ||
                      !category ||
                      !/^[a-zA-Z\s]+$/.test(category) ||
                      !visitDate
                    }
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-grip px-40 py-11 radius-8"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* visitor receive model */}
      <div
        class="modal fade"
        id="visitorReceiveModal"
        tabindex="-1"
        aria-labelledby="visitorReceiveModal"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-xl modal-dialog-centered">
          <div class="modal-content radius-16 bg-base">
            <div class="modal-header py-16 px-24 border border-top-0 border-start-0 border-end-0">
              <h1 class="modal-title fs-5 text-danger" id="visitorReceiveModal">
                Chapter : Visitor Report
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div class="modal-body">
              <div className="d-flex align-items-end gap-3 mb-3">
                <div>
                  <label className="form-label">
                    Start Date <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    name="fromDate"
                    value={dateRange.fromDate}
                    onChange={handleDateRangeChange}
                  />
                </div>
                <div>
                  <label className="form-label">
                    End Date <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    name="toDate"
                    value={dateRange.toDate}
                    onChange={handleDateRangeChange}
                  />
                </div>
                <button
                  className="btn btn-primary grip"
                  onClick={() => handleApplyDateFilter(getVisitorDatas)} // Change the function for each modal
                >
                  Go
                </button>
              </div>

              <div className="reportdetailss overflow-x-auto">
                <div class="bg-danger-100 p-3 rounded d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <div>
                      <strong>Chapter : Visitor Report</strong>
                    </div>
                    <div class="d-flex gap-5 mt-2">
                      <small>
                        Running User<br></br>
                        <strong>
                          {userData?.personalDetails?.firstName +
                            " " +
                            userData?.personalDetails?.lastName}
                        </strong>
                      </small>
                      {/* <small>Run At<br></br><strong>23-May-2025 5:01 PM</strong></small> */}
                      <small>
                        Chapter<br></br>
                        <strong>
                          {" "}
                          {userData?.chapterInfo?.chapterId?.chapterName}
                        </strong>
                      </small>
                    </div>
                  </div>

                  <div class="d-flex gap-2">
                    {/* <button class="btn btn-primary grip text-xs btn-sm">Edit / Delete Slips</button> */}
                    {/* <button class="btn btn-primary grip text-xs btn-sm">Export without Headers</button> */}
                    <button class="btn btn-primary grip text-xs btn-sm">
                      Export
                    </button>
                    <button class="btn btn-primary grip text-xs btn-sm">
                      Print
                    </button>
                  </div>
                </div>

                <div class="table-responsive">
                  <table className="table table-bordered table-striped">
                    <thead className="table-danger grip">
                      <tr className="text-xs">
                        <th>Visit Date</th>
                        <th>Name</th>
                        <th>Company</th>
                        <th>Category</th>
                        <th>Mobile</th>
                        <th>Email</th>
                        <th>Address</th>
                        <th>Invited By</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visitorsDatas &&
                        visitorsDatas?.map((item) => {
                          // Format date to DD/MM/YY format
                          const formattedDate = new Date(item.visitDate)
                            .toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "2-digit",
                            })
                            .replace(/\//g, "/");

                          // Get inviter's full name
                          const invitedByName = `${item.invitedBy.personalDetails.firstName} ${item.invitedBy.personalDetails.lastName}`;

                          return (
                            <tr key={item._id} className="text-xs">
                              <td>{formattedDate}</td>
                              <td>{item.name}</td>
                              <td>{item.company}</td>
                              <td>{item.category}</td>
                              <td>{item.mobile}</td>
                              <td>{item.email}</td>
                              <td>{item.address}</td>
                              <td>{invitedByName}</td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div class="modal-footer border-top-0">
              <button
                type="button"
                class="btn text-grip btn-outline-grip"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* expected receive modal */}
      <div
        className="modal fade"
        id="expectedVisitorReceiveModal"
        tabIndex={-1}
        aria-labelledby="expectedVisitorReceiveModal"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl modal-dialog-centered">
          <div className="modal-content radius-16 bg-base">
            <div className="modal-header py-16 px-24 border border-top-0 border-start-0 border-end-0">
              <h1 className="modal-title fs-5 text-danger">
                Chapter : Expected Visitor Report
              </h1>
              <button className="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div className="modal-body">
              {/* Date Filter */}
              <div className="d-flex align-items-end gap-3 mb-3">
                <div>
                  <label className="form-label">Start Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="fromDate"
                    value={dateRange.fromDate}
                    onChange={handleDateRangeChange}
                  />
                </div>

                <div>
                  <label className="form-label">End Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="toDate"
                    value={dateRange.toDate}
                    onChange={handleDateRangeChange}
                  />
                </div>

                <button
                  className="btn btn-primary grip"
                // onClick={() => handleApplyDateFilter(getExpectedVisitorDatas)}
                >
                  Go
                </button>
              </div>

              {/* Report Header */}
              <div className="bg-danger-100 p-3 rounded d-flex justify-content-between align-items-center mb-3">
                <div>
                  <strong>Chapter : Expected Visitor Report</strong>
                  <div className="d-flex gap-5 mt-2">
                    <small>
                      Running User
                      <br />
                      <strong>
                        {userData?.personalDetails?.firstName +
                          " " +
                          userData?.personalDetails?.lastName}
                      </strong>
                    </small>

                    <small>
                      Chapter
                      <br />
                      <strong>
                        {userData?.chapterInfo?.chapterId?.chapterName}
                      </strong>
                    </small>
                  </div>
                </div>

                <div className="d-flex gap-2">
                  <button className="btn btn-primary grip text-xs btn-sm">
                    Export
                  </button>
                  <button className="btn btn-primary grip text-xs btn-sm">
                    Print
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="table-responsive">
                <table className="table table-bordered table-striped">
                  <thead className="table-danger grip">
                    <tr className="text-xs">
                      <th>Visit Date</th>
                      <th>Name</th>
                      <th>Company</th>
                      <th>Category</th>
                      <th>Mobile</th>
                      <th>Email</th>
                      <th>Address</th>
                      <th>Invited By</th>
                    </tr>
                  </thead>

                  <tbody>
                    {expectedVisitorsDatas &&
                      expectedVisitorsDatas.length > 0 ? (
                      expectedVisitorsDatas.map((item) => {
                        // Format date
                        const formattedDate = new Date(
                          item.visitDate
                        ).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "2-digit",
                        });

                        // Handle invitedBy safely
                        const invitedByName = item.invitedBy
                          ? `${item.invitedBy?.personalDetails?.firstName || ""
                          } ${item.invitedBy?.personalDetails?.lastName || ""
                          }`
                          : "—";

                        return (
                          <tr key={item._id}>
                            <td>{formattedDate}</td>
                            <td>{item.name}</td>
                            <td>{item.company}</td>
                            <td>{item.category}</td>
                            <td>{item.mobile}</td>
                            <td>{item.email}</td>
                            <td>{item.address}</td>
                            <td>{invitedByName}</td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="8" className="text-center">
                          No expected visitors found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="modal-footer border-top-0">
              <button
                className="btn text-grip btn-outline-grip"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* onetoone report model */}
      <div
        class="modal fade"
        id="oneToOneReportModal"
        tabindex="-1"
        aria-labelledby="oneToOneReportModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-xl modal-dialog-centered">
          <div class="modal-content radius-16 bg-base">
            <div class="modal-header py-16 px-24 border border-top-0 border-start-0 border-end-0">
              <h1
                class="modal-title fs-5 text-danger"
                id="oneToOneReportModalLabel"
              >
                Chapter : One to One Report
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div class="modal-body">
              <div className="d-flex align-items-end gap-3 mb-3">
                <div>
                  <label className="form-label">
                    Start Date <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    name="fromDate"
                    value={dateRange.fromDate}
                    onChange={handleDateRangeChange}
                  />
                </div>
                <div>
                  <label className="form-label">
                    End Date <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    name="toDate"
                    value={dateRange.toDate}
                    onChange={handleDateRangeChange}
                  />
                </div>
                <button
                  className="btn btn-primary grip"
                  onClick={() => handleApplyDateFilter(getOneTooneDatas)} // Change the function for each modal
                >
                  Go
                </button>
              </div>

              <div className="reportdetailss overflow-x-auto">
                <div class="bg-danger-100 p-3 rounded d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <div>
                      <strong>Chapter : One to One Report</strong>
                    </div>
                    <div class="d-flex gap-5 mt-2">
                      <small>
                        Running User<br></br>
                        <strong>
                          {userData?.personalDetails?.firstName +
                            " " +
                            userData?.personalDetails?.lastName}
                        </strong>
                      </small>
                      {/* <small>Run At<br></br><strong>23-May-2025 5:01 PM</strong></small> */}
                      <small>
                        Chapter<br></br>
                        <strong>
                          {" "}
                          {userData?.chapterInfo?.chapterId?.chapterName}
                        </strong>
                      </small>
                    </div>
                  </div>

                  <div class="d-flex gap-2">
                    {/* <button class="btn btn-primary grip text-xs btn-sm">Edit / Delete Slips</button> */}
                    {/* <button class="btn btn-primary grip text-xs btn-sm">Export without Headers</button> */}
                    <button class="btn btn-primary grip text-xs btn-sm">
                      Export
                    </button>
                    <button class="btn btn-primary grip text-xs btn-sm">
                      Print
                    </button>
                  </div>
                </div>

                <div class="table-responsive">
                  <table className="table table-bordered table-striped">
                    <thead className="table-danger grip">
                      <tr className="text-xs">
                        <th>Date</th>
                        <th>To Member</th>
                        <th>From Member</th>
                        <th>Meeting Location</th>
                        <th>Photo</th>
                        <th>Address</th>
                        <th>Created At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {onToOneDatas &&
                        onToOneDatas?.map((item) => {
                          // Format dates to DD/MM/YY format
                          const formatDate = (dateString) => {
                            return new Date(dateString)
                              .toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "2-digit",
                              })
                              .replace(/\//g, "/");
                          };

                          // Get member full names
                          // const toMemberName = `${item.toMember.personalDetails.firstName} ${item.toMember.personalDetails.lastName}`;
                          // const fromMemberName = `${item.fromMember.personalDetails.firstName} ${item.fromMember.personalDetails.lastName}`;
                          const toMemberName = item.toMember?.personalDetails
                            ? `${item.toMember.personalDetails.firstName || ""
                            } ${item.toMember.personalDetails.lastName || ""}`
                            : "N/A";

                          const fromMemberName = item.fromMember
                            ?.personalDetails
                            ? `${item.fromMember.personalDetails.firstName || ""
                            } ${item.fromMember.personalDetails.lastName || ""
                            }`
                            : "N/A";

                          // Format meeting location
                          const meetingLocation =
                            item.whereDidYouMeet === "commonlocation"
                              ? "Common Location"
                              : item.whereDidYouMeet.charAt(0).toUpperCase() +
                              item.whereDidYouMeet.slice(1);

                          return (
                            <tr key={item._id} className="text-xs">
                              <td>{formatDate(item.date)}</td>
                              <td>{toMemberName}</td>
                              <td>{fromMemberName}</td>
                              <td>{meetingLocation}</td>
                              <td>
                                {/* <img
                                  style={{ width: "50px" }}
                                  src={`${IMAGE_BASE_URL}/${item.images[0]?.docPath}/${item.images[0]?.docName}`}
                                /> */}
                                <img
                                  style={{ width: "50px" }}
                                  src={
                                    item.images?.[0]?.docPath &&
                                      item.images?.[0]?.docName
                                      ? `${IMAGE_BASE_URL}/${item.images[0].docPath}/${item.images[0].docName}`
                                      : ""
                                  }
                                  alt="One-to-One"
                                />
                              </td>

                              <td>{item.address}</td>
                              <td>{formatDate(item.createdAt)}</td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div class="modal-footer border-top-0">
              <button
                type="button"
                class="btn text-grip btn-outline-grip"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Testimonial referal */}
      <div
        class="modal fade"
        id="testimonialgivenReportModal"
        tabindex="-1"
        aria-labelledby="testimonialgivenReportModal"
        aria-hidden="true"
      >
        <div
          class="modal-dialog modal-xl modal-dialog-centered"
          style={{ maxWidth: "1450px" }}
        >
          <div class="modal-content radius-16 bg-base">
            <div class="modal-header py-16 px-24 border border-top-0 border-start-0 border-end-0">
              <h1
                class="modal-title fs-5 text-danger"
                id="testimonialgivenReportModal"
              >
                Chapter : Testimonial Given Report
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div class="modal-body">
              <div className="d-flex align-items-end gap-3 mb-3">
                <div>
                  <label className="form-label">
                    Start Date <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    name="fromDate"
                    value={dateRange.fromDate}
                    onChange={handleDateRangeChange}
                  />
                </div>
                <div>
                  <label className="form-label">
                    End Date <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    name="toDate"
                    value={dateRange.toDate}
                    onChange={handleDateRangeChange}
                  />
                </div>
                <button
                  className="btn btn-primary grip"
                  onClick={() =>
                    handleApplyDateFilter(getTestimonialGivenDatas)
                  } // Change the function for each modal
                >
                  Go
                </button>
              </div>

              <div className="reportdetailss overflow-x-auto">
                <div class="bg-danger-100 p-3 rounded d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <div>
                      <strong>Chapter : Testimonial Given Report</strong>
                    </div>
                    <div class="d-flex gap-5 mt-2">
                      <small>
                        Running User<br></br>
                        <strong>
                          {userData?.personalDetails?.firstName +
                            " " +
                            userData?.personalDetails?.lastName}
                        </strong>
                      </small>
                      {/* <small>Run At<br></br><strong>23-May-2025 5:01 PM</strong></small> */}
                      <small>
                        Chapter<br></br>
                        <strong>
                          {" "}
                          {userData?.chapterInfo?.chapterId?.chapterName}
                        </strong>
                      </small>
                    </div>
                  </div>

                  <div class="d-flex gap-2">
                    {/* <button class="btn btn-primary grip text-xs btn-sm">Edit / Delete Slips</button> */}
                    {/* <button class="btn btn-primary grip text-xs btn-sm">Export without Headers</button> */}
                    <button class="btn btn-primary grip text-xs btn-sm">
                      Export
                    </button>
                    <button class="btn btn-primary grip text-xs btn-sm">
                      Print
                    </button>
                  </div>
                </div>

                <div class="table-responsive">
                  <table className="table table-bordered table-striped">
                    <thead className="table-danger grip">
                      <tr className="text-xs">
                        <th>Date</th>
                        <th>To Member</th>
                        <th>From Member</th>
                        <th>Photo</th>
                        <th>Comments</th>
                        {/* <th>Created At</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {testimonialGivenDatas &&
                        testimonialGivenDatas.map((item) => {
                          // Format dates to DD/MM/YY format
                          const formatDate = (dateString) => {
                            return new Date(dateString)
                              .toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "2-digit",
                              })
                              .replace(/\//g, "/");
                          };

                          // Get member full names
                          const toMemberName = `${item.toMember.personalDetails.firstName} ${item.toMember.personalDetails.lastName}`;
                          const fromMemberName = `${item.fromMember.personalDetails.firstName} ${item.fromMember.personalDetails.lastName}`;

                          return (
                            <tr key={item._id} className="text-xs">
                              <td>{formatDate(item.createdAt)}</td>
                              <td>{toMemberName}</td>
                              <td>{fromMemberName}</td>
                              <td>
                                <img
                                  style={{ width: "50px" }}
                                  src={`${IMAGE_BASE_URL}/${item.images[0]?.docPath}/${item.images[0]?.docName}`}
                                />
                              </td>
                              <td>{item.comments}</td>
                              {/* <td>{formatDate(item.createdAt)}</td> */}
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div class="modal-footer border-top-0">
              <button
                type="button"
                class="btn text-grip btn-outline-grip"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* referralgivenReportModal */}
      <div
        class="modal fade"
        id="referralgivenReportModal"
        tabindex="-1"
        aria-labelledby="referralgivenReportModal"
        aria-hidden="true"
      >
        <div
          class="modal-dialog modal-xl modal-dialog-centered"
          style={{ maxWidth: "1450px" }}
        >
          <div class="modal-content radius-16 bg-base">
            <div class="modal-header py-16 px-24 border border-top-0 border-start-0 border-end-0">
              <h1
                class="modal-title fs-5 text-danger"
                id="referralgivenReportModal"
              >
                Chapter : Referrals Given Report
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div class="modal-body">
              <div className="d-flex align-items-end gap-3 mb-3">
                <div>
                  <label className="form-label">
                    Start Date <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    name="fromDate"
                    value={dateRange.fromDate}
                    onChange={handleDateRangeChange}
                  />
                </div>
                <div>
                  <label className="form-label">
                    End Date <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    name="toDate"
                    value={dateRange.toDate}
                    onChange={handleDateRangeChange}
                  />
                </div>
                <button
                  className="btn btn-primary grip"
                  onClick={() => handleApplyDateFilter(getReferalDatas)} // Change the function for each modal
                >
                  Go
                </button>
              </div>

              <div className="reportdetailss overflow-x-auto">
                <div class="bg-danger-100 p-3 rounded d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <div>
                      <strong>Chapter : Referrals Given Report</strong>
                    </div>
                    <div class="d-flex gap-5 mt-2">
                      <small>
                        Running User<br></br>
                        <strong>
                          {userData?.personalDetails?.firstName +
                            " " +
                            userData?.personalDetails?.lastName}
                        </strong>
                      </small>
                      {/* <small>Run At<br></br><strong>23-May-2025 5:01 PM</strong></small> */}
                      <small>
                        Chapter<br></br>
                        <strong>
                          {" "}
                          {userData?.chapterInfo?.chapterId?.chapterName}
                        </strong>
                      </small>
                    </div>
                  </div>

                  <div class="d-flex gap-2">
                    {/* <button class="btn btn-primary grip text-xs btn-sm">Edit / Delete Slips</button> */}
                    {/* <button class="btn btn-primary grip text-xs btn-sm">Export without Headers</button> */}
                    <button class="btn btn-primary grip text-xs btn-sm">
                      Export
                    </button>
                    <button class="btn btn-primary grip text-xs btn-sm">
                      Print
                    </button>
                  </div>
                </div>

                <div class="table-responsive">
                  <table className="table table-bordered table-striped">
                    <thead className="table-danger grip">
                      <tr className="text-xs">
                        <th>Date</th>
                        <th>To Member</th>
                        <th>From Member</th>
                        <th>Referral Name</th>
                        {/* <th>Category</th> */}
                        <th>Status</th>
                        <th>Phone Number</th>
                        <th>Address</th>
                        <th>Comments</th>
                      </tr>
                    </thead>
                    <tbody>
                      {referalDatas &&
                        referalDatas.map((item) => {
                          // Format date to DD/MM/YY format
                          const formattedDate = new Date(item.createdAt)
                            .toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "2-digit",
                            })
                            .replace(/\//g, "/");

                          // Get member full names
                          const toMemberName = `${item.toMember.personalDetails.firstName} ${item.toMember.personalDetails.lastName}`;
                          const fromMemberName = `${item.fromMember.personalDetails.firstName} ${item.fromMember.personalDetails.lastName}`;

                          return (
                            <tr key={item._id} className="text-xs">
                              <td>{formattedDate}</td>
                              <td>{toMemberName}</td>
                              <td>{fromMemberName}</td>
                              <td>{item.referalDetail.name}</td>
                              {/* <td>{item.referalDetail.category}</td> */}
                              <td>{item.referalStatus}</td>
                              <td>{item.referalDetail.mobileNumber}</td>
                              <td>{item.referalDetail.address}</td>
                              <td>{item.referalDetail.comments}</td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div class="modal-footer border-top-0">
              <button
                type="button"
                class="btn text-grip btn-outline-grip"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* testimonialReceivedReportModal */}
      <div
        class="modal fade"
        id="testimonialReceivedReportModal"
        tabindex="-1"
        aria-labelledby="testimonialReceivedReportModal"
        aria-hidden="true"
      >
        <div
          class="modal-dialog modal-xl modal-dialog-centered"
          style={{ maxWidth: "1450px" }}
        >
          <div class="modal-content radius-16 bg-base">
            <div class="modal-header py-16 px-24 border border-top-0 border-start-0 border-end-0">
              <h1
                class="modal-title fs-5 text-danger"
                id="testimonialReceivedReportModal"
              >
                Chapter : Testimonial Received Report
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div class="modal-body">
              <div className="d-flex align-items-end gap-3 mb-3">
                <div>
                  <label className="form-label">
                    Start Date <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    name="fromDate"
                    value={dateRange.fromDate}
                    onChange={handleDateRangeChange}
                  />
                </div>
                <div>
                  <label className="form-label">
                    End Date <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    name="toDate"
                    value={dateRange.toDate}
                    onChange={handleDateRangeChange}
                  />
                </div>
                <button
                  className="btn btn-primary grip"
                  onClick={() =>
                    handleApplyDateFilter(getTestiomonialReceivedDatas)
                  } // Change the function for each modal
                >
                  Go
                </button>
              </div>

              <div className="reportdetailss overflow-x-auto">
                <div class="bg-danger-100 p-3 rounded d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <div>
                      <strong>Chapter : Testimonial Received Report</strong>
                    </div>
                    <div class="d-flex gap-5 mt-2">
                      <small>
                        Running User<br></br>
                        <strong>
                          {userData?.personalDetails?.firstName +
                            " " +
                            userData?.personalDetails?.lastName}
                        </strong>
                      </small>
                      {/* <small>Run At<br></br><strong>23-May-2025 5:01 PM</strong></small> */}
                      <small>
                        Chapter<br></br>
                        <strong>
                          {" "}
                          {userData?.chapterInfo?.chapterId?.chapterName}
                        </strong>
                      </small>
                    </div>
                  </div>

                  <div class="d-flex gap-2">
                    {/* <button class="btn btn-primary grip text-xs btn-sm">Edit / Delete Slips</button> */}
                    {/* <button class="btn btn-primary grip text-xs btn-sm">Export without Headers</button> */}
                    <button class="btn btn-primary grip text-xs btn-sm">
                      Export
                    </button>
                    <button class="btn btn-primary grip text-xs btn-sm">
                      Print
                    </button>
                  </div>
                </div>

                <div class="table-responsive">
                  <table className="table table-bordered table-striped">
                    <thead className="table-danger grip">
                      <tr className="text-xs">
                        <th>Date</th>
                        <th>To Member</th>
                        <th>From Member</th>
                        <th>Photo</th>
                        <th>Comments</th>
                        {/* <th>Created At</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {testimonialReceivedDatas &&
                        testimonialReceivedDatas.map((item) => {
                          // Format dates to DD/MM/YY format
                          const formatDate = (dateString) => {
                            return new Date(dateString)
                              .toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "2-digit",
                              })
                              .replace(/\//g, "/");
                          };

                          // Get member full names with null checks
                          const toMemberName = item.toMember?.personalDetails
                            ? `${item.toMember?.personalDetails?.firstName} ${item.toMember?.personalDetails?.lastName}`
                            : "N/A";

                          const fromMemberName = item.fromMember
                            ?.personalDetails
                            ? `${item.fromMember?.personalDetails?.firstName} ${item.fromMember?.personalDetails?.lastName}`
                            : "N/A";

                          return (
                            <tr key={item._id} className="text-xs">
                              <td>{formatDate(item.createdAt)}</td>
                              <td>{toMemberName}</td>
                              <td>{fromMemberName}</td>
                              <td>
                                <img
                                  style={{ width: "50px" }}
                                  src={`${IMAGE_BASE_URL}/${item.images[0]?.docPath}/${item.images[0]?.docName}`}
                                  alt="Testimonial"
                                />
                              </td>
                              <td>{item.comments || "-"}</td>
                              {/* <td>{formatDate(item.createdAt)}</td> */}
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div class="modal-footer border-top-0">
              <button
                type="button"
                class="btn text-grip btn-outline-grip"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* referralreceiveReportModal */}
      <div
        class="modal fade"
        id="referralreceiveReportModal"
        tabindex="-1"
        aria-labelledby="referralreceiveReportModal"
        aria-hidden="true"
      >
        <div
          class="modal-dialog modal-xl modal-dialog-centered"
          style={{ maxWidth: "1450px" }}
        >
          <div class="modal-content radius-16 bg-base">
            <div class="modal-header py-16 px-24 border border-top-0 border-start-0 border-end-0">
              <h1
                class="modal-title fs-5 text-danger"
                id="referralreceiveReportModal"
              >
                Chapter : Referrals Receive Report
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div class="modal-body">
              <div className="d-flex align-items-end gap-3 mb-3">
                <div>
                  <label className="form-label">
                    Start Date <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    name="fromDate"
                    value={dateRange.fromDate}
                    onChange={handleDateRangeChange}
                  />
                </div>
                <div>
                  <label className="form-label">
                    End Date <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    name="toDate"
                    value={dateRange.toDate}
                    onChange={handleDateRangeChange}
                  />
                </div>
                <button
                  className="btn btn-primary grip"
                  onClick={() => handleApplyDateFilter(getReferalReceivedDatas)} // Change the function for each modal
                >
                  Go
                </button>
              </div>

              <div className="reportdetailss overflow-x-auto">
                <div class="bg-danger-100 p-3 rounded d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <div>
                      <strong>Chapter : Referrals Receive Report</strong>
                    </div>
                    <div class="d-flex gap-5 mt-2">
                      <small>
                        Running User<br></br>
                        <strong>
                          {userData?.personalDetails?.firstName +
                            " " +
                            userData?.personalDetails?.lastName}
                        </strong>
                      </small>
                      {/* <small>Run At<br></br><strong>23-May-2025 5:01 PM</strong></small> */}
                      <small>
                        Chapter<br></br>
                        <strong>
                          {" "}
                          {userData?.chapterInfo?.chapterId?.chapterName}
                        </strong>
                      </small>
                    </div>
                  </div>

                  <div class="d-flex gap-2">
                    {/* <button class="btn btn-primary grip text-xs btn-sm">Edit / Delete Slips</button> */}
                    {/* <button class="btn btn-primary grip text-xs btn-sm">Export without Headers</button> */}
                    <button class="btn btn-primary grip text-xs btn-sm">
                      Export
                    </button>
                    <button class="btn btn-primary grip text-xs btn-sm">
                      Print
                    </button>
                  </div>
                </div>

                <div class="table-responsive">
                  <table className="table table-bordered table-striped">
                    <thead className="table-danger grip">
                      <tr className="text-xs">
                        <th>Date</th>
                        <th>To Member</th>
                        <th>From Member</th>
                        <th>Referral Name</th>
                        <th>Referral Status</th>
                        {/* <th>Category</th>   */}
                        <th>Status</th>
                        <th>Phone Number</th>
                        <th>Address</th>
                        <th>Comments</th>
                      </tr>
                    </thead>
                    <tbody>
                      {referalReceivedDatas &&
                        referalReceivedDatas.map((item) => {
                          // Format date to DD/MM/YY format
                          const formattedDate = new Date(item.createdAt)
                            .toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "2-digit",
                            })
                            .replace(/\//g, "/");

                          // Get member full names with optional chaining
                          const toMemberName = `${item.toMember?.personalDetails?.firstName || ""
                            } ${item.toMember?.personalDetails?.lastName || ""
                            }`.trim();
                          const fromMemberName = `${item.fromMember?.personalDetails?.firstName || ""
                            } ${item.fromMember?.personalDetails?.lastName || ""
                            }`.trim();

                          // Safely access referral details with fallbacks
                          const referralDetail = item.referalDetail || {};

                          return (
                            <tr key={item._id} className="text-xs">
                              <td>{formattedDate}</td>
                              <td>{toMemberName || "-"}</td>
                              <td>{fromMemberName || "-"}</td>
                              <td>{referralDetail.name || "-"}</td>

                              <td>
                                <select
                                  className="form-select form-select-sm"
                                  value={item.statusLog?.status || item.referalStatus || ""}
                                  onChange={(e) => handleReferralStatusChange(e.target.value, item)}
                                  disabled={
  item.statusLog?.status === "Not Required" ||
  item.statusLog?.status === "Contacted" ||
  item.statusLog?.status === "Business Closed"
}
                                >
                                  <option value="">Select</option>
                                  <option value="Not Required">Not Required</option>
                                  <option value="Contacted">Contacted</option>
                                  <option value="Business Closed">Business Closed</option>
                                </select>
                              </td>


                              {/* <td>{referralDetail.category || "-"}</td> */}
                              <td>{item.referalStatus || "-"}</td>
                              <td>{referralDetail.mobileNumber || "-"}</td>
                              <td>{referralDetail.address || "-"}</td>
                              <td>{referralDetail.comments || "-"}</td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div class="modal-footer border-top-0">
              <button
                type="button"
                class="btn text-grip btn-outline-grip"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* paymentModal */}
      <div
        class="modal fade"
        id="paymentDetails"
        tabindex="-1"
        aria-labelledby="paymentDetails"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-lg modal-dialog-centered">
          <div class="modal-content radius-16 bg-base">
            <div class="modal-header py-16 px-24 border border-top-0 border-start-0 border-end-0">
              <h1 class="modal-title fs-5 text-danger" id="paymentDetails">
                Payment Details
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div class="modal-body">
              <div className="d-flex align-items-end gap-3 mb-3">
                <div>
                  <label className="form-label">
                    Start Date <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    name="fromDate"
                    value={dateRange.fromDate}
                    onChange={handleDateRangeChange}
                  />
                </div>
                <div>
                  <label className="form-label">
                    End Date <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    name="toDate"
                    value={dateRange.toDate}
                    onChange={handleDateRangeChange}
                  />
                </div>
                <button
                  className="btn btn-primary grip"
                  onClick={() => handleApplyDateFilter(getOneTooneDatas)} // Change the function for each modal
                >
                  Go
                </button>
              </div>

              <div className="reportdetailss overflow-x-auto">
                <div class="bg-danger-100 p-3 rounded d-flex justify-content-between align-items-center mb-3">
                  <div></div>

                  <div class="d-flex gap-2">
                    {/* <button class="btn btn-primary grip text-xs btn-sm">Export without Headers</button> */}
                    <button class="btn btn-primary grip text-xs btn-sm">
                      Export
                    </button>
                    <button class="btn btn-primary grip text-xs btn-sm">
                      Print
                    </button>
                  </div>
                </div>

                <div className="table-responsive">
                  <table className="table table-bordered table-striped">
                    <thead className="table-danger grip">
                      <tr className="text-xs">
                        <th>Date</th>
                        <th>Event & Meetings</th>
                        <th>Amount</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {upcomingEvents?.map((event) => {
                        // Format date to DD-MM-YY
                        const formatDate = (dateString) => {
                          if (!dateString) return "N/A";
                          const date = new Date(dateString);
                          return date
                            .toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "2-digit",
                            })
                            .replace(/\//g, "-");
                        };

                        return (
                          <tr key={event._id} className="text-xs">
                            <td>{formatDate(event.date)}</td>
                            <td>
                              <div>
                                <strong>
                                  {event.topic || "Monthly Meeting"}
                                </strong>
                                {event.description && (
                                  <p className="m-0 text-muted">
                                    {event.description}
                                  </p>
                                )}
                              </div>
                            </td>
                            <td>₹{event.amount || "1000"}</td>
                            <td>
                              <button
                                className={`d-inline-block ${event.paid
                                  ? "bg-success-100 text-success-600"
                                  : "bg-danger-100 text-danger-600"
                                  }`}
                                style={{
                                  border: "none",
                                  outline: "none",
                                  color: "white",
                                  padding: "3px 15px",
                                  fontSize: "10px",
                                  borderRadius: "20px",
                                  cursor: event.paid ? "default" : "pointer",
                                }}
                                data-bs-toggle={event.paid ? null : "modal"}
                                data-bs-target={
                                  event.paid ? null : "#paymentModal"
                                }
                                onClick={() => {
                                  const globalSearchModal = Modal.getInstance(
                                    document.getElementById("paymentDetails")
                                  );
                                  if (globalSearchModal) {
                                    globalSearchModal.hide();
                                    setInputvalue(event.amount);
                                  } else {
                                    // Fallback if instance not found
                                    new Modal(
                                      document.getElementById("paymentDetails")
                                    ).hide();
                                  }
                                }}
                                disabled={event.paid}
                              >
                                {event.paid ? "Paid" : "Pay Now"}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div class="modal-footer border-top-0">
              <button
                type="button"
                class="btn text-grip btn-outline-grip"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* UPCOMING EVENTS */}
      <div
        class="modal fade"
        id="upcomingevents"
        tabindex="-1"
        aria-labelledby="upcomingevents"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-lg modal-dialog-centered">
          <div class="modal-content radius-16 bg-base">
            <div class="modal-header py-16 px-24 border border-top-0 border-start-0 border-end-0">
              <h1 class="modal-title fs-5 text-danger" id="upcomningevents">
                Upcoming Events
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div class="modal-body">
              <div className="d-flex align-items-end gap-3 mb-3">
                <div>
                  <label className="form-label">
                    Start Date <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    name="fromDate"
                    value={dateRange.fromDate}
                    onChange={handleDateRangeChange}
                  />
                </div>
                <div>
                  <label className="form-label">
                    End Date <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    name="toDate"
                    value={dateRange.toDate}
                    onChange={handleDateRangeChange}
                  />
                </div>
                <button
                  className="btn btn-primary grip"
                  onClick={() => handleApplyDateFilter(getOneTooneDatas)} // Change the function for each modal
                >
                  Go
                </button>
              </div>
              <div className="">
                <div class="table-responsive">
                  <table className="table table-bordered table-striped">
                    <thead className="table-danger grip">
                      <tr className="text-xs">
                        <th>Event name</th>
                        <th>Event type</th>
                        <th>Date & time</th>
                        <th>Address</th>
                      </tr>
                    </thead>
                    <tbody>
                      {thankYouSlipDatas &&
                        thankYouSlipDatas.map((item) => {
                          // Format dates to DD/MM/YY format
                          const formatDate = (dateString) => {
                            return new Date(dateString)
                              .toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "2-digit",
                              })
                              .replace(/\//g, "/");
                          };

                          // Get member full names
                          const toMemberName = `${item.toMember.personalDetails.firstName} ${item.toMember.personalDetails.lastName}`;
                          const fromMemberName = `${item.fromMember.personalDetails.firstName} ${item.fromMember.personalDetails.lastName}`;

                          return (
                            <tr key={item._id} className="text-xs">
                              <td>{formatDate(item.createdAt)}</td>
                              <td>{toMemberName}</td>
                              <td>{fromMemberName}</td>
                              <td>{item.amount}</td>
                              <td>{item.comments}</td>
                              {/* <td>{formatDate(item.createdAt)}</td> */}
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div class="modal-footer border-top-0">
              <button
                type="button"
                class="btn text-grip btn-outline-grip"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* paymentModal */}
      <div
        class="modal fade"
        id="paymentModal"
        tabindex="-1"
        aria-labelledby="paymentModal"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-md modal-dialog-centered">
          <div class="modal-content radius-16 bg-base">
            <div class="modal-header py-16 px-24 border border-top-0 border-start-0 border-end-0">
              <h1 class="modal-title fs-5 text-danger" id="upcomningevents">
                Payment Modal
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <div className="container">
                <div className="col-12">
                  <div className="my-4">
                    <label className="my-1">Payment Options</label>
                    <select
                      className="form-select form-select-sm w-100 bg-base border-grip text-secondary-light"
                      value={selectedFilter}
                      onChange={handleFilterChange}
                    >
                      <option value="COD">COD</option>
                      <option value="UPI/Net Banking">UPI/Net Banking</option>
                      <option value="Credit/Debit Cards">
                        Credit/Debit Cards
                      </option>
                    </select>
                  </div>
                  <div className="my-4">
                    <label className="my-1">Amount</label>
                    <input className="form-control w-100" value={inputValue} />
                  </div>
                  <div className="my-3 d-flex justify-content-end">
                    <button
                      className="btn text-white bg-gradient-blue-warning text-sm btn-sm d-flex align-items-center justify-content-center gap-2 text-center"
                      style={{
                        width: "100px",
                        height: "40px",
                        borderRadius: "8px",
                        padding: "12px",
                        whiteSpace: "normal",
                        lineHeight: "1.2",
                      }}
                    >
                      Pay Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer border-top-0">
              <button
                type="button"
                class="btn text-grip btn-outline-grip"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* tygivenReportModal */}
      <div
        class="modal fade"
        id="tygivenReportModal"
        tabindex="-1"
        aria-labelledby="tygivenReportModal"
        aria-hidden="true"
      >
        <div
          class="modal-dialog modal-xl modal-dialog-centered"
          style={{ maxWidth: "1450px" }}
        >
          <div class="modal-content radius-16 bg-base">
            <div class="modal-header py-16 px-24 border border-top-0 border-start-0 border-end-0">
              <h1 class="modal-title fs-5 text-danger" id="tygivenReportModal">
                Chapter : Thank you Given Report
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div class="modal-body">
              <div className="d-flex align-items-end gap-3 mb-3">
                <div>
                  <label className="form-label">
                    Start Date <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    name="fromDate"
                    value={dateRange.fromDate}
                    onChange={handleDateRangeChange}
                  />
                </div>
                <div>
                  <label className="form-label">
                    End Date <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    name="toDate"
                    value={dateRange.toDate}
                    onChange={handleDateRangeChange}
                  />
                </div>
                <button
                  className="btn btn-primary grip"
                  onClick={() => handleApplyDateFilter(getOneThankYouDatas)} // Change the function for each modal
                >
                  Go
                </button>
              </div>

              <div className="reportdetailss overflow-x-auto">
                <div class="bg-danger-100 p-3 rounded d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <div>
                      <strong>Chapter : Thank you Given Report</strong>
                    </div>
                    <div class="d-flex gap-5 mt-2">
                      <small>
                        Running User<br></br>
                        <strong>
                          {userData?.personalDetails?.firstName +
                            " " +
                            userData?.personalDetails?.lastName}
                        </strong>
                      </small>
                      {/* <small>Run At<br></br><strong>23-May-2025 5:01 PM</strong></small> */}
                      <small>
                        Chapter<br></br>
                        <strong>
                          {" "}
                          {userData?.chapterInfo?.chapterId?.chapterName}
                        </strong>
                      </small>
                    </div>
                  </div>
                </div>

                <div class="table-responsive">
                  <table className="table table-bordered table-striped">
                    <thead className="table-danger grip">
                      <tr className="text-xs">
                        <th>Date</th>
                        <th>To Member</th>
                        <th>From Member</th>
                        <th>Amount</th>
                        <th>Comments</th>
                        {/* <th>Created At</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {thankYouSlipDatas &&
                        thankYouSlipDatas.map((item) => {
                          // Format dates to DD/MM/YY format
                          const formatDate = (dateString) => {
                            return new Date(dateString)
                              .toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "2-digit",
                              })
                              .replace(/\//g, "/");
                          };

                          // Get member full names
                          const toMemberName = `${item.toMember?.personalDetails?.firstName} ${item.toMember.personalDetails.lastName}`;
                          const fromMemberName = `${item.fromMember?.personalDetails?.firstName} ${item.fromMember.personalDetails.lastName}`;

                          return (
                            <tr key={item._id} className="text-xs">
                              <td>{formatDate(item.createdAt)}</td>
                              <td>{toMemberName}</td>
                              <td>{fromMemberName}</td>
                              <td>{item.amount}</td>
                              <td>{item.comments}</td>
                              {/* <td>{formatDate(item.createdAt)}</td> */}
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div class="modal-footer border-top-0">
              <button
                type="button"
                class="btn text-grip btn-outline-grip"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* tyreceiveReportModal */}
      <div
        class="modal fade"
        id="tyreceiveReportModal"
        tabindex="-1"
        aria-labelledby="tyreceiveReportModal"
        aria-hidden="true"
      >
        <div
          class="modal-dialog modal-xl modal-dialog-centered"
          style={{ maxWidth: "1450px" }}
        >
          <div class="modal-content radius-16 bg-base">
            <div class="modal-header py-16 px-24 border border-top-0 border-start-0 border-end-0">
              <h1
                class="modal-title fs-5 text-danger"
                id="tyreceiveReportModal"
              >
                Chapter : Thank you Receive Report
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div class="modal-body">
              <div className="d-flex align-items-end gap-3 mb-3">
                <div>
                  <label className="form-label">
                    Start Date <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    name="fromDate"
                    value={dateRange.fromDate}
                    onChange={handleDateRangeChange}
                  />
                </div>
                <div>
                  <label className="form-label">
                    End Date <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    name="toDate"
                    value={dateRange.toDate}
                    onChange={handleDateRangeChange}
                  />
                </div>
                <button
                  className="btn btn-primary grip"
                  onClick={() =>
                    handleApplyDateFilter(getThankyouReceivedDatas)
                  } // Change the function for each modal
                >
                  Go
                </button>
              </div>

              <div className="reportdetailss overflow-x-auto">
                <div class="bg-danger-100 p-3 rounded d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <div>
                      <strong>Chapter : One to One Report</strong>
                    </div>
                    <div class="d-flex gap-5 mt-2">
                      <small>
                        Running User<br></br>
                        <strong>
                          {userData?.personalDetails?.firstName +
                            " " +
                            userData?.personalDetails?.lastName}
                        </strong>
                      </small>
                      <small>
                        Chapter<br></br>
                        <strong>
                          {" "}
                          {userData?.chapterInfo?.chapterId?.chapterName}
                        </strong>
                      </small>
                    </div>
                  </div>

                  <div class="d-flex gap-2">
                    {/* <button class="btn btn-primary grip text-xs btn-sm">Edit / Delete Slips</button> */}
                    <button class="btn btn-primary grip text-xs btn-sm">
                      Export
                    </button>
                    <button class="btn btn-primary grip text-xs btn-sm">
                      Print
                    </button>
                  </div>
                </div>

                <div class="table-responsive">
                  <table className="table table-bordered table-striped">
                    <thead className="table-danger grip">
                      <tr className="text-xs">
                        <th>Date</th>
                        <th>To Member</th>
                        <th>From Member</th>
                        <th>Amount</th>
                        <th>Comments</th>
                      </tr>
                    </thead>
                    <tbody>
                      {thankyouReceivedDatas &&
                        thankyouReceivedDatas.map((item) => {
                          // Format date to DD/MM/YY format
                          const formattedDate = new Date(item.createdAt)
                            .toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "2-digit",
                            })
                            .replace(/\//g, "/");

                          // Safely get member names with fallbacks
                          const toMemberName = `${item.toMember?.personalDetails?.firstName || ""
                            } ${item.toMember?.personalDetails?.lastName || ""
                            }`.trim();
                          const fromMemberName = `${item.fromMember?.personalDetails?.firstName || ""
                            } ${item.fromMember?.personalDetails?.lastName || ""
                            }`.trim();

                          return (
                            <tr key={item._id} className="text-xs">
                              <td>{formattedDate}</td>
                              <td>{toMemberName || "-"}</td>
                              <td>{fromMemberName || "-"}</td>
                              <td>
                                {item.amount
                                  ? `₹${item.amount.toLocaleString()}`
                                  : "-"}
                              </td>
                              <td>{item.comments || "-"}</td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div class="modal-footer border-top-0">
              <button
                type="button"
                class="btn text-grip btn-outline-grip"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SalesStatisticOne;
