const fs = require("fs");
const path = require("path");

const compress_images = require("compress-images");

const jimp = require("jimp");

const originalImagesFolder = "images/original";
const processedImagesFolder = "images/processed";

const INPUT_path_to_your_images = "images/processed/*.{jpg,JPG,jpeg,JPEG}";
const OUTPUT_path = "out/";


async function main() {
  await fs.readdir(originalImagesFolder, async (e, files) => {
    for (const file of files) {
      if (!fs.existsSync(path.join(processedImagesFolder, file))) {
        await (await jimp.read(path.join(originalImagesFolder, file)))
          .resize(jimp.AUTO, 1000)
          .quality(60)
          .writeAsync(path.join(processedImagesFolder, file));
        console.log(`Processed: ${file}`);
      } else {
        console.log(`Skipped: ${file}`);
      }
    }

    console.log("processing done");
    console.log("Start Compress");
    compress_images(
      INPUT_path_to_your_images,
      OUTPUT_path,
      { compress_force: false, statistic: true, autoupdate: true },
      false,
      {
        jpg: { engine: "mozjpeg", command: [] },
      },

      { png: { engine: false, command: false } },
      { svg: { engine: false, command: false } },
      { gif: { engine: false, command: false } },
      function (error, completed, statistic) {}
    );
  });
}

main();
