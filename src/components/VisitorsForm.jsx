import React, { useState, useEffect } from "react";
import ZoneApiProvider from "../services/visitorApi";
import Swal from "sweetalert2";
import '../App.css';



export default function VisitorsForm() {
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        zone: "",
        zoneId: "",
        chapter: "",
        invitedBy: "",        // <-- NEW FIELD ADDED HERE
        chapterId: "",
        invited_from: "",
        invited_by_member: "",
        chapter_directory_name: "",
        name: "",
        category: "",
        company: "",
        mobile: "",
        email: "",
        address: "",
        visitDate: new Date().toISOString(),
    });

    const [zones, setZones] = useState([]);
    const [chapters, setChapters] = useState([]);
    const [members, setMembers] = useState([]);
    const [cids, setCids] = useState([]);
    const [showSuccess, setShowSuccess] = useState(false);
    const [errors, setErrors] = useState({});

    const SuccessPopup = () => (
        <div className="success-overlay">
            <div className="success-box">
                <h2 className="success-title">🎉 Successfully Submitted!</h2>
                <p className="success-text">
                    Well done! Your visitor form has been saved successfully.
                </p>
                <button
                    className="success-btn"
                    onClick={() => setShowSuccess(false)}
                >
                    Close
                </button>
            </div>
        </div>
    );


    // Fetch zones on load
    useEffect(() => {
        async function fetchZones() {
            try {
                const response = await ZoneApiProvider.getPublicZones();
                if (response.status && response.response.success) {
                    setZones(response.response.data);
                }
            } catch (error) {
                console.error("Failed to fetch zones:", error);
            }
        }
        fetchZones();
    }, []);

    // Fetch chapters when zone changes
    useEffect(() => {
        async function fetchChapters() {
            if (!formData.zoneId) {
                setChapters([]);
                setMembers([]);
                return;
            }
            try {
                const response = await ZoneApiProvider.getChaptersByZonePublic(formData.zoneId);
                if (response.status && response.response.success) {
                    setChapters(response.response.data);
                } else {
                    setChapters([]);
                }
            } catch (error) {
                console.error("Failed to fetch chapters:", error);
                setChapters([]);
            }
        }
        fetchChapters();
    }, [formData.zoneId]);

    // Fetch members when chapter changes
    useEffect(() => {
        async function fetchMembers() {
            if (!formData.chapterId) {
                setMembers([]);
                return;
            }
            try {
                const response = await ZoneApiProvider.getMembersByChapterIdPublic(formData.chapterId);
                if (response.status && response.response.success) {
                    setMembers(response.response.data);
                } else {
                    setMembers([]);
                }
            } catch (error) {
                console.error("Failed to fetch members:", error);
                setMembers([]);
            }
        }
        fetchMembers();
    }, [formData.chapterId]);

    // Fetch all CIDs
    useEffect(() => {
        fetchCids();
    }, []);

    async function fetchCids() {
        try {
            const response = await ZoneApiProvider.getUsersByRole({ role: "CID" });
            if (response.status && response.response?.data) {
                const cidOptions = response.response.data.map((user) => ({
                    value: user._id,
                    label: user.name,
                }));
                setCids(cidOptions);
            } else {
                setCids([]);
            }
        } catch (error) {
            console.error("Failed to fetch CIDs:", error);
            setCids([]);
        }
    }

    function getTodayWeekday() {
        const days = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
        ];
        return days[new Date().getDay()];
    }

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "invited_from") {
            const SPECIAL_VALUES = ["FED", "GRIP", "MENTOR", "RD"];
            const value = e.target.value;

            // CASE 1: FED / GRIP / MENTOR / RD
            if (SPECIAL_VALUES.includes(value)) {
                setFormData(prev => ({
                    ...prev,
                    invited_from: value,
                    invitedBy: ""   // ← DO NOT SET invitedBy for special values
                }));
                return;
            }

            // CASE 2: Member selected → match by firstName
            const selected = members.find(
                m => m.personalDetails?.firstName === value
            );

            setFormData(prev => ({
                ...prev,
                invited_from: value,                 // store the NAME shown in dropdown
                invitedBy: selected ? selected._id : ""   // store MEMBER ID only
            }));
            return;
        }

        if (name === "zone") {
            const selectedZone = zones.find((z) => z.zoneName === value);

            setFormData({
                ...formData,
                zone: value,
                zoneId: selectedZone?._id || "",
                chapter: "",
                chapterId: "",
            });

            setChapters([]);
            setMembers([]);
            return;
        }

        if (name === "chapter") {
            const selectedChapter = chapters.find(
                (chap) => chap.chapterName === value
            );

            if (!selectedChapter) {
                setFormData({ ...formData, chapter: "" });
                return;
            }

            const today = getTodayWeekday();

            // ⛔ If weekday mismatch → show error and stop
            if (selectedChapter.weekday !== today) {
                Swal.fire({
                    icon: "error",
                    title: "Invalid Chapter",
                    text: `Today is ${today}, but the selected chapter meets on ${selectedChapter.weekday}.`,
                });

                return; // ❌ DO NOT UPDATE THE SELECTED CHAPTER
            }

            setFormData({
                ...formData,
                chapter: value,
                chapterId: selectedChapter?._id || "",
            });

            setMembers([]);
            return;
        }


        // 🔹 Basic validation for key fields
        if (name === "name" || name === "category") {
            if (!/^[a-zA-Z\s]*$/.test(value)) return; // only alphabets allowed
        }

        if (name === "mobile") {
            if (!/^\d*$/.test(value) || value.length > 10) return; // only numbers, max 10 digits
        }

        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = "Name is required.";
        if (!/^[a-zA-Z\s]+$/.test(formData.name))
            newErrors.name = "Name must contain only alphabets.";

        if (!formData.company.trim()) newErrors.company = "Company is required.";

        if (!formData.category.trim())
            newErrors.category = "Category is required.";
        else if (!/^[a-zA-Z\s]+$/.test(formData.category))
            newErrors.category = "Category must contain only alphabets.";

        if (!formData.mobile.trim()) newErrors.mobile = "Mobile number is required.";
        else if (!/^\d{10}$/.test(formData.mobile))
            newErrors.mobile = "Mobile number must be exactly 10 digits.";

        if (!formData.email.trim()) newErrors.email = "Email is required.";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
            newErrors.email = "Invalid email format.";

        if (!formData.address.trim()) newErrors.address = "Address is required.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const finalData = {
                ...formData,
                visitDate: new Date().toISOString(),   // Set fresh date here
            };
            setLoading(true); // Show loader
            const response = await ZoneApiProvider.submitvisitors(finalData);

            if (response.status && response.response.success) {
                setShowSuccess(true);
                setFormData({
                    name: "",
                    company: "",
                    category: "",
                    mobile: "",
                    email: "",
                    address: "",
                    visitDate: "",
                    zone: "",
                    zoneId: "",
                    chapter: "",
                    chapterId: "",
                    invited_from: "",
                    invited_by_member: "",
                    chapter_directory_name: "",
                });
                setErrors({});
            } else {
                alert("Failed to submit form. Please try again.");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("Something went wrong!");
        }
        finally {
            setLoading(false); // Show loader

        }
    };

    return (
        <div className="visitors-container">
            {showSuccess && <SuccessPopup />}
            {loading && (
                <div className="loader-overlay">
                    <div className="loader"></div>
                    <p className="loader-text">Submitting...</p>
                </div>
            )}

            <div className="visitors-logo">
                <img src="logo.png" alt="GRIP Logo" />
            </div>

            <h2 className="visitors-title">Visitor Form</h2>

            <form id="visitors-form" onSubmit={handleSubmit}>
                <fieldset className="visitors-fieldset">
                    <div className="visitors-form-row">
                        {/* --- Zone --- */}
                        <div className="visitors-form-group">
                            <label>
                                Zone <span className="visitors-required">*</span>
                            </label>
                            <select name="zone" value={formData.zone} onChange={handleChange}>
                                <option value="">-- Select Zone --</option>
                                {zones.map((zone) => (
                                    <option key={zone._id} value={zone.zoneName}>
                                        {zone.zoneName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* --- Chapters --- */}
                        <div className="visitors-form-group">
                            <label>
                                Chapters <span className="visitors-required">*</span>
                            </label>
                            <select
                                name="chapter"
                                value={formData.chapter}
                                onChange={handleChange}
                                disabled={!formData.zoneId}
                            >
                                <option value="">-- Select Chapter --</option>
                                {chapters.map((chapter) => (
                                    <option key={chapter._id} value={chapter.chapterName}>
                                        {chapter.chapterName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* --- Who Invited (Associate) --- */}
                        <div className="visitors-form-group">
                            <label>
                                Who Invited - Associate <span className="visitors-required">*</span>
                            </label>
                            <select
                                name="invited_from"
                                value={formData.invited_from}
                                onChange={handleChange}
                                disabled={!formData.chapterId}
                            >
                                <option value="">-- Select Associate --</option>
                                {members.map((member) => (
                                    <option key={member._id} value={member.personalDetails?.firstName || member._id}>
                                        {member.personalDetails?.firstName || member._id}
                                    </option>
                                ))}
                                <option value="FED">FED</option>
                                <option value="GRIP">GRIP</option>
                                <option value="MENTOR">MENTOR</option>
                                <option value="RD">RD</option>
                            </select>
                        </div>

                        {/* --- Who Invited (FED) --- */}
                        <div className="visitors-form-group">
                            <label>
                                Who Invited - FED <span className="visitors-required">*</span>
                            </label>
                            <select
                                name="invited_by_member"
                                value={formData.invited_by_member}
                                onChange={handleChange}
                                disabled={formData.invited_from !== "FED"}
                                required={formData.invited_from === "FED"}
                            >
                                <option value="">-- Select FED Member --</option>
                                {cids.map((cid) => (
                                    <option key={cid.value} value={cid.label}>
                                        {cid.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Name */}
                        <div className="visitors-form-group">
                            <label>
                                Name <span className="visitors-required">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter visitor name"
                                required
                            />
                            {errors.name && <div className="text-danger small">{errors.name}</div>}
                        </div>

                        {/* Category */}
                        <div className="visitors-form-group">
                            <label>
                                Category <span className="visitors-required">*</span>
                            </label>
                            <input
                                type="text"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                placeholder="Enter category"
                                required
                            />
                            {errors.category && (
                                <div className="text-danger small">{errors.category}</div>
                            )}
                        </div>

                        {/* Company */}
                        <div className="visitors-form-group">
                            <label>
                                Company Name <span className="visitors-required">*</span>
                            </label>
                            <input
                                type="text"
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                placeholder="Enter company name"
                                required
                            />
                            {errors.company && (
                                <div className="text-danger small">{errors.company}</div>
                            )}
                        </div>

                        {/* Mobile */}
                        <div className="visitors-form-group">
                            <label>
                                Mobile <span className="visitors-required">*</span>
                            </label>
                            <input
                                type="tel"
                                name="mobile"
                                value={formData.mobile}
                                onChange={handleChange}
                                placeholder="Enter 10-digit mobile number"
                                required
                            />
                            {errors.mobile && (
                                <div className="text-danger small">{errors.mobile}</div>
                            )}
                        </div>

                        {/* Email */}
                        <div className="visitors-form-group">
                            <label>
                                Email <span className="visitors-required">*</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter email address"
                                required
                            />
                            {errors.email && (
                                <div className="text-danger small">{errors.email}</div>
                            )}
                        </div>

                        {/* Address */}
                        <div className="visitors-form-group">
                            <label>
                                Location <span className="visitors-required">*</span>
                            </label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Enter visitor location"
                                required
                            />
                            {errors.address && (
                                <div className="text-danger small">{errors.address}</div>
                            )}
                        </div>

                        {/* --- CID --- */}
                        <div className="visitors-form-group">
                            <label>
                                Chapter Induction Directors (CID) <span className="visitors-required">*</span>
                            </label>
                            <select
                                name="chapter_directory_name"
                                value={formData.chapter_directory_name}
                                onChange={handleChange}
                                required
                            >
                                <option value="">-- Select Name --</option>
                                {cids.map((cid) => (
                                    <option key={cid.value} value={cid.label}>
                                        {cid.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </fieldset>

                <button type="submit" className="visitors-submit-btn">
                    Submit Form
                </button>


            </form>
        </div>
    );
}
