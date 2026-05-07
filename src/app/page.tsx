import dynamic from "next/dynamic";

// Heavy interactive UI is client-only and split out of the main bundle.
const Shell = dynamic(() => import("@/components/Shell"), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen w-screen items-center justify-center bg-black text-sm text-[#7fd3ff]">
      <span className="font-mono">booting…</span>
    </div>
  ),
});

export default function Page() {
  return <Shell />;
}
