import { useState, useRef } from "react";
import { taskAPI } from "../../services/api";

// ── File icon based on type ────────────────────────────────────────────────────

const getFileIcon = (fileType = "") => {
  if (fileType.startsWith("image/")) {
    return (
      <svg
        className="w-5 h-5 text-indigo-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
        />
      </svg>
    );
  }
  if (fileType === "application/pdf") {
    return (
      <svg
        className="w-5 h-5 text-red-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
        />
      </svg>
    );
  }
  if (fileType.includes("word") || fileType.includes("document")) {
    return (
      <svg
        className="w-5 h-5 text-blue-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
        />
      </svg>
    );
  }
  // Default file icon
  return (
    <svg
      className="w-5 h-5 text-slate-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13"
      />
    </svg>
  );
};

// ── Format file size ───────────────────────────────────────────────────────────

const formatFileSize = (bytes = 0) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

// ── Single attachment item ─────────────────────────────────────────────────────

const AttachmentItem = ({ attachment, onDelete, canDelete }) => {
  const [deleting, setDeleting] = useState(false);
  const isImage = attachment.file_type?.startsWith("image/");

  const handleDelete = async () => {
    setDeleting(true);
    await onDelete(attachment.id);
    setDeleting(false);
  };

  return (
    <div className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition group">
      {/* Thumbnail or icon */}
      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
        {isImage ? (
          <img
            src={attachment.file_url}
            alt={attachment.file_name}
            className="w-full h-full object-cover"
          />
        ) : (
          getFileIcon(attachment.file_type)
        )}
      </div>

      {/* File info */}
      <div className="flex-1 min-w-0">
        <a
          href={attachment.file_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium text-slate-700 hover:text-indigo-600 truncate block transition"
        >
          {attachment.file_name}
        </a>
        <p className="text-[11px] text-slate-400 mt-0.5">
          {formatFileSize(attachment.file_size)}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {/* Download */}
        <a
          href={attachment.file_url}
          target="_blank"
          rel="noopener noreferrer"
          download={attachment.file_name}
          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
          title="Download"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
            />
          </svg>
        </a>

        {/* Delete — hanya jika canDelete */}
        {canDelete && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition disabled:opacity-60"
            title="Delete attachment"
          >
            {deleting ? (
              <svg
                className="animate-spin w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
            ) : (
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

// ── Upload zone ────────────────────────────────────────────────────────────────

const UploadZone = ({ onUpload, uploading }) => {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleFiles = (files) => {
    if (files.length === 0) return;
    onUpload(files[0]); // Upload satu file per satu
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => !uploading && inputRef.current?.click()}
      className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all
        ${dragging ? "border-indigo-400 bg-indigo-50" : "border-slate-200 hover:border-indigo-300 hover:bg-slate-50"}
        ${uploading ? "opacity-60 cursor-not-allowed" : ""}`}
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
        disabled={uploading}
      />

      {uploading ? (
        <div className="flex items-center justify-center gap-2 text-indigo-500">
          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            />
          </svg>
          <span className="text-xs font-medium">Uploading...</span>
        </div>
      ) : (
        <>
          <svg
            className="w-6 h-6 text-slate-400 mx-auto mb-1.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
          <p className="text-xs text-slate-500 font-medium">
            Drop file here or <span className="text-indigo-600">browse</span>
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Max 10MB</p>
        </>
      )}
    </div>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────────

const TaskAttachments = ({ task, onTaskUpdate, canEdit }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const attachments = task?.attachment || [];

  const handleUpload = async (file) => {
    // Validate file size — max 10MB
    if (file.size > 10 * 1024 * 1024) {
      setError("File size exceeds 10MB limit");
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const updated = await taskAPI.uploadAttachment(task.id, file);
      onTaskUpdate?.(updated);
    } catch (err) {
      setError(err?.message || "Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (attachmentId) => {
    setError(null);
    try {
      const updated = await taskAPI.deleteAttachment(task.id, attachmentId);
      onTaskUpdate?.(updated);
    } catch (err) {
      setError(err?.message || "Failed to delete attachment");
    }
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2">
        <svg
          className="w-4 h-4 text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13"
          />
        </svg>
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
          Attachments {attachments.length > 0 && `(${attachments.length})`}
        </span>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-100 rounded-lg">
          <svg
            className="w-3.5 h-3.5 text-red-500 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>
          <p className="text-xs text-red-600">{error}</p>
        </div>
      )}

      {/* Attachment list */}
      {attachments.length > 0 && (
        <div className="space-y-2">
          {attachments.map((att) => (
            <AttachmentItem
              key={att.id}
              attachment={att}
              onDelete={handleDelete}
              canDelete={canEdit}
            />
          ))}
        </div>
      )}

      {/* Upload zone — hanya jika canEdit */}
      {canEdit && <UploadZone onUpload={handleUpload} uploading={uploading} />}

      {/* Empty state jika tidak ada attachment dan tidak bisa edit */}
      {!canEdit && attachments.length === 0 && (
        <p className="text-xs text-slate-400 text-center py-3">
          No attachments
        </p>
      )}
    </div>
  );
};

export default TaskAttachments;
