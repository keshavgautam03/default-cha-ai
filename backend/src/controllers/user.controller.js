import User from "../models/user.model.js";

export const saveRelationship = async (req, res) => {
  try {
    const { userId } = req.params;
    const { relationship, profession } = req.body;
    const currentUserId = req.user._id;

    // Find the current user
    const currentUser = await User.findById(currentUserId);
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if relationship already exists
    const existingRelationshipIndex = currentUser.relationships.findIndex(
      (rel) => rel.userId.toString() === userId
    );

    if (existingRelationshipIndex !== -1) {
      // Update existing relationship
      currentUser.relationships[existingRelationshipIndex] = {
        userId,
        relationship,
        profession: relationship === "professional" ? profession : "",
      };
    } else {
      // Add new relationship
      currentUser.relationships.push({
        userId,
        relationship,
        profession: relationship === "professional" ? profession : "",
      });
    }

    await currentUser.save();

    res.status(200).json({ message: "Relationship saved successfully" });
  } catch (error) {
    console.error("Error in saveRelationship:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}; 