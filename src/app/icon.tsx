import { ImageResponse } from "next/og";

// アイコンのサイズ定義
export const size = {
  width: 512,
  height: 512,
};
export const contentType = "image/png";

// アイコン生成関数
export default function Icon() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 320,
          background: "black",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontFamily: "sans-serif",
          fontWeight: 900,
          letterSpacing: "-0.05em",
        }}
      >
        B.
      </div>
    ),
    // ImageResponse options
    {
      ...size,
    }
  );
}
