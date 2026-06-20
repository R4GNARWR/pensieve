import sharp from "sharp";
export default async function compressImage(imageBuffer, width, height) {
    const compressedImage = await sharp(imageBuffer)
        .resize(width, height, {
        fit: "cover",
        kernel: "lanczos3"
    })
        .toBuffer();
    return compressedImage;
}
