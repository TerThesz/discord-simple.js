import glob from 'glob';

export default async function scan_files(path: string): Promise<Array<string>> {
  return new Promise((resolve, reject) => {
    glob(path, (err, files) => {
      if (err) reject(err);
      else resolve(files);
    });
  });
}
