import { Sparkles, X } from "lucide-react";

const MessageSuggestion = ({ suggestion, onUseSuggestion }) => {
  return (
    <div className="mb-3 p-3 bg-base-200 rounded-lg border border-zinc-700">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="size-4 text-emerald-500" />
        <span className="text-sm font-medium">AI Suggestion</span>
      </div>
      <p className="text-sm text-zinc-300 mb-2">{suggestion}</p>
      <div className="flex justify-end gap-2">
        <button
          onClick={() => onUseSuggestion(suggestion)}
          className="btn btn-sm btn-primary"
        >
          Use Suggestion
        </button>
        <button
          onClick={() => onUseSuggestion(null)}
          className="btn btn-sm btn-ghost"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
};

export default MessageSuggestion; 