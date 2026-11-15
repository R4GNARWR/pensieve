// TODO: переделать планировщик с setInterval на отдельный cron-процесс.
// Сейчас очистка крутится внутри процесса: при scale > 1 таймер запускается в
// каждом инстансе и гонки не синхронизируются между ними, а интервал считается
// от момента старта, а не от календарного времени. Логика уже вынесена в
// cleanupUnreferencedPhotos, поэтому достаточно вызвать её из cron/шедулера.
import fs from "fs";
import path from "path";
import Memory from "../models/memory.js";
import {
  ORPHANED_PHOTO_MIN_AGE_MS,
  PHOTO_CLEANUP_INTERVAL_MS,
  UPLOADS_DIRECTORY,
} from "../constants/photos.js";

const PHOTO_EXTENSIONS = new Set([".jpg", ".jpeg", ".png"]);
let isCleanupRunning = false;

export const cleanupUnreferencedPhotos = async (
  uploadsDirectory = UPLOADS_DIRECTORY
): Promise<number> => {
  if (isCleanupRunning) return 0;
  isCleanupRunning = true;
  let deletedCount = 0;

  try {
    const [memories, entries] = await Promise.all([
      Memory.findAll({ attributes: ["photo"] }),
      fs.promises.readdir(uploadsDirectory, { withFileTypes: true }),
    ]);
    const linkedPhotos = new Set(
      memories.map((memory) => memory.photo).filter(Boolean)
    );
    const oldestAllowedMtime = Date.now() - ORPHANED_PHOTO_MIN_AGE_MS;

    for (const entry of entries) {
      if (!entry.isFile() || linkedPhotos.has(entry.name)) continue;
      if (!PHOTO_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) continue;

      const filePath = path.join(uploadsDirectory, entry.name);
      try {
        const stats = await fs.promises.stat(filePath);
        if (stats.mtimeMs > oldestAllowedMtime) continue;
        await fs.promises.unlink(filePath);
        deletedCount++;
      } catch (error) {
        console.error(`Не удалось удалить файл ${filePath}`, error);
      }
    }

    if (deletedCount) {
      console.log(`Удалено непривязанных фото: ${deletedCount}`);
    }
    return deletedCount;
  } catch (error) {
    console.error("Ошибка очистки непривязанных фото", error);
    return 0;
  } finally {
    isCleanupRunning = false;
  }
};

export const startPhotoCleanup = () => {
  void cleanupUnreferencedPhotos();
  const timer = setInterval(() => {
    void cleanupUnreferencedPhotos();
  }, PHOTO_CLEANUP_INTERVAL_MS);
  timer.unref();
};
