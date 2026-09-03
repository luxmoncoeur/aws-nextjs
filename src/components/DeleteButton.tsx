"use client";

export default function DeleteButton() {
  return (
    <button
      type="submit"
      className="shrink-0 rounded-md px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
      onClick={(event) => {
        if (!window.confirm("Delete this file?")) event.preventDefault();
      }}
    >
      Delete
    </button>
  );
}
