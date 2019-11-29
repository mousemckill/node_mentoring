const { pipeline } = require('stream');
const path = require('path');
const fs = require('fs');
const csv = require('csvtojson');

const csvFilePath = path.resolve(
	'csv',
	'node_mentoring_t1_2_input_example.csv'
);
const txtFilePath = path.resolve(
	'csv',
	'node_mentoring_t1_2_input_example.txt'
);

pipeline(
	fs.createReadStream(csvFilePath),
	csv(),
	fs.createWriteStream(txtFilePath),
	(err) => {
		if (err) {
			console.error(err);
		} else {
			console.log('Success!');
		}
	}
);
