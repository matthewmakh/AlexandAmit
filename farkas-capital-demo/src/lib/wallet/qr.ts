import QRCode from "qrcode";

/** QR as an SVG string (no XML prolog), for the on-screen pass. */
export async function qrSvg(message: string): Promise<string> {
  const svg = await QRCode.toString(message, { type: "svg", margin: 0, errorCorrectionLevel: "M", color: { dark: "#000000", light: "#ffffff" } });
  return svg.replace(/^<\?xml[^>]*>\s*/, "");
}
