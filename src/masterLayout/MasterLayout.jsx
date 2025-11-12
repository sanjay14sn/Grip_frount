import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { registerSocket, disconnectSocket, listenForEvent } from "../socket";
import loginApiProvider from "../services/login";
import { IMAGE_BASE_URL } from "../config";

const MasterLayout = ({ children }) => {
  const [sidebarActive, setSidebarActive] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [userName, setUserName] = useState(
    JSON.parse(localStorage.getItem("userData"))
  );
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    const userDataString = localStorage.getItem("userData");
    const userData = userDataString ? JSON.parse(userDataString) : null;
    const memberId = userData ? userData.id : null;

    if (!token) {
      navigate("/");
    } else if (memberId) {
      registerSocket(memberId);

      listenForEvent("notifications:update", (data) => {
        setNotifications(data);
        setUnreadCount(data.filter((n) => !n.isRead).length);
      });
      fetchNotifications();
    }

    return () => {
      disconnectSocket();
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await loginApiProvider.getNotifications();
      if (
        response &&
        response.status &&
        response.response &&
        response.response.data
      ) {
        const notificationsData = Array.isArray(response.response.data)
          ? response.response.data
          : [];
        setNotifications(notificationsData);
        setUnreadCount(notificationsData.filter((n) => !n.isRead).length);
      } else {
        setNotifications([]);
        setUnreadCount(0);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      setNotifications([]);
      setUnreadCount(0);
    }
  };

  // Sidebar dropdown logic
  useEffect(() => {
    const handleDropdownClick = (event) => {
      event.preventDefault();
      const clickedLink = event.currentTarget;
      const clickedDropdown = clickedLink.closest(".dropdown");

      if (!clickedDropdown) return;

      const isActive = clickedDropdown.classList.contains("open");

      const allDropdowns = document.querySelectorAll(".sidebar-menu .dropdown");
      allDropdowns.forEach((dropdown) => {
        dropdown.classList.remove("open");
        const submenu = dropdown.querySelector(".sidebar-submenu");
        if (submenu) submenu.style.maxHeight = "0px";
      });

      if (!isActive) {
        clickedDropdown.classList.add("open");
        const submenu = clickedDropdown.querySelector(".sidebar-submenu");
        if (submenu) submenu.style.maxHeight = `${submenu.scrollHeight}px`;
      }
    };

    const dropdownTriggers = document.querySelectorAll(
      ".sidebar-menu .dropdown > a, .sidebar-menu .dropdown > Link"
    );

    dropdownTriggers.forEach((trigger) => {
      trigger.addEventListener("click", handleDropdownClick);
    });

    const openActiveDropdown = () => {
      const allDropdowns = document.querySelectorAll(".sidebar-menu .dropdown");
      allDropdowns.forEach((dropdown) => {
        const submenuLinks = dropdown.querySelectorAll(".sidebar-submenu li a");
        submenuLinks.forEach((link) => {
          if (
            link.getAttribute("href") === location.pathname ||
            link.getAttribute("to") === location.pathname
          ) {
            dropdown.classList.add("open");
            const submenu = dropdown.querySelector(".sidebar-submenu");
            if (submenu) submenu.style.maxHeight = `${submenu.scrollHeight}px`;
          }
        });
      });
    };

    openActiveDropdown();

    return () => {
      dropdownTriggers.forEach((trigger) => {
        trigger.removeEventListener("click", handleDropdownClick);
      });
    };
  }, [location.pathname]);

  // Click outside profile/notifications
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".profile-dropdown")) setProfileOpen(false);
      if (!event.target.closest(".notification-dropdown"))
        setNotificationOpen(false);
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Fetch user data
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData) getMemberById(userData);
  }, []);

  const getMemberById = async (userData) => {
    try {
      const response = await loginApiProvider.getMemberById(userData?.id);
      if (response && response.status) {
        setUserName(response?.response?.data);
      }
    } catch (error) {
      console.error("Failed to fetch member data:", error);
    }
  };

  const toggleSidebar = () => setSidebarActive(!sidebarActive);
  const toggleMobileMenu = () => setMobileMenu(!mobileMenu);

  const logOutFunct = () => {
    localStorage.clear();
    disconnectSocket();
    navigate("/sign-in", { replace: true });
    window.location.reload();
  };

  return (
    <section className={mobileMenu ? "overlay active" : "overlay"}>
      <main
        className={sidebarActive ? "dashboard-main active" : "dashboard-main"}
      >
        {/* Header */}
        <div className="navbar-header compact-header">
          <div className="row align-items-center justify-content-between">
            <div className="col-auto">
              <div className="d-flex flex-wrap align-items-center gap-3">
                <div className="logoimggg">
                  <img
                    src="assets/images/grip/logo.png"
                    style={{ height: "100px",width:"100px", objectFit: "contain" }}
                    className="header-logo-img"
                    alt="Logo"
                  />
                </div>
              </div>
            </div>
            <div className="col-auto">
              <div className="d-flex flex-wrap align-items-center gap-3">
                {/* Notification Dropdown */}
                <div className="dropdown notification-dropdown position-relative">
                  <button
                    className="has-indicator w-40-px h-40-px bg-gradient-blue-warning text-white rounded-circle d-flex justify-content-center align-items-center"
                    type="button"
                    onClick={() => setNotificationOpen(!notificationOpen)}
                  >
                    <Icon icon="iconoir:bell" className="text-white text-xl" />
                    {unreadCount > 0 && (
                      <span className="indicator">{unreadCount}</span>
                    )}
                  </button>
                  {notificationOpen && (
                    <div className="dropdown-menu show to-top dropdown-menu-lg p-0 custom-dropdown-position">
                      <div className="m-16 py-12 px-16 radius-8 bg-primary-50 mb-16 d-flex align-items-center justify-content-between gap-2">
                        <h6 className="text-lg text-primary-light fw-semibold mb-0">
                          Notifications
                        </h6>
                        {unreadCount > 0 && (
                          <span className="text-primary-600 fw-semibold text-lg w-40-px h-40-px rounded-circle bg-base d-flex justify-content-center align-items-center">
                            {unreadCount}
                          </span>
                        )}
                      </div>
                      <div className="max-h-400-px overflow-y-auto scroll-sm pe-4">
                        {notifications?.length > 0 ? (
                          notifications.slice(0, 4).map((item, index) => (
                            <Link
                              to="#"
                              key={item._id || index}
                              className="px-24 py-12 d-flex align-items-start gap-3 mb-2 justify-content-between hover-bg-light"
                            >
                              <div className="d-flex align-items-center gap-3">
                                <span className="w-44-px h-44-px bg-primary-50 text-primary-main rounded-circle d-flex justify-content-center align-items-center flex-shrink-0 overflow-hidden">
                                  {item.fromMember?.personalDetails
                                    ?.profileImage?.docPath ? (
                                    <img
                                      src={`${IMAGE_BASE_URL}/${item.fromMember.personalDetails.profileImage.docPath}/${item.fromMember.personalDetails.profileImage.docName}`}
                                      alt={
                                        item.fromMember.personalDetails
                                          .firstName
                                      }
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <Icon
                                      icon={
                                        item.type === "onetoone"
                                          ? "mdi:account-group"
                                          : item.type === "referral"
                                            ? "mdi:account-plus"
                                            : item.type === "testimonial"
                                              ? "mdi:message-text"
                                              : item.type === "thankyou"
                                                ? "mdi:account-circle"
                                                : "mdi:account-circle"
                                      }
                                      className="icon text-xl"
                                    />
                                  )}
                                </span>
                                <div>
                                  <h6 className="text-md fw-semibold mb-1">
                                    {
                                      item.fromMember?.personalDetails
                                        ?.firstName
                                    }{" "}
                                    {item.fromMember?.personalDetails?.lastName}
                                  </h6>
                                  <p className="mb-0 text-sm text-secondary-light text-w-200-px">
                                    {item.type === "onetoone" &&
                                      "Sent you an One to One Note"}
                                    {item.type === "referral" &&
                                      "Sent you a Referral Note"}
                                    {item.type === "testimonial" &&
                                      "Sent you a Testimonial Note"}
                                    {item.type === "thankyou" &&
                                      "Sent you a Thank You Note"}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="text-xs text-secondary-light">
                                  {new Date(item.createdAt).toLocaleTimeString(
                                    [],
                                    {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }
                                  )}
                                </span>
                                {!item.isRead && (
                                  <span className="d-block w-6-px h-6-px rounded-full bg-primary ms-auto mt-1"></span>
                                )}
                              </div>
                            </Link>
                          ))
                        ) : (
                          <div className="text-center py-4 text-secondary-light">
                            No notifications
                          </div>
                        )}
                      </div>
                      <div className="text-center py-12 px-16">
                        <Link
                          to="/notifications"
                          className="text-primary-600 fw-semibold text-md"
                        >
                          See All Notifications
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Dropdown */}
                <div className="dropdown profile-dropdown position-relative">
                  <div
                    className="d-flex align-items-center cursor-pointer"
                    onClick={() => setProfileOpen(!profileOpen)}
                  >
                    <img
                      src={
                        userName?.personalDetails?.profileImage?.docPath
                          ? `${IMAGE_BASE_URL}/${userName?.personalDetails?.profileImage?.docPath}/${userName?.personalDetails?.profileImage?.docName}`
                          : "assets/images/avatar/avatar.jpg"
                      }
                      alt="Profile"
                      className="w-40-px mr-10 h-40-px object-fit-cover rounded-circle"
                    />
                    <span className="ms-2">
                      {userName?.personalDetails?.firstName +
                        " " +
                        userName?.personalDetails?.lastName}
                    </span>
                  </div>
                  {profileOpen && (
                    <div className="dropdown-menu show to-top dropdown-menu-sm custom-dropdown-position">
                      <div className="py-12 px-16 radius-8 bg-primary-50 mb-16 d-flex align-items-center justify-content-between gap-2">
                        <div>
                          <h6 className="text-lg text-primary-light fw-semibold mb-2">
                            {userName?.personalDetails?.firstName +
                              " " +
                              userName?.personalDetails?.lastName}
                          </h6>
                          <span className="text-secondary-light fw-medium text-sm">
                            {userName?.contactDetails?.email}
                          </span>
                        </div>
                        <button
                          type="button"
                          className="hover-text-danger"
                          onClick={() => setProfileOpen(false)}
                        >
                          <Icon
                            icon="radix-icons:cross-1"
                            className="icon text-xl"
                          />
                        </button>
                      </div>
                      <ul className="to-top-list">
                        <li onClick={logOutFunct}>
                          <Link
                            className="dropdown-item d-flex align-items-center gap-3 text-danger"
                            to="#"
                          >
                            <Icon
                              icon="lucide:power"
                              className="icon text-xl"
                            />
                            Log Out
                          </Link>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="dashboard-main-body">{children}</div>

        {/* Footer */}
        <footer className="d-footer">
          <div className="row">
            <div className="col-auto">
              <p className="mb-0 text-center">
                © 2025 GRIP. All Rights Reserved.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </section>
  );
};

export default MasterLayout;
