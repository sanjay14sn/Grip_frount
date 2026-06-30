import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ZoneApiProvider from "../services/visitorApi";
import Swal from "sweetalert2";
import '../App.css';

export default function AssociateApplicationForm() {
    const { zoneName } = useParams();
    const navigate = useNavigate();
    const [zones, setZones] = useState([]);
    const [chapters, setChapters] = useState([]);
    const [members, setMembers] = useState([]);
    const [eds, setEds] = useState([]);
    const [rdUsers, setRdUsers] = useState([]);
    const [mentorUsers, setMentorUsers] = useState([]);

    const [formData, setFormData] = useState({
        zone: "",
        zoneId: "",
        chapterName: "",
        chapterId: "",
        invited_from: "",
        invited_by_member: "",
        invitedBy: "",
        hearAbout: "",
        firstName: "",
        lastName: "",
        companyName: "",
        industry: "",
        category: "",
        dobDay: "",
        dobMonth: "",
        dobYear: "",
        pastAssociate: "Yes",
        otherNetworking: "",
        aadharCard: null,
        education: "",
        addressLine1: "",
        addressLine2: "",
        state: "",
        city: "",
        postalCode: "",
        email: "",
        mobile: "",
        secondaryPhone: "",
        website: "",
        gstNumber: "",
        businessDetails: "",
        yearsInBusiness: "",
        ref1FirstName: "",
        ref1LastName: "",
        ref1BusinessName: "",
        ref1Phone: "",
        ref1Relationship: "",
        agreeShareInfo: false,
        agreeShareInfoRef: false,
        attendMeetings: false,
        bringVisitors: false,
        positiveAttitude: false,
        contributorsWin: false,
        abidePolicies: false,
        contributeBest: false,
        agreeCommitments: false,
        referralRating: ""
    });

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        
        if (name === "zone") {
            const selectedZone = zones.find((z) => z.zoneName === value);
            setFormData(prev => ({
                ...prev,
                zone: value,
                zoneId: selectedZone?._id || "",
                chapterName: "",
                chapterId: "",
            }));
            setChapters([]);
            return;
        }

        if (name === "chapterName") {
            const selectedChapter = chapters.find((chap) => chap.chapterName === value);
            setFormData(prev => ({
                ...prev,
                chapterName: value,
                chapterId: selectedChapter?._id || "",
            }));
            return;
        }

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

        if (type === "checkbox") {
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else if (type === "file") {
            setFormData(prev => ({ ...prev, [name]: files[0] }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await ZoneApiProvider.submitAssociateApplication(formData);
            if (response.status && response.response.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Form Submitted Successfully!',
                }).then(() => {
                    navigate('/');
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Submission Failed',
                    text: response.response?.message || 'Something went wrong. Please try again.',
                });
            }
        } catch (error) {
            console.error("Submission error:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An unexpected error occurred.',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

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
    }, [zoneName, navigate]);

    useEffect(() => {
        async function fetchChapters() {
            if (!formData.zoneId) {
                setChapters([]);
                return;
            }
            try {
                const response = await ZoneApiProvider.getChaptersByZonePublic(formData.zoneId);
                if (response.status && response.response.success) {
                    const activeChapters = response.response.data.filter(chap => chap.isActive === 1 && chap.isDelete !== 1);
                    setChapters(activeChapters);
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

    useEffect(() => {
        async function fetchRoles() {
            try {
                const [edRes, rdRes, mentorRes] = await Promise.all([
                    ZoneApiProvider.getUsersByRole({ role: "ED" }),
                    ZoneApiProvider.getUsersByRole({ role: "RD" }),
                    ZoneApiProvider.getUsersByRole({ role: "Mentor" })
                ]);
                
                if (edRes.status && edRes.response?.data) {
                    setEds(edRes.response.data.map(user => ({ value: user._id, label: user.name, zoneId: user.zoneId })));
                }
                if (rdRes.status && rdRes.response?.data) {
                    setRdUsers(rdRes.response.data.map(user => ({ value: user._id, label: user.name })));
                }
                if (mentorRes.status && mentorRes.response?.data) {
                    setMentorUsers(mentorRes.response.data.map(user => ({ value: user._id, label: user.name })));
                }
            } catch (error) {
                console.error("Failed to fetch role users:", error);
            }
        }
        fetchRoles();
    }, []);

    return (
        <div className="visitors-container">
            <div className="visitors-logo">
                <img src="/logo.png" alt="GRIP Logo" />
            </div>

            <h2 className="visitors-title" style={{ color: "#d32f2f", textAlign: 'center', marginBottom: '30px', fontWeight: 'bold', fontSize: '20px' }}>
                {formData.zone ? `${formData.zone} - Associate Application Form` : zoneName ? `${zoneName.charAt(0).toUpperCase() + zoneName.slice(1)} - Associate Application Form` : "Associate Application Form"}
            </h2>

            <form onSubmit={handleSubmit}>
                <fieldset className="visitors-fieldset">
                    <legend style={{ fontWeight: 'bold', fontSize: '18px', padding: '0 10px', color: '#333' }}>Chapter Information</legend>
                    <div className="visitors-form-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '10px' }}>
                        <div className="visitors-form-group">
                            <label>Chapter Name <span className="visitors-required">*</span></label>
                            <select name="chapterName" value={formData.chapterName} onChange={handleChange} disabled={!formData.zoneId} required>
                                <option value="">-- Select Chapter --</option>
                                {chapters.map((chapter) => (
                                    <option key={chapter._id} value={chapter.chapterName}>
                                        {chapter.chapterName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="visitors-form-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '15px' }}>
                        <div className="visitors-form-group">
                            <label>Who Invited - Associate <span className="visitors-required">*</span></label>
                            <select name="invited_from" value={formData.invited_from} onChange={handleChange} disabled={!formData.chapterId} required>
                                <option value="">-- Select Invite Source --</option>
                                <option value="Associate">Associate</option>
                                <option value="ED">ED</option>
                                <option value="RD">RD</option>
                                <option value="Mentor">Mentor</option>
                                <option value="GRIP">GRIP</option>
                            </select>
                        </div>
                        {formData.invited_from !== "GRIP" && (
                            <div className="visitors-form-group">
                                <label>
                                    {formData.invited_from ? `Who Invited - ${formData.invited_from} name` : "Who Invited"} 
                                    {(!["ED", "RD"].includes(formData.invited_from)) && <span className="visitors-required">*</span>}
                                </label>
                                <select 
                                    name="invited_by_member" 
                                    value={formData.invited_from === "Associate" ? formData.invitedBy : formData.invited_by_member} 
                                    onChange={handleChange} 
                                    disabled={!formData.invited_from} 
                                    required={!["ED", "RD"].includes(formData.invited_from)}
                                >
                                    <option value="">{formData.invited_from ? `-- Select ${formData.invited_from} ${formData.invited_from === "Associate" ? "Member" : "Name"} --` : "-- Select Type First --"}</option>
                                    {formData.invited_from === "Associate" && members.map(member => (
                                        <option key={member._id} value={member._id}>
                                            {`${member.personalDetails?.firstName || ""} ${member.personalDetails?.lastName || ""}`.trim() || member._id}
                                        </option>
                                    ))}
                                    {formData.invited_from === "ED" && eds.filter(user => user.zoneId === formData.zoneId).map(ed => (
                                        <option key={ed.value} value={ed.label}>{ed.label}</option>
                                    ))}
                                    {formData.invited_from === "RD" && rdUsers.map(user => (
                                        <option key={user.value} value={user.label}>{user.label}</option>
                                    ))}
                                    {formData.invited_from === "Mentor" && mentorUsers.filter(user => {
                                        const selectedChapter = chapters.find(c => c._id === formData.chapterId);
                                        return selectedChapter?.mentorId?.includes(user.value);
                                    }).map(user => (
                                        <option key={user.value} value={user.label}>{user.label}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                        <div className="visitors-form-group">
                            <label>How did you hear about GRIP? <span className="visitors-required">*</span></label>
                            <select name="hearAbout" value={formData.hearAbout} onChange={handleChange} required>
                                <option value="">-- Select an option --</option>
                                <option value="Online">Online</option>
                                <option value="Facebook">Facebook</option>
                                <option value="Instagram">Instagram</option>
                                <option value="Friends">Friends</option>
                                <option value="WhatsApp">WhatsApp</option>
                                <option value="Email">Email</option>
                                <option value="Others">Others</option>
                            </select>
                        </div>
                    </div>
                </fieldset>

                <fieldset className="visitors-fieldset" style={{ marginTop: '30px' }}>
                    <legend style={{ fontWeight: 'bold', fontSize: '18px', padding: '0 10px', color: '#333' }}>Personal Details</legend>
                    <div className="visitors-form-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '10px' }}>
                        <div className="visitors-form-group">
                            <label>First Name <span className="visitors-required">*</span></label>
                            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
                        </div>
                        <div className="visitors-form-group">
                            <label>Last Name</label>
                            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
                        </div>
                        <div className="visitors-form-group">
                            <label>Company Name <span className="visitors-required">*</span></label>
                            <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} required />
                        </div>
                    </div>
                    <div className="visitors-form-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '15px' }}>
                        <div className="visitors-form-group">
                            <label>Industry</label>
                            <input type="text" name="industry" value={formData.industry} onChange={handleChange} />
                        </div>
                        <div className="visitors-form-group">
                            <label>Category You Represent <span className="visitors-required">*</span></label>
                            <input type="text" name="category" value={formData.category} onChange={handleChange} required />
                        </div>
                        <div className="visitors-form-group">
                            <label>Date of Birth:</label>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <select name="dobDay" value={formData.dobDay} onChange={handleChange} style={{ flex: 1 }}>
                                    <option value="">Day</option>
                                    {[...Array(31)].map((_, i) => <option key={i+1} value={i+1}>{i+1}</option>)}
                                </select>
                                <select name="dobMonth" value={formData.dobMonth} onChange={handleChange} style={{ flex: 1 }}>
                                    <option value="">Month</option>
                                    {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(m => <option key={m} value={m}>{m}</option>)}
                                </select>
                                <select name="dobYear" value={formData.dobYear} onChange={handleChange} style={{ flex: 1 }}>
                                    <option value="">Year</option>
                                    {[...Array(100)].map((_, i) => {
                                        const year = new Date().getFullYear() - i;
                                        return <option key={year} value={year}>{year}</option>
                                    })}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="visitors-form-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '15px' }}>
                        <div className="visitors-form-group">
                            <label>Have you or your company ever been a associate of GRIP chapter? <span className="visitors-required">*</span></label>
                            <select name="pastAssociate" value={formData.pastAssociate} onChange={handleChange} required>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                        </div>
                        <div className="visitors-form-group">
                            <label>Do you belong to any other networking organisations? <span className="visitors-required">*</span></label>
                            <select name="otherNetworking" value={formData.otherNetworking} onChange={handleChange} required>
                                <option value="">-- Select --</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                        </div>
                        <div className="visitors-form-group">
                            <label>Aadhar Card <span className="visitors-required">*</span></label>
                            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: '5px', padding: '5px' }}>
                                <input type="file" name="aadharCard" onChange={handleChange} required style={{ border: 'none', width: '100%' }} />
                            </div>
                        </div>
                    </div>
                </fieldset>

                <fieldset className="visitors-fieldset" style={{ marginTop: '30px' }}>
                    <legend style={{ fontWeight: 'bold', fontSize: '18px', padding: '0 10px', color: '#333' }}>Education</legend>
                    <div className="visitors-form-row">
                        <div className="visitors-form-group">
                            <select name="education" value={formData.education} onChange={handleChange} style={{ width: '100%' }}>
                                <option value="">-- Select Education --</option>
                                <option value="High School">High School</option>
                                <option value="Diploma in Business">Diploma in Business</option>
                                <option value="Bachelor's Degree">Bachelor's Degree</option>
                                <option value="MBA / Master's in Business">MBA / Master's in Business</option>
                                <option value="Professional Degree">Professional Degree</option>
                                <option value="Entrepreneurship Certificate">Entrepreneurship Certificate</option>
                                <option value="Others">Others</option>
                            </select>
                        </div>
                    </div>
                </fieldset>

                <fieldset className="visitors-fieldset" style={{ marginTop: '30px' }}>
                    <legend style={{ fontWeight: 'bold', fontSize: '18px', padding: '0 10px', color: '#333' }}>Business Address</legend>
                    <div className="visitors-form-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '10px' }}>
                        <div className="visitors-form-group">
                            <label>Address Line 1 <span className="visitors-required">*</span></label>
                            <input type="text" name="addressLine1" value={formData.addressLine1} onChange={handleChange} required />
                        </div>
                        <div className="visitors-form-group">
                            <label>Address Line 2 <span className="visitors-required">*</span></label>
                            <input type="text" name="addressLine2" value={formData.addressLine2} onChange={handleChange} required />
                        </div>
                        <div className="visitors-form-group">
                            <label>State / Province <span className="visitors-required">*</span></label>
                            <select name="state" value={formData.state} onChange={handleChange} required>
                                <option value="">Select State</option>
                                <option value="Tamil Nadu">Tamil Nadu</option>
                            </select>
                        </div>
                    </div>
                    <div className="visitors-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '15px' }}>
                        <div className="visitors-form-group">
                            <label>City <span className="visitors-required">*</span></label>
                            <select name="city" value={formData.city} onChange={handleChange} required>
                                <option value="">Select City</option>
                                <option value="Chennai">Chennai</option>
                            </select>
                        </div>
                        <div className="visitors-form-group">
                            <label>Postal Code <span className="visitors-required">*</span></label>
                            <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} required />
                        </div>
                    </div>
                </fieldset>

                <fieldset className="visitors-fieldset" style={{ marginTop: '30px' }}>
                    <legend style={{ fontWeight: 'bold', fontSize: '18px', padding: '0 10px', color: '#333' }}>Contact Details</legend>
                    <div className="visitors-form-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '10px' }}>
                        <div className="visitors-form-group">
                            <label>Email <span className="visitors-required">*</span></label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                        </div>
                        <div className="visitors-form-group">
                            <label>Mobile Number <span className="visitors-required">*</span></label>
                            <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} required />
                        </div>
                        <div className="visitors-form-group">
                            <label>Secondary Phone</label>
                            <input type="tel" name="secondaryPhone" value={formData.secondaryPhone} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="visitors-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '15px' }}>
                        <div className="visitors-form-group">
                            <label>Website</label>
                            <input type="url" name="website" value={formData.website} onChange={handleChange} />
                        </div>
                        <div className="visitors-form-group">
                            <label>GST Number (Optional)</label>
                            <input type="text" name="gstNumber" value={formData.gstNumber} onChange={handleChange} />
                        </div>
                    </div>
                </fieldset>

                <fieldset className="visitors-fieldset" style={{ marginTop: '30px' }}>
                    <legend style={{ fontWeight: 'bold', fontSize: '18px', padding: '0 10px', color: '#333' }}>Your Business Details</legend>
                    <div className="visitors-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '10px' }}>
                        <div className="visitors-form-group" style={{ gridColumn: 'span 1' }}>
                            <textarea name="businessDetails" value={formData.businessDetails} onChange={handleChange} rows="4" placeholder="Describe your business experience" style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }}></textarea>
                        </div>
                        <div className="visitors-form-group" style={{ gridColumn: 'span 1' }}>
                            <label>How many years are you in the business?</label>
                            <select name="yearsInBusiness" value={formData.yearsInBusiness} onChange={handleChange}>
                                <option value="">Select duration</option>
                                <option value="0-1">0-1 years</option>
                                <option value="1-3">1-3 years</option>
                                <option value="3-5">3-5 years</option>
                                <option value="5+">5+ years</option>
                            </select>
                        </div>
                    </div>
                </fieldset>

                <fieldset className="visitors-fieldset" style={{ marginTop: '30px' }}>
                    <legend style={{ fontWeight: 'bold', fontSize: '18px', padding: '0 10px', color: '#333' }}>Business References</legend>
                    <p style={{ fontStyle: 'italic', marginBottom: '15px', color: '#666' }}>These references won't be used for promotion</p>
                    <div className="visitors-form-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                        <div className="visitors-form-group">
                            <label>Ref 1: First Name</label>
                            <input type="text" name="ref1FirstName" value={formData.ref1FirstName} onChange={handleChange} />
                        </div>
                        <div className="visitors-form-group">
                            <label>Ref 1: Last Name</label>
                            <input type="text" name="ref1LastName" value={formData.ref1LastName} onChange={handleChange} />
                        </div>
                        <div className="visitors-form-group">
                            <label>Business Name</label>
                            <input type="text" name="ref1BusinessName" value={formData.ref1BusinessName} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="visitors-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '15px' }}>
                        <div className="visitors-form-group">
                            <label>Phone</label>
                            <input type="tel" name="ref1Phone" value={formData.ref1Phone} onChange={handleChange} />
                        </div>
                        <div className="visitors-form-group">
                            <label>Relationship</label>
                            <input type="text" name="ref1Relationship" value={formData.ref1Relationship} onChange={handleChange} />
                        </div>
                    </div>
                    <div style={{ marginTop: '20px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', cursor: 'pointer' }}>
                            <input type="checkbox" name="agreeShareInfo" checked={formData.agreeShareInfo} onChange={handleChange} style={{ width: '16px', height: '16px', margin: 0, padding: 0 }} />
                            I have/will inform the above contacts that I'm sharing their info with GRIP.
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                            <input type="checkbox" name="agreeShareInfoRef" checked={formData.agreeShareInfoRef} onChange={handleChange} style={{ width: '16px', height: '16px', margin: 0, padding: 0 }} />
                            I have/will inform the above contacts that I am sharing their information with GRIP for the purpose of references
                        </label>
                    </div>
                </fieldset>

                <div style={{ marginTop: '40px' }}>
                    <h3 style={{ color: '#d32f2f', fontSize: '18px', fontWeight: 'bold' }}>Terms and Certifications</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '15px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                            <input type="checkbox" name="attendMeetings" checked={formData.attendMeetings} onChange={handleChange} style={{ width: '16px', height: '16px', margin: 0, padding: 0 }} required />
                            I will be able to attend our GRIP weekly meetings on time.
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                            <input type="checkbox" name="bringVisitors" checked={formData.bringVisitors} onChange={handleChange} style={{ width: '16px', height: '16px', margin: 0, padding: 0 }} required />
                            I will be able to bring visitors to this GRIP chapter meetings.
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                            <input type="checkbox" name="positiveAttitude" checked={formData.positiveAttitude} onChange={handleChange} style={{ width: '16px', height: '16px', margin: 0, padding: 0 }} required />
                            I will always display a positive attitude.
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                            <input type="checkbox" name="contributorsWin" checked={formData.contributorsWin} onChange={handleChange} style={{ width: '16px', height: '16px', margin: 0, padding: 0 }} required />
                            <span>I understand that "Contributors Win"<sup style={{ color: '#d32f2f', fontSize: '10px', marginLeft: '2px' }}>TM</sup></span>
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                            <input type="checkbox" name="abidePolicies" checked={formData.abidePolicies} onChange={handleChange} style={{ width: '16px', height: '16px', margin: 0, padding: 0 }} required />
                            I will abide by the policies of GRIP.
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                            <input type="checkbox" name="contributeBest" checked={formData.contributeBest} onChange={handleChange} style={{ width: '16px', height: '16px', margin: 0, padding: 0 }} required />
                            I will contribute to the best of my knowledge & ability.
                        </label>
                    </div>
                </div>

                <div style={{ marginTop: '40px', textAlign: 'center' }}>
                    <h3 style={{ color: '#d32f2f', fontSize: '18px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                        <span style={{ color: '#28a745', fontSize: '20px' }}>✅</span> Commitments & Responsibilities
                    </h3>
                </div>

                <div style={{ marginTop: '20px' }}>
                    <p style={{ fontWeight: 'bold', marginBottom: '15px' }}>Please read the following commitments:</p>
                    <ul style={{ listStyleType: 'disc', paddingLeft: '40px', lineHeight: '1.8', color: '#333' }}>
                        <li>Arrive at weekly meetings on time and stay for the full 90 minutes.</li>
                        <li>Attend the learning program.</li>
                        <li>Follow GRIP's Policies, Guidelines, and Code of Ethics.</li>
                        <li>Arrange and send a qualified substitute if unable to attend a meeting.</li>
                        <li>Bring referrals and/or visitors to the chapter on a regular basis.</li>
                    </ul>

                    <div style={{ marginTop: '20px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
                            <input type="checkbox" name="agreeCommitments" checked={formData.agreeCommitments} onChange={handleChange} style={{ width: '16px', height: '16px', margin: 0, padding: 0 }} required />
                            I agree to all of the above commitments.
                        </label>
                    </div>

                    <div style={{ marginTop: '25px' }}>
                        <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>Please rate your ability to provide quality Referrals and Visitors to the chapter:</p>
                        <select name="referralRating" value={formData.referralRating} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', maxWidth: '300px' }}>
                            <option value="">-- Select Option --</option>
                            <option value="Excellent">Excellent</option>
                            <option value="Good">Good</option>
                            <option value="Average">Average</option>
                        </select>
                    </div>
                </div>

                <div style={{ marginTop: '40px', textAlign: 'center' }}>
                    <button type="submit" className="visitors-submit-btn" disabled={isSubmitting} style={{ padding: '12px 30px', fontSize: '16px', fontWeight: 'bold', backgroundColor: '#d32f2f', color: '#fff', border: 'none', borderRadius: '5px', cursor: isSubmitting ? 'not-allowed' : 'pointer', transition: 'background-color 0.3s', opacity: isSubmitting ? 0.7 : 1 }}>
                        {isSubmitting ? "Submitting..." : "Submit Application"}
                    </button>
                </div>
            </form>
        </div>
    );
}
