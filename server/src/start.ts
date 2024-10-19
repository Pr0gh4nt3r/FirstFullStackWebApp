import { execSync } from 'child_process';

// Argumente aus der Kommandozeile holen
const serverType = process.argv[2] as 'auth' | 'data'; // Typ einschränken

if (!serverType) {
    console.error('Please provide a server type (e.g., auth or data)');
    process.exit(1);
}

// Mapping von serverType zu dem entsprechenden Skript
const scripts: { [key in 'auth' | 'data']: string } = {
    auth: 'yarn start:auth',
    data: 'yarn start:data'
};

if (scripts[serverType]) {
    try {
        execSync(scripts[serverType], { stdio: 'inherit' });
    }
    catch (error) {
        console.error(`Failed to start server: ${serverType}`);
        process.exit(1);
    }
}
else {
    console.error(`Unknown server type: ${serverType}`);
    process.exit(1);
}