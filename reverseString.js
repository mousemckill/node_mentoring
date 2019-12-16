import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin
});

rl.on('line', input => {
  const reversed = input
    .split('')
    .reverse()
    .join('');

  console.log(`${reversed}`);
});

rl.on('close', () => {
  process.exit(0);
});
