
const readline = require('readline');
const child_process = require('child_process');
const { spawn } = child_process;
const util = require('util');
const exec = util.promisify(child_process.exec);


const ACTION_OLD_START = 0x1;
const ACTION_CURRENT_START = 0x2;

const ACTION_START = 'start';
const ACTION_STOP = 'stop';

async function Init() {
    let input = [];

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    for await (const line of rl) {
        input.push(line);
    }

    const [oldInput, currentInput] = input;
    
    const old = JSON.parse(oldInput);
    const current = JSON.parse(currentInput);

    const call = async (command, args, silent = false) => {
        const data = [];
        const child = spawn(command, args);
        
        for await (const line of child.stdout) {
            if (!silent) {
                process.stdout.write(line)
            }
            data.push(line.toString());
        }

        return data.join('');
    };
    
    const flags = (actionFlags) => {
        let inputFlags = 0;
        if (current.start) {
            inputFlags |= ACTION_CURRENT_START;
        }
        if (old.start) {
            inputFlags |= ACTION_OLD_START;
        }

        return ((inputFlags & actionFlags) == actionFlags)
    };
    
    const getAction = () => {
        if (flags(ACTION_CURRENT_START) && !flags(ACTION_OLD_START)) {
            return ACTION_START;
        } else if (!flags(ACTION_CURRENT_START) && flags(ACTION_OLD_START)) {
            return ACTION_STOP;
        }
    };
    
    return {
        input: {
            old,
            current,
        },
        call,
        exec,
        flags,
        action: getAction(),
    };
}

module.exports = {
    Init,
    ACTION_OLD_START,
    ACTION_CURRENT_START,
    ACTION_START,
    ACTION_STOP,
};