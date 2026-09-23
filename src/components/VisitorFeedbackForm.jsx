import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ZoneApiProvider from "../services/visitorApi";
import Swal from "sweetalert2";
import '../App.css';

export default function VisitorFeedbackForm() {
    const { zoneName, chapterName } = useParams();
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [errors, setErrors] = useState({});

    // Dynamic dropdown lists
    const [zones, setZones] = useState([]);
    const [allChapters, setAllChapters] = useState([]); // List of { ...chapter, zoneName, zoneId }
    const [filteredChapters, setFilteredChapters] = useState([]);
    const [members, setMembers] = useState([]);

    const todayStr = new Date().toISOString().split('T')[0];

    const [formData, setFormData] = useState({
        zone: "",
        zoneId: "",
        chapter: "",
        chapterId: "",
        name: "",
        mobile: "",
        email: "",
        company: "",
        business: "",
        joining: "Yes (Interested to Join)", // Default: Yes (Interested to Join)
        invited_by_member: "", // Join by
        joiningDate: todayStr, // Joining Date
    });

    // Fetch zones and all chapters on initial load
    useEffect(() => {
        async function fetchZonesAndChapters() {
            try {
                const zoneRes = await ZoneApiProvider.getPublicZones();
                if (zoneRes.status && zoneRes.response?.success) {
                    const fetchedZones = zoneRes.response.data || [];
                    setZones(fetchedZones);

                    // Fetch chapters for all zones
                    const chapterPromises = fetchedZones.map(async (z) => {
                        const cRes = await ZoneApiProvider.getChaptersByZonePublic(z._id);
                        if (cRes.status && cRes.response?.success) {
                            return (cRes.response.data || []).map(ch => ({
                                ...ch,
                                zoneName: z.zoneName,
                                zoneId: z._id
                            }));
                        }
                        return [];
                    });

                    const chapterResults = await Promise.all(chapterPromises);
                    const combinedChapters = chapterResults.flat();
                    setAllChapters(combinedChapters);

                    // Handle URL Params if provided
                    let initialZone = null;
                    let initialChapter = null;

                    if (zoneName) {
                        const formattedUrlZone = zoneName.toLowerCase().replace(/\s+/g, '');
                        initialZone = fetchedZones.find(
                            z => z.zoneName.toLowerCase().replace(/\s+/g, '') === formattedUrlZone
                        );
                    }

                    if (chapterName) {
                        const formattedUrlChapter = chapterName.toLowerCase().replace(/\s+/g, '');
                        initialChapter = combinedChapters.find(
                            c => c.chapterName.toLowerCase().replace(/\s+/g, '') === formattedUrlChapter
                        );
                    }

                    if (initialChapter) {
                        setFormData(prev => ({
                            ...prev,
                            zone: initialChapter.zoneName,
                            zoneId: initialChapter.zoneId,
                            chapter: initialChapter.chapterName,
                            chapterId: initialChapter._id
                        }));
                        setFilteredChapters(combinedChapters.filter(c => c.zoneId === initialChapter.zoneId));
                    } else if (initialZone) {
                        setFormData(prev => ({
                            ...prev,
                            zone: initialZone.zoneName,
                            zoneId: initialZone._id
                        }));
                        setFilteredChapters(combinedChapters.filter(c => c.zoneId === initialZone._id));
                    } else {
                        setFilteredChapters(combinedChapters);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch zones and chapters:", error);
            }
        }
        fetchZonesAndChapters();
    }, [zoneName, chapterName]);

    // Update filtered chapters whenever selected zoneId changes
    useEffect(() => {
        if (formData.zoneId) {
            setFilteredChapters(allChapters.filter(c => c.zoneId === formData.zoneId));
        } else {
            setFilteredChapters(allChapters);
        }
    }, [formData.zoneId, allChapters]);

    // Fetch members whenever chapterId changes
    useEffect(() => {
        async function fetchMembers() {
            if (!formData.chapterId) {
                setMembers([]);
                return;
            }
            try {
                const response = await ZoneApiProvider.getMembersByChapterIdPublic(formData.chapterId);
                if (response.status && response.response?.success) {
                    setMembers(response.response.data || []);
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

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "name" || name === "business") {
            if (value !== "" && !/^[a-zA-Z\s.&'-]*$/.test(value)) return;
        }

        if (name === "mobile") {
            if (!/^\d*$/.test(value) || value.length > 10) return;
        }

        if (name === "zone") {
            const selectedZone = zones.find((z) => z.zoneName === value);
            setFormData(prev => ({
                ...prev,
                zone: value,
                zoneId: selectedZone?._id || "",
                chapter: "",
                chapterId: "",
                invited_by_member: ""
            }));
            return;
        }

        if (name === "chapter") {
            const selectedChapter = allChapters.find((c) => c.chapterName === value);
            if (selectedChapter) {
                setFormData(prev => ({
                    ...prev,
                    chapter: value,
                    chapterId: selectedChapter._id,
                    zone: selectedChapter.zoneName,
                    zoneId: selectedChapter.zoneId,
                    invited_by_member: ""
                }));
            } else {
                setFormData(prev => ({
                    ...prev,
                    chapter: "",
                    chapterId: "",
                    invited_by_member: ""
                }));
            }
            return;
        }

        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.zone.trim()) newErrors.zone = "Zone is required.";
        if (!formData.chapter.trim()) newErrors.chapter = "Chapter is required.";
        if (!formData.name.trim()) newErrors.name = "Name is required.";
        else if (!/^[a-zA-Z\s.&'-]+$/.test(formData.name.trim())) {
            newErrors.name = "Name must contain valid characters only.";
        }

        if (!formData.mobile.trim()) newErrors.mobile = "Phone number is required.";
        else if (!/^\d{10}$/.test(formData.mobile.trim())) {
            newErrors.mobile = "Phone number must be exactly 10 digits.";
        }

        if (!formData.email.trim()) newErrors.email = "Email is required.";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
            newErrors.email = "Invalid email address format.";
        }

        if (!formData.company.trim()) newErrors.company = "Company Name is required.";
        if (!formData.business.trim()) newErrors.business = "Business / Category detail is required.";
        if (!formData.invited_by_member.trim()) newErrors.invited_by_member = "Join by (Invited / Referred By) is required.";

        const isJoining = formData.joining === "Yes (Interested to Join)" || formData.joining?.startsWith("Yes");
        if (isJoining && !formData.joiningDate) {
            newErrors.joiningDate = "Joining Date is required.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            setLoading(true);
            const isJoining = formData.joining === "Yes (Interested to Join)" || formData.joining?.startsWith("Yes");
            const payload = {
                ...formData,
                joiningDate: isJoining ? formData.joiningDate : "",
                visitDate: (isJoining && formData.joiningDate) ? new Date(formData.joiningDate).toISOString() : new Date().toISOString(),
                category: formData.business,
            };

            const response = await ZoneApiProvider.submitVisitorFeedback(payload);

            if (response.status && (response.response?.success || response.response?.status)) {
                setShowSuccess(true);
                setFormData({
                    zone: "",
                    zoneId: "",
                    chapter: "",
                    chapterId: "",
                    name: "",
                    mobile: "",
                    email: "",
                    company: "",
                    business: "",
                    joining: "Yes (Interested to Join)",
                    invited_by_member: "",
                    joiningDate: todayStr,
                });
                setErrors({});
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Submission Error",
                    text: response.response?.message || "Failed to submit feedback form. Please try again.",
                });
            }
        } catch (error) {
            console.error("Error submitting feedback form:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Something went wrong! Please check your connection and try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    const SuccessPopup = () => (
        <div className="success-overlay">
            <div className="success-box">
                <h2 className="success-title">🎉 Form Submitted Successfully!</h2>
                <p className="success-text">
                    Thank you for filling out the Visitor Feedback Form. Your responses have been saved.
                </p>
                <button
                    className="success-btn"
                    onClick={() => setShowSuccess(false)}
                >
                    Done
                </button>
            </div>
        </div>
    );

    return (
        <div className="visitors-container visitor-feedback-container">
            {showSuccess && <SuccessPopup />}
            {loading && (
                <div className="loader-overlay">
                    <div className="loader"></div>
                    <p className="loader-text">Submitting Visitor Feedback...</p>
                </div>
            )}

            <div className="visitors-logo">
                <img src="/logo.png" alt="GRIP Logo" onError={(e) => { e.target.style.display = 'none'; }} />
            </div>

            <h4 className="visitors-title" style={{ fontSize: "1.05rem", fontWeight: "600", marginBottom: "1rem" }}>
                {formData.zone || formData.chapter
                    ? `${formData.zone ? formData.zone : ""}${formData.chapter ? ` (${formData.chapter})` : ""} Visitor Feedback`
                    : "Visitor Feedback"}
            </h4>


            <form id="visitor-feedback-form" onSubmit={handleSubmit}>
                {/* Zone & Chapter Section at the Top */}
                <fieldset className="visitors-fieldset mb-4">
                    <legend className="feedback-legend">Zone & Chapter Selection</legend>
                    <div className="visitors-form-row">
                        {/* Zone (Mandatory *) */}
                        <div className="visitors-form-group">
                            <label htmlFor="zone">
                                Zone <span className="visitors-required">*</span>
                            </label>
                            <select
                                id="zone"
                                name="zone"
                                value={formData.zone}
                                onChange={handleChange}
                                required
                            >
                                <option value="">-- Select Zone --</option>
                                {zones.map((z) => (
                                    <option key={z._id} value={z.zoneName}>
                                        {z.zoneName}
                                    </option>
                                ))}
                            </select>
                            {errors.zone && <div className="text-danger small mt-1">{errors.zone}</div>}
                        </div>

                        {/* Chapter (Mandatory *) */}
                        <div className="visitors-form-group">
                            <label htmlFor="chapter">
                                Chapter <span className="visitors-required">*</span>
                            </label>
                            <select
                                id="chapter"
                                name="chapter"
                                value={formData.chapter}
                                onChange={handleChange}
                                required
                            >
                                <option value="">-- Select Chapter --</option>
                                {filteredChapters.map((chap) => (
                                    <option key={chap._id} value={chap.chapterName}>
                                        {chap.chapterName} {chap.zoneName && !formData.zone ? `(${chap.zoneName})` : ""}
                                    </option>
                                ))}
                            </select>
                            {errors.chapter && <div className="text-danger small mt-1">{errors.chapter}</div>}
                        </div>
                    </div>
                </fieldset>

                {/* Visitor Information Section */}
                <fieldset className="visitors-fieldset">
                    <legend className="feedback-legend">Visitor Information</legend>
                    <div className="visitors-form-row">
                        {/* 1. Name */}
                        <div className="visitors-form-group">
                            <label htmlFor="name">
                                Name <span className="visitors-required">*</span>
                            </label>
                            <input
                                id="name"
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter full name"
                                required
                            />
                            {errors.name && <div className="text-danger small mt-1">{errors.name}</div>}
                        </div>

                        {/* 2. Phone */}
                        <div className="visitors-form-group">
                            <label htmlFor="mobile">
                                Phone <span className="visitors-required">*</span>
                            </label>
                            <input
                                id="mobile"
                                type="tel"
                                name="mobile"
                                value={formData.mobile}
                                onChange={handleChange}
                                placeholder="Enter 10-digit mobile number"
                                required
                            />
                            {errors.mobile && <div className="text-danger small mt-1">{errors.mobile}</div>}
                        </div>

                        {/* 3. Email */}
                        <div className="visitors-form-group">
                            <label htmlFor="email">
                                Email <span className="visitors-required">*</span>
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter email address"
                                required
                            />
                            {errors.email && <div className="text-danger small mt-1">{errors.email}</div>}
                        </div>

                        {/* 4. Company Name */}
                        <div className="visitors-form-group">
                            <label htmlFor="company">
                                Company Name <span className="visitors-required">*</span>
                            </label>
                            <input
                                id="company"
                                type="text"
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                placeholder="Enter company name"
                                required
                            />
                            {errors.company && <div className="text-danger small mt-1">{errors.company}</div>}
                        </div>

                        {/* 5. Business / Category */}
                        <div className="visitors-form-group">
                            <label htmlFor="business">
                                Business / Category <span className="visitors-required">*</span>
                            </label>
                            <input
                                id="business"
                                type="text"
                                name="business"
                                value={formData.business}
                                onChange={handleChange}
                                placeholder="Enter business type / industry"
                                required
                            />
                            {errors.business && <div className="text-danger small mt-1">{errors.business}</div>}
                        </div>

                        {/* 6. Joining */}
                        <div className="visitors-form-group">
                            <label htmlFor="joining">
                                Joining <span className="visitors-required">*</span>
                            </label>
                            <select
                                id="joining"
                                name="joining"
                                value={formData.joining}
                                onChange={handleChange}
                                required
                            >
                                <option value="Yes (Interested to Join)">Yes (Interested to Join)</option>
                                <option value="No (Not Interested)">No (Not Interested)</option>
                                <option value="Undecided / Considering">Undecided / Considering</option>
                            </select>
                        </div>

                        {/* 7. Join by (Invited / Referred By) */}
                        <div className="visitors-form-group">
                            <label htmlFor="invited_by_member">
                                Join by (Invited / Referred By) <span className="visitors-required">*</span>
                            </label>
                            {members.length > 0 ? (
                                <select
                                    id="invited_by_member"
                                    name="invited_by_member"
                                    value={formData.invited_by_member}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">-- Select Member / Referrer --</option>
                                    {members.map((m) => {
                                        const fullName = `${m.personalDetails?.firstName || ""} ${m.personalDetails?.lastName || ""}`.trim() || m.name || m._id;
                                        return (
                                            <option key={m._id} value={fullName}>
                                                {fullName}
                                            </option>
                                        );
                                    })}
                                    <option value="Direct / Self">Direct / Self</option>
                                </select>
                            ) : (
                                <input
                                    id="invited_by_member"
                                    type="text"
                                    name="invited_by_member"
                                    value={formData.invited_by_member}
                                    onChange={handleChange}
                                    placeholder={formData.chapter ? "Enter inviter or reference name" : "Select Chapter first or enter name"}
                                    required
                                />
                            )}
                            {errors.invited_by_member && (
                                <div className="text-danger small mt-1">{errors.invited_by_member}</div>
                            )}
                        </div>

                        {/* 8. Joining Date */}
                        {(formData.joining === "Yes (Interested to Join)" || formData.joining?.startsWith("Yes")) && (
                            <div className="visitors-form-group">
                                <label htmlFor="joiningDate">
                                    Joining Date <span className="visitors-required">*</span>
                                </label>
                                <input
                                    id="joiningDate"
                                    type="date"
                                    name="joiningDate"
                                    value={formData.joiningDate}
                                    onChange={handleChange}
                                    required
                                />
                                {errors.joiningDate && <div className="text-danger small mt-1">{errors.joiningDate}</div>}
                            </div>
                        )}
                    </div>
                </fieldset>

                <button type="submit" className="visitors-submit-btn">
                    Submit Visitor Feedback
                </button>
            </form>
        </div>
    );
}
