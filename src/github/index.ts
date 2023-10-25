import buildMessage from './buildMessage';
import songChanges from './songChanges';

async function main(): Promise<0 | 1> {
	const [_node, _script, command] = process.argv;

	try {
		switch (command) {
			case 'buildMessage': {
				console.log(`out=${buildMessage()}`);
				return 0;
			}
			case 'songChanges': {
				console.log(`out=${await songChanges()}`);
				return 0;
			}
			default: {
				console.error(`No such command as '${command}'`);
				return 1;
			}
		}
	} catch (err) {
		if (typeof err === 'string') console.error(err);
		return 1;
	}
}

main().then((exitCode) => {
	process.exit(exitCode);
});
