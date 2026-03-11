// Shared input class — dark mode otomatis via CSS variables
export const inputClass =
  "w-full px-3 py-[0.6rem] rounded-lg text-[0.9rem] border transition-all duration-200 input-base focus:outline-none focus:border-indigo-400 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)] disabled:opacity-60 disabled:cursor-default";

// Input class untuk auth pages (SignIn/SignUp) — padding lebih besar
export const inputClassAuth =
  "w-full px-4 py-3 rounded-lg text-sm border transition-all input-base focus:outline-none focus:border-indigo-400 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)] disabled:opacity-60";

// Button variants
export const btnPrimary =
  "px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition disabled:opacity-60 flex items-center gap-2";

export const btnSecondary =
  "px-5 py-2 bg-card text-app border border-app rounded-lg text-sm font-medium cursor-pointer transition-all hover:bg-subtle disabled:opacity-60 disabled:cursor-not-allowed";

export const btnDanger =
  "px-4 py-2 text-red-500 border border-red-200 rounded-lg text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition disabled:opacity-60 flex items-center gap-2";
