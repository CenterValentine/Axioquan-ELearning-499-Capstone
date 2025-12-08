interface AxioQuanLogoProps {
  size?: "default" | "small";
}

export function AxioQuanLogo({ size = "default" }: AxioQuanLogoProps) {
  return (
    <div
      className={`flex items-center gap-3 ${
        size === "small" ? "px-2" : "px-4"
      }`}
    >
      <div className="flex items-center justify-center bg-black rounded-lg p-3 w-8 h-8">
        <span className="text-white font-bold text-xl">A</span>
      </div>
      {size === "default" && (
        <span className="font-bold text-xl text-foreground">AxioQuan</span>
      )}
    </div>
  );
}

