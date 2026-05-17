import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(145deg, #25493f, #19372f)",
          borderRadius: 36,
          border: "3px solid #cf9a61",
        }}
      >
        <div
          style={{
            fontSize: 88,
            color: "#e7c083",
            fontFamily: "Georgia, serif",
            lineHeight: 1,
          }}
        >
          ☾
        </div>
      </div>
    ),
    { ...size },
  );
}
