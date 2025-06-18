import { useState } from "react";
import { X } from "lucide-react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const RelationshipPopup = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    relationship: "professional",
    profession: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post(`/users/relationship/${user._id}`, formData);
      toast.success("Relationship information saved!");
      onSave();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save relationship");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-base-100 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Set Relationship with {user.fullName}</h2>
          <button onClick={onClose} className="btn btn-ghost btn-sm">
            <X />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Relationship Type</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={formData.relationship}
              onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
              required
            >
              <option value="professional">Professional</option>
              <option value="friend">Friend</option>
              <option value="family">Family</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Profession (if professional)</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="e.g., Software Engineer, Doctor, etc."
              value={formData.profession}
              onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-2">
            <button type="button" className="btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RelationshipPopup; 