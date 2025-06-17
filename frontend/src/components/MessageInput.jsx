import { useRef, useState, useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import MessageSuggestion from "./MessageSuggestion";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [suggestion, setSuggestion] = useState(null);
  const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(false);
  const fileInputRef = useRef(null);
  const { sendMessage, selectedUser, messages } = useChatStore();
  const debounceTimerRef = useRef(null);

  // Get suggestion when new message is received
  useEffect(() => {
    const getSuggestion = async () => {
      if (!messages.length) return;
      
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.senderId === selectedUser._id) {
        await fetchSuggestion(lastMessage.text);
      }
    };

    getSuggestion();
  }, [messages, selectedUser]);

  // Generate suggestion as user types
  useEffect(() => {
    if (text.trim().length > 0) {
      // Clear previous timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Set new timer
      debounceTimerRef.current = setTimeout(() => {
        fetchSuggestion(text);
      }, 1000); // Wait for 1 second after user stops typing
    } else {
      setSuggestion(null);
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [text]);

  const fetchSuggestion = async (messageText) => {
    if (!messageText || !selectedUser) return;
    
    setIsLoadingSuggestion(true);
    try {
      const res = await axiosInstance.post(`/messages/suggest/${selectedUser._id}`, {
        message: messageText
      });
      setSuggestion(res.data.suggestion);
    } catch (error) {
      console.error("Failed to get suggestion:", error);
      const errorMessage = error.response?.data?.error || error.response?.data?.details || "Failed to get suggestion. Please try again.";
      toast.error(errorMessage);
      setSuggestion(null);
    } finally {
      setIsLoadingSuggestion(false);
    }
  };

  const handleGetSuggestion = async () => {
    if (!text.trim()) {
      toast.error("Please type a message first");
      return;
    }
    await fetchSuggestion(text);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });

      // Clear form and suggestion
      setText("");
      setImagePreview(null);
      setSuggestion(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleUseSuggestion = (suggestedText) => {
    setText(suggestedText);
    setSuggestion(null);
  };

  return (
    <div className="p-4 w-full">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      {suggestion && (
        <MessageSuggestion
          suggestion={suggestion}
          onUseSuggestion={handleUseSuggestion}
        />
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={`hidden sm:flex btn btn-circle
                     ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>

          <button
            type="button"
            className={`btn btn-circle ${isLoadingSuggestion ? "loading" : ""}`}
            onClick={handleGetSuggestion}
            disabled={!text.trim() || isLoadingSuggestion}
          >
            <Sparkles size={20} />
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
