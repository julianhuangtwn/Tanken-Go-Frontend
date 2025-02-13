"use client";
import { useState } from "react";

export default function Rating({ rating, setRating, readonly = false }) {
    const [hoveredStar, setHoveredStar] = useState(null);

    return (
        <div style={{ display: "flex", gap: "5px" }}>
            {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = star <= (hoveredStar || rating);
                const fullStars = Math.floor(rating);
                const hasHalfStar = readonly && rating % 1 !== 0 && star === fullStars + 1;

                return (
                    <span
                        key={star}
                        style={{
                            cursor: readonly ? "default" : "pointer",
                            fontSize: "24px",
                            position: "relative",
                            display: "inline-block",
                        }}
                        onClick={!readonly && setRating ? () => setRating(star) : null}
                        onMouseEnter={!readonly && setRating ? () => setHoveredStar(star) : null}
                        onMouseLeave={!readonly && setRating ? () => setHoveredStar(null) : null}
                    >
                        {readonly && hasHalfStar ? (
                            <>
                                <span style={{ position: "absolute", overflow: "hidden", width: "50%" }}>⭐</span>
                                <span style={{ opacity: 0.3 }}>⭐</span>
                            </>
                        ) : (
                            <span style={{ opacity: isFilled ? 1 : 0.3 }}>⭐</span>
                        )}
                    </span>
                );
            })}
        </div>
    );
}
