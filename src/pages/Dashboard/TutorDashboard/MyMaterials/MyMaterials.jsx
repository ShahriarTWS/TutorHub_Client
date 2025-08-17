// src/pages/Dashboard/Tutor/MyMaterials.jsx
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useAuth from "../../../../hooks/useAuth";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";

const MyMaterials = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const [groupedMaterials, setGroupedMaterials] = useState({});
    const [sessionsMap, setSessionsMap] = useState({});
    const [loading, setLoading] = useState(true);
    const [expandedDescriptions, setExpandedDescriptions] = useState({});

    useEffect(() => {
        const fetchMaterialsAndSessions = async () => {
            try {
                setLoading(true);

                const materialsRes = await axiosSecure.get(
                    `/materials/tutor/${user.email}`
                );
                const materials = materialsRes.data;

                const grouped = {};
                for (const mat of materials) {
                    const id = mat.sessionId;
                    if (!grouped[id]) grouped[id] = [];
                    grouped[id].push(mat);
                }
                setGroupedMaterials(grouped);

                const sessionIds = [...new Set(materials.map((m) => m.sessionId))];
                if (sessionIds.length > 0) {
                    const sessionsData = await Promise.all(
                        sessionIds.map((id) =>
                            axiosSecure
                                .get(`/sessions/${id}`)
                                .then((res) => res.data)
                                .catch(() => null)
                        )
                    );
                    const map = {};
                    sessionsData.forEach((session) => {
                        if (session?._id)
                            map[session._id] = session.title || "Untitled Session";
                    });
                    setSessionsMap(map);
                }
            } catch (err) {
                console.error("Failed to load materials or sessions:", err);
            } finally {
                setLoading(false);
            }
        };

        if (user?.email) fetchMaterialsAndSessions();
    }, [user?.email, axiosSecure]);

    // Delete material handler
    const handleDelete = async (id, sessionId) => {
        const confirm = await Swal.fire({
            title: "Are you sure?",
            text: "This resource will be permanently deleted.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
        });

        if (confirm.isConfirmed) {
            try {
                await axiosSecure.delete(`/materials/${id}`);
                setGroupedMaterials((prev) => {
                    const updated = { ...prev };
                    updated[sessionId] = updated[sessionId].filter(
                        (mat) => mat._id !== id
                    );
                    if (updated[sessionId].length === 0) delete updated[sessionId];
                    return updated;
                });
                Swal.fire("Deleted!", "Material deleted.", "success");
            } catch (err) {
                Swal.fire("Error!", "Failed to delete.", "error");
            }
        }
    };

    // Big Edit modal
    const handleEdit = async (material) => {
        const { value: formValues } = await Swal.fire({
            title: "Edit Material",
            html: `
        <div style="display: grid; grid-template-columns: 1fr; gap: 1rem; text-align:left">
          <label><strong>Title</strong></label>
          <input id="swal-title" class="swal2-input" placeholder="Title" value="${material.title || ""
                }">

          <label><strong>Description</strong></label>
          <textarea id="swal-desc" class="swal2-textarea" rows="5" placeholder="Description">${material.description || ""
                }</textarea>

          <label><strong>Resource Link</strong></label>
          <input id="swal-link" class="swal2-input" placeholder="Resource Link" value="${material.resourceLink || ""
                }">
        </div>
      `,
            focusConfirm: false,
            preConfirm: () => {
                return {
                    title: document.getElementById("swal-title").value.trim(),
                    description: document.getElementById("swal-desc").value.trim(),
                    resourceLink: document.getElementById("swal-link").value.trim(),
                };
            },
            width: "700px", // ⬅️ Bigger modal
            padding: "2rem",
            confirmButtonText: "Save",
            showCancelButton: true,
            customClass: {
                popup: "rounded-2xl shadow-2xl",
                confirmButton: "bg-blue-600 text-white px-6 py-2 rounded-lg",
                cancelButton: "bg-gray-300 text-black px-6 py-2 rounded-lg",
            },
        });

        if (formValues) {
            try {
                await axiosSecure.patch(`/materials/${material._id}`, formValues);
                setGroupedMaterials((prev) => {
                    const updated = { ...prev };
                    updated[material.sessionId] = updated[material.sessionId].map((mat) =>
                        mat._id === material._id ? { ...mat, ...formValues } : mat
                    );
                    return updated;
                });
                Swal.fire("Updated!", "Material updated.", "success");
            } catch (err) {
                Swal.fire("Error!", "Failed to update material.", "error");
            }
        }
    };

    const toggleDescription = (id) => {
        setExpandedDescriptions((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    return (
        <section className="w-11/12 mx-auto py-16">
            <h1 className="text-3xl font-bold mb-10 text-center text-primary">
                My Uploaded Materials
            </h1>

            {loading ? (
                <div className="flex justify-center items-center space-x-2">
                    <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-primary border-t-transparent"></div>
                    <span className="text-lg font-semibold text-gray-600">
                        Loading materials...
                    </span>
                </div>
            ) : Object.keys(groupedMaterials).length === 0 ? (
                <p className="text-center text-gray-500 text-lg">
                    No materials uploaded yet.
                </p>
            ) : (
                <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
                    {Object.entries(groupedMaterials).map(([sessionId, resources]) => (
                        <div
                            key={sessionId}
                            className="border border-gray-200/20 p-6 rounded-xl shadow-lg bg-base-200 hover:shadow-xl transition"
                        >
                            <h3 className="text-2xl font-semibold text-secondary mb-4">
                                {sessionsMap[sessionId] || "Session Title Not Found"}
                            </h3>
                            <div className="space-y-4">
                                {resources.map((mat) => {
                                    const isExpanded = expandedDescriptions[mat._id] || false;
                                    const shortDesc =
                                        mat.description?.length > 120
                                            ? mat.description.slice(0, 120) + "..."
                                            : mat.description;

                                    return (
                                        <div
                                            key={mat._id}
                                            className="border border-gray-200/20 rounded-lg p-4 bg-base-100 shadow-sm hover:shadow-md transition"
                                        >
                                            <p className="font-bold text-lg ">
                                                {mat.title}
                                            </p>

                                            <p className=" mb-2 text-sm leading-relaxed">
                                                {isExpanded ? mat.description : shortDesc}
                                            </p>
                                            {mat.description?.length > 120 && (
                                                <button
                                                    onClick={() => toggleDescription(mat._id)}
                                                    className="text-primary text-sm font-medium hover:underline focus:outline-none mb-2"
                                                >
                                                    {isExpanded ? "See Less" : "See More"}
                                                </button>
                                            )}

                                            {mat.resourceLink && (
                                                <p className="text-blue-600 underline break-all mb-1 text-sm">
                                                    <strong>Link: </strong>
                                                    <a
                                                        href={mat.resourceLink}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                    >
                                                        {mat.resourceLink}
                                                    </a>
                                                </p>
                                            )}
                                            {mat.fileURL && (
                                                <p className="text-blue-600 underline text-sm">
                                                    <strong>File: </strong>
                                                    <a
                                                        href={mat.fileURL}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        download
                                                    >
                                                        Download
                                                    </a>
                                                </p>
                                            )}

                                            <div className="mt-3 flex space-x-3">
                                                <button
                                                    onClick={() => handleEdit(mat)}
                                                    className="btn  btn-warning "
                                                    title="Edit Material"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(mat._id, mat.sessionId)
                                                    }
                                                    className="btn btn-error "
                                                    title="Delete Material"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default MyMaterials;
