const fs = require('fs/promises');
const path = require('path');
const chalk = require('chalk');

const notesPath = path.join(__dirname, 'db.json');

async function addNote(title) {
	const notes = await getNotes();
	const note = {
		title,
		id: Date.now().toString(),
	};

	notes.push(note);

	await saveNotes(notes);
	console.log(chalk.bgGreen(`Note was added with ID: ${note.id}`));
}

async function getNotes() {
	const notes = await fs.readFile(notesPath, { encoding: 'utf-8' });
	return Array.isArray(JSON.parse(notes)) ? JSON.parse(notes) : [];
}

async function saveNotes(notes) {
	await fs.writeFile(notesPath, JSON.stringify(notes));
}

async function removeNote(id) {
	const notes = await getNotes();

	const filtered = notes.filter((note) => note.id !== id);

	await saveNotes(filtered);
	console.log(chalk.bgRed(`Note with ID: "${id}" has been removed.`));
}

async function updateNote(id, title) {
	const notes = await getNotes();
	const note = notes.find((note) => note.id === id);
	if (note) {
		note.title = title;
		await saveNotes(notes);
		console.log(chalk.bgYellow(`Note with ID: "${id}" was updated!`));
		return note;
	}
	return null;
}

module.exports = {
	addNote,
	getNotes,
	removeNote,
	updateNote,
};
