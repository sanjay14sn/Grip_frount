import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ZoneApiProvider from "../services/visitorApi";
import Swal from "sweetalert2";
import '../App.css';

export default function VisitorsForm() {
    const { zoneName, chapterName } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        zone: "",
        zoneId: "",
        chapter: "",
        invitedBy: "",
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
    const [eds, setEds] = useState([]);

    const [rdUsers, setRdUsers] = useState([]);
    const [mentorUsers, setMentorUsers] = useState([]);
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
                    const fetchedZones = response.response.data;
                    setZones(fetchedZones);

                    if (zoneName) {
                        const formattedUrlZone = zoneName.toLowerCase().replace(/\s+/g, '');
                        const matchingZone = fetchedZones.find(z => z.zoneName.toLowerCase().replace(/\s+/g, '') === formattedUrlZone);

                        if (matchingZone) {
                            setFormData(prev => ({
                                ...prev,
                                zone: matchingZone.zoneName,
                                zoneId: matchingZone._id
                            }));
                        } else {
                            // Invalid zone in URL
                            Swal.fire({
                                icon: 'error',
                                title: 'Invalid Zone Link',
                                text: 'The zone link you followed is invalid.'
                            }).then(() => {
                                navigate('/');
                            });
                        }
                    }
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
                    const fetchedChapters = response.response.data;
                    setChapters(fetchedChapters);

                    if (chapterName) {
                        const formattedUrlChapter = chapterName.toLowerCase().replace(/\s+/g, '');
                        const matchingChapter = fetchedChapters.find(c => c.chapterName.toLowerCase().replace(/\s+/g, '') === formattedUrlChapter);

                        if (matchingChapter) {
                            setFormData(prev => ({
                                ...prev,
                                chapter: matchingChapter.chapterName,
                                chapterId: matchingChapter._id
                            }));
                        } else {
                            // Invalid chapter in URL
                            Swal.fire({
                                icon: 'error',
                                title: 'Invalid Chapter Link',
                                text: 'The chapter link you followed is invalid.'
                            }).then(() => {
                                navigate(zoneName ? `/visitors/${zoneName}` : '/');
                            });
                        }
                    }
                } else {
                    setChapters([]);
                }
            } catch (error) {
                console.error("Failed to fetch chapters:", error);
                setChapters([]);
            }
        }
        fetchChapters();
    }, [formData.zoneId, chapterName, navigate, zoneName]);

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

    // Fetch all CIDs, GRIP users, RD users, Mentors
    useEffect(() => {
        fetchEds();

        fetchRdUsers();
        fetchMentors();
    }, []);

    async function fetchEds() {
        try {
            const response = await ZoneApiProvider.getUsersByRole({ role: "ED" });
            if (response.status && response.response?.data) {
                const edOptions = response.response.data.map((user) => ({
                    value: user._id,
                    label: user.name,
                    zoneId: user.zoneId
                }));
                setEds(edOptions);
            } else {
                setEds([]);
            }
        } catch (error) {
            console.error("Failed to fetch EDs:", error);
            setEds([]);
        }
    }



    async function fetchRdUsers() {
        try {
            const response = await ZoneApiProvider.getUsersByRole({ role: "RD" });
            if (response.status && response.response?.data) {
                const rdOptions = response.response.data.map((user) => ({
                    value: user._id,
                    label: user.name,
                }));
                setRdUsers(rdOptions);
            } else {
                setRdUsers([]);
            }
        } catch (error) {
            console.error("Failed to fetch RD users:", error);
            setRdUsers([]);
        }
    }

    async function fetchMentors() {
        try {
            const response = await ZoneApiProvider.getUsersByRole({ role: "Mentor" });
            if (response.status && response.response?.data) {
                const mentorOptions = response.response.data.map((user) => ({
                    value: user._id,
                    label: user.name,
                }));
                setMentorUsers(mentorOptions);
            } else {
                setMentorUsers([]);
            }
        } catch (error) {
            console.error("Failed to fetch Mentors:", error);
            setMentorUsers([]);
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
            setFormData(prev => ({
                ...prev,
                invited_from: value,
                invited_by_member: value === "GRIP" ? "GRIP" : "",
                invitedBy: ""
            }));
            return;
        }

        if (name === "invited_by_member") {
            if (formData.invited_from === "Associate") {
                const selectedMember = members.find(m => m._id === value);
                setFormData(prev => ({
                    ...prev,
                    invited_by_member: selectedMember ? `${selectedMember.personalDetails?.firstName || ""} ${selectedMember.personalDetails?.lastName || ""}`.trim() : "",
                    invitedBy: selectedMember ? selectedMember._id : ""
                }));
            } else {
                setFormData(prev => ({
                    ...prev,
                    invited_by_member: value,
                    invitedBy: ""
                }));
            }
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
                    invitedBy: "",
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
                <img src="/logo.png" alt="GRIP Logo" />
            </div>

            <h2 className="visitors-title">
                {formData.zone
                    ? `${formData.zone}${formData.chapter ? ` ( ${formData.chapter} )` : ""} Visitor Form`
                    : zoneName
                        ? `${zoneName.charAt(0).toUpperCase() + zoneName.slice(1)}${chapterName ? ` ( ${chapterName.charAt(0).toUpperCase() + chapterName.slice(1)} )` : ""} Visitor Form`
                        : "Visitor Form"}
            </h2>

            <form id="visitors-form" onSubmit={handleSubmit}>
                <fieldset className="visitors-fieldset">
                    <div className="visitors-form-row">
                        {/* --- Zone --- */}
                        {!zoneName && (
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
                        )}

                        {/* --- Chapters --- */}
                        <div className="visitors-form-group">
                            <label>
                                Chapters <span className="visitors-required">*</span>
                            </label>
                            <select
                                name="chapter"
                                value={formData.chapter}
                                onChange={handleChange}
                                disabled={!formData.zoneId || !!chapterName}
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
                                <option value="">-- Select Invite Source --</option>
                                <option value="Associate">Associate</option>
                                <option value="ED">ED</option>
                                <option value="RD">RD</option>
                                <option value="Mentor">Mentor</option>
                                <option value="GRIP">GRIP</option>
                            </select>
                        </div>

                        {/* --- Who Invited (ED) --- */}
                        {formData.invited_from !== "GRIP" && (
                            <div className="visitors-form-group">
                                <label>
                                    {formData.invited_from ? `Who Invited - ${formData.invited_from} name` : "Who Invited"} <span className="visitors-required">*</span>
                                </label>
                                <select
                                    name="invited_by_member"
                                    value={formData.invited_from === "Associate" ? formData.invitedBy : formData.invited_by_member}
                                    onChange={handleChange}
                                    disabled={!formData.invited_from}
                                    required
                                >
                                    <option value="">
                                        {formData.invited_from ? `-- Select ${formData.invited_from} Member --` : "-- Select Type First --"}
                                    </option>
                                    {formData.invited_from === "Associate" &&
                                        members.map((member) => {
                                            const fullName = `${member.personalDetails?.firstName || ""} ${member.personalDetails?.lastName || ""}`.trim() || member._id;
                                            return (
                                                <option key={member._id} value={member._id}>
                                                    {fullName}
                                                </option>
                                            );
                                        })
                                    }
                                    {formData.invited_from === "ED" &&
                                        eds
                                            .filter(user => user.zoneId === formData.zoneId)
                                            .map((ed) => (
                                                <option key={ed.value} value={ed.label}>
                                                    {ed.label}
                                                </option>
                                            ))
                                    }
                                    {formData.invited_from === "RD" &&
                                        rdUsers.map((user) => (
                                            <option key={user.value} value={user.label}>
                                                {user.label}
                                            </option>
                                        ))
                                    }
                                    {formData.invited_from === "Mentor" &&
                                        mentorUsers
                                            .filter(user => {
                                                const selectedChapter = chapters.find(c => c._id === formData.chapterId);
                                                return selectedChapter?.mentorId?.includes(user.value);
                                            })
                                            .map((user) => (
                                                <option key={user.value} value={user.label}>
                                                    {user.label}
                                                </option>
                                            ))
                                    }
                                </select>
                            </div>
                        )}

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


                    </div>
                </fieldset>

                <button type="submit" className="visitors-submit-btn">
                    Submit Form
                </button>


            </form>
        </div>
    );
}
