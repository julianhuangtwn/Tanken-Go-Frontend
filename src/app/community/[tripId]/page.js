"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import CommentSection from "@/components/CommentSection";

export default function CommunityPage() {
    const { tripId } = useParams();

    if (!tripId) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <div className="flex flex-col items-center text-center">
            <h4 className="text-3xl font-bold mb-4">Comments</h4>
            </div>
            <CommentSection tripId={tripId} />
        </div>
    );
}

