import { useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const IMAGE_BASE_URL = "https://api.gripforum.com/api/public/";

const getImage = (img) => {
  if (!img) return null;
  if (typeof img === "object" && img.url) return img.url;
  if (typeof img === "string")
    return img.startsWith("http") ? img : IMAGE_BASE_URL + img;
  return null;
};

const AchieverCard = ({ data, title }) => {
  const fallbackImg = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
  const hasData = data && (data.name || data.categoryRepresented || data.profileImage);

  return (
    <div className="flex-item-center">
      <div
        style={{
          background: "#E64848",
          background: "linear-gradient(135deg, rgb(192, 34, 33), rgb(69, 68, 66))",
          borderRadius: "18px",
          padding: "20px",
          color: "white",
          minHeight: "220px",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "18px",
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "nowrap",
          }}
        >
          {/* LEFT IMAGE */}
          <div
            style={{
              width: "100px",
              height: "130px",
              borderRadius: "12px",
              overflow: "hidden",
              background: "#fff",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={
                        getImage(data?.profileImage) ||
        "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
              // onError={(e) => (e.target.src = fallbackImg)}
                    onError={(e) => {
        e.target.onerror = null;
        e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
      }}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              alt="profile"
            />
          </div>

          {/* RIGHT SIDE CONTENT */}
          <div
            style={{
              flex: 1,
              textAlign: "center",
            }}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/17919/17919649.png"
              style={{
                width: "42px",
                margin: "0 auto 4px",
                display: "block",
              }}
            />

            <h6 style={{ marginBottom: "12px", fontSize: "12px" }}>
              {title}
            </h6>

            {/* VALUE BOX */}
            {hasData ? (
              <div
                style={{
                  background: "#fff",
                  padding: "10px 15px",
                  borderRadius: "12px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "12px",
                  maxWidth: "100%",
                  flexWrap: "nowrap",
                }}
              >
                <strong
                  style={{
                    fontSize: "14px",
                    color: "black",
                    whiteSpace: "nowrap",
                  }}
                >
                  {data?.name}
                </strong>

                <span
                  style={{
                    background: "#EEE",
                    padding: "4px 10px",
                    borderRadius: "6px",
                    fontSize: "10px",
                    whiteSpace: "nowrap",
                    color: "black",
                  }}
                >
                  {data?.categoryRepresented}
                </span>
              </div>
            ) : (
              // ⭐ EMPTY STATE FIX – NO FONT SIZE CHANGED
              <div
                style={{
                  background: "#ffffff44",
                  padding: "10px 15px",
                  borderRadius: "12px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  maxWidth: "100%",
                }}
              >
                <strong
                  style={{
                    fontSize: "15px", // unchanged
                    color: "white",
                    opacity: 0.9,
                    whiteSpace: "nowrap",
                  }}
                >
                  Not Announced Yet
                </strong>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


export default function AchieverCarousel({ topAchivers }) {
  const carouselRef = useRef(null);

  useEffect(() => {
    let intervalCheck;

    const initCarousel = () => {
      if (!carouselRef.current) return;

      // 🔥 Bootstrap not ready yet → wait
      if (!window.bootstrap) return;

      // Avoid double init
      if (carouselRef.current._carouselInstance) return;

      carouselRef.current._carouselInstance = new window.bootstrap.Carousel(
        carouselRef.current,
        {
          interval: 3000,
          ride: "carousel",
          pause: false,
          touch: true,
          wrap: true,
        }
      );

      clearInterval(intervalCheck); // ✔ Stop checking once ready
    };

    // Keep checking every 100ms until Bootstrap is ready
    intervalCheck = setInterval(initCarousel, 100);

    return () => clearInterval(intervalCheck);
  }, []);

  if (!topAchivers?.topAchievers) return null;

  const { business, referrals, visitors } = topAchivers.topAchievers;
  console.log("topAchivers.topAchievers",    topAchivers.topAchievers)

  return (
    <div style={{ width: "100%", marginBottom: "" }}>
      <div id="achieverCarousel" className="carousel slide" ref={carouselRef}>
        <div className="carousel-inner">
          <div className="carousel-item active">
            <AchieverCard
              title="Maximum Business Contributed"
              data={business}
            />
          </div>

          <div className="carousel-item">
            <AchieverCard
              title="Maximum Referrals Contributed"
              data={referrals}
            />
          </div>

          <div className="carousel-item">
            <AchieverCard title="Maximum Visitors Invited" data={visitors} />
          </div>
        </div>

        <div className="carousel-indicators" style={{ bottom: "-10px" }}>
          <button
            type="button"
            data-bs-target="#achieverCarousel"
            data-bs-slide-to="0"
            className="active"
          />
          <button
            type="button"
            data-bs-target="#achieverCarousel"
            data-bs-slide-to="1"
          />
          <button
            type="button"
            data-bs-target="#achieverCarousel"
            data-bs-slide-to="2"
          />
        </div>
      </div>
    </div>
  );
}
