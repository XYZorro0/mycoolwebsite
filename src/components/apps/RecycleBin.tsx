"use client";

const ITEMS = [
  { name: "old_portfolio_v1.html", date: "2009-08-12", size: "12 KB" },
  { name: "marquee_animation.gif", date: "2007-04-03", size: "47 KB" },
  { name: "guestbook.php", date: "2006-11-22", size: "3 KB" },
  { name: "TODO_for_2010.txt", date: "2009-12-31", size: "1 KB" },
];

export default function RecycleBin() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-[#a8c4e8] bg-gradient-to-b from-[#eef5ff] to-[#cfe0f5] px-3 py-1 text-[12px] text-[#0a1f3a]">
        <span>🗑 Recycle Bin</span>
        <span className="ml-auto text-[#3a4d6c]">{ITEMS.length} items</span>
      </div>
      <div className="flex-1 overflow-auto p-2">
        <table className="w-full border-collapse text-[12px]">
          <thead className="bg-[#eef5ff]">
            <tr className="text-left text-[#3a4d6c]">
              <th className="border-b border-[#a8c4e8] px-2 py-1 font-medium">Name</th>
              <th className="border-b border-[#a8c4e8] px-2 py-1 font-medium">Deleted</th>
              <th className="border-b border-[#a8c4e8] px-2 py-1 font-medium text-right">Size</th>
            </tr>
          </thead>
          <tbody>
            {ITEMS.map((it) => (
              <tr key={it.name} className="hover:bg-[#dde9f7]">
                <td className="border-b border-[#e6eef7] px-2 py-1 text-[#0a1f3a]">{it.name}</td>
                <td className="border-b border-[#e6eef7] px-2 py-1 text-[#3a4d6c]">{it.date}</td>
                <td className="border-b border-[#e6eef7] px-2 py-1 text-right text-[#3a4d6c]">
                  {it.size}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-3 px-2 text-[11px] text-[#3a4d6c]">
          (These will not actually delete. They're a souvenir of the old web.)
        </p>
      </div>
    </div>
  );
}
