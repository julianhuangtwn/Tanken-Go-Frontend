"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext"; 
import { useRef } from "react";
import Rating from "./Rating"; 

export default function CommentSection({ tripId }) {
    
    const [comments, setComments] = useState([]);
    const [content, setContent] = useState("");
    const [rating, setRating] = useState(5);
    const [updatedRating, setUpdatedRating] = useState(5);
    const [showLoginModal, setShowLoginModal] = useState(false);

    const [errorMessage, setErrorMessage] = useState(null);

    const { user } = useAuth();  
    const [userHasCommented, setUserHasCommented] = useState(false);
    const [editingComment, setEditingComment] = useState(null);
    const [updatedContent, setUpdatedContent] = useState("");
    const [menuOpen, setMenuOpen] = useState(null); 
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(null); //close the menu if clicked outside
            }
        };
    
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    const displayError = (message) => {
        if (message.includes("ORA-01400")) {
            message = "You should leave both a comment and a rating.";
        }
    
        setErrorMessage(message);
        setTimeout(() => setErrorMessage(null), 3500); //error disappears after 3 seconds
    };
    

    useEffect(() => {
        if (tripId) {
            const token = localStorage.getItem("token");
    
            axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/comments/${tripId}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then((res) => {
                setComments(res.data.sort((a, b) => new Date(b.TIMESTAMP) - new Date(a.TIMESTAMP)));
                if (user) {
                    const hasCommented = res.data.some(c => c.USERID === user.userId);
                    setUserHasCommented(hasCommented);
                }
            })
            .catch((err) => console.error("Error fetching comments:", err));
        }
    }, [tripId, user]);
    
    const overallRating = comments.length > 0
        ? (comments.reduce((sum, c) => sum + c.RATING, 0) / comments.length).toFixed(1)
        : "No ratings yet";

    const handleSubmit = async () => {
        if (userHasCommented) {
            displayError("You can only rate this trip once.");
            return;
        }

        const token = localStorage.getItem("token");
        if (!user) {
            setShowLoginModal(true); 
            return;
        }

        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/v1/comments`,
                { tripId, content, rating },
                { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json"} }
            );

            axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/comments/${tripId}`)
                .then((res) => {
                    setComments(res.data.sort((a, b) => new Date(b.TIMESTAMP) - new Date(a.TIMESTAMP)));
                    setUserHasCommented(true);
                    setContent("");
                })
                .catch((err) => console.error("Error refreshing comments:", err));
        } catch (error) {
            console.error("Error submitting comment:", error);
            displayError(error.response?.data?.error || "Your session expired. Please log in.");
        }
    };

    const handleDelete = async (commentId) => {
        const token = localStorage.getItem("token");
        if (!user) {
            setShowLoginModal(true);
            return;
        }
    
        console.log("Deleting comment ID:", commentId); 
    
        try {
            const response = await axios.delete(
                `${process.env.NEXT_PUBLIC_API_URL}/v1/comments/${commentId}`,
                { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json"} }
            );
    
            if (response.status === 200) {
                setComments(comments.filter((c) => c.COMMENTID !== commentId));
                setUserHasCommented(false);
                setMenuOpen(null);
            } else {
                displayError("Failed to delete comment.");
            }
        } catch (error) {
            console.error("Error deleting comment:", error);
            displayError(error.response?.data?.error || "Failed to delete comment.");
        }
    };
    
    const handleEdit = (comment) => {
        setEditingComment(comment.COMMENTID);
        setUpdatedContent(comment.CONTENT);
        setUpdatedRating(comment.RATING); 
        setMenuOpen(null); //close menu after selecting edit
    };

    const handleUpdate = async () => {
        if (!updatedContent.trim()) {
            displayError("Comment cannot be empty.");
            return;
        }
    
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No token found! User might be logged out.");
            setShowLoginModal(true);
            return;
        }
    
        console.log(`🔹 Sending Update Request - Comment ID: ${editingComment}, Content: ${updatedContent}, Rating: ${updatedRating}`);
        
        try {
            const response = await axios.put(
                `${process.env.NEXT_PUBLIC_API_URL}/v1/comments/${editingComment}`,
                { content: updatedContent, rating: updatedRating },
                { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json"} }
            );
    
            console.log("Update Response:", response);
    
            if (response.status === 200) {
                const updatedComments = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/comments/${tripId}`);
                setComments(updatedComments.data.sort((a, b) => new Date(b.TIMESTAMP) - new Date(a.TIMESTAMP)));
                setEditingComment(null);
            } else {
                displayError("Failed to update comment.");
            }
        } catch (error) {
            console.error("Error updating comment:", error.response ? error.response.data : error.message);
            displayError(error.response?.data?.error || "Failed to update comment.");
        }
    };
    

    return (
        
        <div className="p-6 rounded-lg shadow-lg">

            <div className="flex flex-col md:flex-row w-full bg-white rounded-lg shadow-md overflow-hidden">
            {errorMessage && (
    <div className="fixed top-3 left-1/2 transform -translate-x-1/2 bg-gray-500 text-white p-3 rounded-lg shadow-lg z-50">
        {errorMessage}
    </div>
)}
                <div className="w-full md:w-1/2 p-6 flex flex-col items-center">  
                    <img 
                        src={user?.profilePic || "/user.jpg"} 
                        alt="User Profile" 
                        className="w-16 h-16 rounded-full object-cover mb-3"
                    />
                    <h3 className="text-lg font-semibold">{user?.firstName} {user?.lastName}</h3>

                    <h4 className="mt-2 text-gray-700">Rate this trip</h4>
                    <Rating rating={rating} setRating={setRating} readonly={false} />

                    <input
                        type="text"
                        className="w-full p-2 mt-2 border rounded-lg text-sm"
                        placeholder="Leave your comment here..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        disabled={userHasCommented}
                    />

                    <button
                        type="submit"
                        className="mt-3 px-3 py-2 text-sm text-white rounded-md shadow-md"
                        style={{
                            backgroundColor: userHasCommented ? "#e5e7eb" : "#d22a5e",
                            fontSize: "16px",
                            fontWeight: "bold"
                        }}
                        disabled={userHasCommented}
                        onClick={handleSubmit}
                    >
                        {userHasCommented ? "Thank you for rating" : "Send"}
                    </button>
                </div>

                <div className="w-full md:w-1/2 p-6">
          
    <div className="mb-4 text-center">
        <h4 className="text-lg font-semibold">Overall Rating</h4>
        {comments.length > 0 ? (
            <div className="flex items-center justify-center mt-1">
                <Rating rating={parseFloat(overallRating)} readonly={true} />
                <span className="ml-2 text-gray-600">({overallRating} / 5)</span>
            </div>
        ) : (
            <p className="text-gray-500">No ratings yet.</p>
        )}
    </div>
                    <div className="mt-4 h-48 overflow-y-auto">
                        {comments.length > 0 ? (
                            comments.map((c) => ( 
                            <div key={c.COMMENTID} className="border-b py-3 relative">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-semibold">{c.FIRST_NAME} {c.LAST_NAME}</h4>
                                        <span className="text-gray-500 text-sm">
                                            {c.RATING}/5 ⭐ - {c.TIMESTAMP ? new Date(c.TIMESTAMP).toLocaleString() : "Recently"}
                                        </span>
                                    </div>
                                    <button onClick={() => setMenuOpen(menuOpen === c.COMMENTID ? null : c.COMMENTID)}>
                                        ⋮
                                    </button>
                        {menuOpen === c.COMMENTID && (
                            <div ref={menuRef} className="absolute right-0 w-40 bg-white border rounded shadow-md px-2 py-1 space-y-1">
                                <button className="w-full text-left p-1 hover:bg-gray-100 rounded" 
                                    onClick={() => navigator.clipboard.writeText(window.location.href)}>
                                    Copy Link
                                </button>
                                <button className="w-full text-left p-1 hover:bg-gray-100 rounded"
                                    onClick={() => alert("Reported!")}>
                                    Report Comment
                                </button>

                                {user && c.USERID && user.userId && String(c.USERID) === String(user.userId) && (
                                    <>
                                        <button className="w-full text-left p-1 hover:bg-gray-100 rounded"
                                            onClick={() => handleEdit(c)}>
                                            Edit
                                        </button>
                                        <button className="w-full text-left p-1 hover:bg-red-100 text-red-600 rounded"
                                            onClick={() => handleDelete(c.COMMENTID)}>
                                            Delete
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                        </div>
                        {editingComment === c.COMMENTID ? (
                            <div className="flex flex-col space-y-2">
                                <div className="flex items-center">
                                    <span className="text-gray-700 mr-2">Update Rating:</span>
                                    <Rating rating={updatedRating || 5} setRating={setUpdatedRating} readonly={false} />
                                </div>

                                <div className="flex items-center space-x-2">
                                    <input 
                                        value={updatedContent} 
                                        onChange={(e) => setUpdatedContent(e.target.value)} 
                                        className="flex-grow p-2 border rounded-lg text-sm"
                                    />
                                    <button 
                                        onClick={handleUpdate} 
                                        className="px-3 py-2 text-white rounded-md shadow-md"
                                        style={{
                                            backgroundColor: "#d22a5e", 
                                            fontSize: "16px",
                                            fontWeight: "bold"
                                        }}
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                            ) : (
                                <div>
                                    <p className="text-gray-700">{c.CONTENT}</p>
                                
                                </div>
                            )}                                            
                                </div>
                            ))
                        ) : <p>No comments yet.</p>}
                        {showLoginModal && (
                            <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                                <div className="bg-white p-6 rounded-lg shadow-lg text-center w-96">
                                    <button
                                        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
                                        onClick={() => setShowLoginModal(false)} 
                                    >
                                        ✖
                                    </button>
                                    <div className="mb-4 text-red-500 text-4xl">🚫</div>
                                    <p className="text-lg text-gray-700 mb-4">
                                        Please <strong>Login or Register</strong> to leave a comment. We’d love to see your review!
                                    </p>
                                    <button
                                        className="px-4 py-1.5 text-white rounded-lg hover:opacity-90"
                                        style={{
                                            backgroundColor: "#d22a5e", 
                                            fontSize: "0.875rem",
                                            fontWeight: "bold"
                                        }}
                                        onClick={() => {
                                            setShowLoginModal(false);
                                            window.location.href = "/login"; 
                                        }}
                                    >
                                        Go to Login
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
