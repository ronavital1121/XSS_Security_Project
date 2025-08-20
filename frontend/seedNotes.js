import fs from 'fs';
import path from 'path';
import promptSync from 'prompt-sync';

const prompt = promptSync(); 

function generateNotesJson(n) {
    const notes = [];

    for (let i = 1; i <= n; i++) {
        const note = {
            "id": i,
            "title": `Note ${i}`,
            "author": {
                "name": `Author ${i}`,
                "email": `mail_${i}@gmail.com`
            },
            "content": `Content for note ${i}`
        };
        notes.push(note);
    }

    const data = { "notes": notes };

    const dataDir = './data';
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir);
    }

    fs.writeFileSync(path.join(dataDir, 'notes.json'), JSON.stringify(data, null, 4), 'utf8');
    console.log(`Successfully saved ${n} notes to './data/notes.json'`);
}

const n = parseInt(prompt("Enter the number of notes to generate: "), 10);
if (isNaN(n) || n < 0) {
    console.log('Please enter a valid number greater than 0.');
} else {
    generateNotesJson(n); 
}
