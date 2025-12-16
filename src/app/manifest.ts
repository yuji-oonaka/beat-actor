import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Beat Actor",
    short_name: "Beat Actor",
    description: "Rhythm training application. Click notation is dead.",
    start_url: "/",
    display: "standalone", // ブラウザの枠を消す
    background_color: "#000000",
    theme_color: "#000000",
    icons: [
      {
        src: "/icon",
        sizes: "any",
        type: "image/png",
      },
    ],
  };
}