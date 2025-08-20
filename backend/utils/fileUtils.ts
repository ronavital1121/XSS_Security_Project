
import fs from 'fs';

export const writeToFile = (filePath: string, data: string) => {
  fs.writeFileSync(filePath, data);
};

export const readFromFile = (filePath: string) => {
  return fs.readFileSync(filePath, 'utf-8');
};
