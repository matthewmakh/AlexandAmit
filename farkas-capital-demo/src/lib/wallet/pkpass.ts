import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import JSZip from "jszip";
import forge from "node-forge";
import type { PassJson } from "./pass-json";

export interface SigningMaterial {
  /** Pass Type ID certificate, PEM. */
  certPem: string;
  /** Private key for the certificate, PEM. */
  keyPem: string;
  /** Apple WWDR intermediate certificate, PEM. */
  wwdrPem: string;
  keyPassphrase?: string;
}

/** Reads certificates from the environment. Returns null when not configured. */
export function signingMaterialFromEnv(): SigningMaterial | null {
  const certPem = process.env.APPLE_PASS_CERT_PEM;
  const keyPem = process.env.APPLE_PASS_KEY_PEM;
  const wwdrPem = process.env.APPLE_WWDR_CERT_PEM;
  if (!certPem || !keyPem || !wwdrPem) return null;
  return {
    certPem: certPem.replace(/\\n/g, "\n"),
    keyPem: keyPem.replace(/\\n/g, "\n"),
    wwdrPem: wwdrPem.replace(/\\n/g, "\n"),
    keyPassphrase: process.env.APPLE_PASS_KEY_PASSPHRASE,
  };
}

/**
 * PKCS#7 detached signature over manifest.json, the way Apple requires:
 * signed with the Pass Type ID certificate, with the WWDR intermediate
 * included in the certificate chain.
 */
export function signManifest(manifestJson: string, material: SigningMaterial): Buffer {
  const cert = forge.pki.certificateFromPem(material.certPem);
  const wwdr = forge.pki.certificateFromPem(material.wwdrPem);
  const key = material.keyPassphrase
    ? forge.pki.decryptRsaPrivateKey(material.keyPem, material.keyPassphrase)
    : forge.pki.privateKeyFromPem(material.keyPem);
  if (!key) throw new Error("Could not read the pass signing key");

  const p7 = forge.pkcs7.createSignedData();
  p7.content = forge.util.createBuffer(manifestJson, "utf8");
  p7.addCertificate(wwdr);
  p7.addCertificate(cert);
  p7.addSigner({
    key,
    certificate: cert,
    digestAlgorithm: forge.pki.oids.sha256,
    authenticatedAttributes: [
      { type: forge.pki.oids.contentType, value: forge.pki.oids.data },
      { type: forge.pki.oids.messageDigest },
      { type: forge.pki.oids.signingTime, value: new Date().toISOString() },
    ],
  });
  p7.sign({ detached: true });
  const der = forge.asn1.toDer(p7.toAsn1()).getBytes();
  return Buffer.from(der, "binary");
}

const ASSET_FILES = ["icon.png", "icon@2x.png", "icon@3x.png", "logo.png", "logo@2x.png", "logo@3x.png"];

/**
 * Assembles the .pkpass bundle: pass.json, image assets, manifest.json with
 * SHA-1 hashes, and the signature when certificates are configured.
 */
export async function buildPkpass(passJson: PassJson, issuerSlug: string): Promise<{ bytes: Buffer; signed: boolean }> {
  const zip = new JSZip();
  const files: Record<string, Buffer> = {};
  files["pass.json"] = Buffer.from(JSON.stringify(passJson, null, 2), "utf8");

  const assetDir = path.join(process.cwd(), "public", "pass-assets", issuerSlug);
  for (const name of ASSET_FILES) {
    files[name] = await readFile(path.join(assetDir, name));
  }

  const manifest: Record<string, string> = {};
  for (const [name, buf] of Object.entries(files)) {
    manifest[name] = createHash("sha1").update(buf).digest("hex");
    zip.file(name, buf);
  }
  const manifestJson = JSON.stringify(manifest, null, 2);
  zip.file("manifest.json", manifestJson);

  const material = signingMaterialFromEnv();
  let signed = false;
  if (material) {
    zip.file("signature", signManifest(manifestJson, material));
    signed = true;
  } else {
    zip.file(
      "UNSIGNED-README.txt",
      [
        "This bundle has every part of a valid .pkpass except the signature.",
        "",
        "To produce an installable pass, set these environment variables on the server:",
        "  APPLE_PASS_TYPE_ID        e.g. pass.com.farkascapital.investment",
        "  APPLE_TEAM_ID             your 10-character Apple Developer team id",
        "  APPLE_PASS_CERT_PEM       the Pass Type ID certificate (PEM)",
        "  APPLE_PASS_KEY_PEM        its private key (PEM)",
        "  APPLE_WWDR_CERT_PEM       Apple Worldwide Developer Relations intermediate (PEM)",
        "",
        "The server then signs manifest.json with a detached PKCS#7 signature and",
        "writes it to `signature`, and iOS accepts the pass.",
      ].join("\n"),
    );
  }

  const bytes = await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });
  return { bytes, signed };
}
