

const path = require('path');
const os = require('os');
const { Config } = require('./Config');
const fs = require('fs');

const settings = {
    taskrc: path.join(os.homedir(), '.taskrc'),
    maxActiveTasks: 1,       // if '1' you can start one one task at the time
    eraseTimeOnDelete: false, // if 'true' erase the time tracking when you delete the task
    clearTimeTags: ['cleartime', 'ctime', 'deletetime', 'dtime'],
    createTimeWhenAddTask: false,
    ratePerHour: 1,
    currencyFormat: ['de-De', 'EUR'],
    ratePerHourProject: ['Inbox:1', 'Other:10'],
    ratePerHourDecimals: 2,
    rateFormatWithSpaces: 10,
};

const configObj = {};

if (fs.existsSync(settings.taskrc)) {
    const configData = (fs.readFileSync(settings.taskrc, 'utf-8')).split('\n');

    for (const line of configData) {
        if (!(/^((\s+)?\#)/gim.test(line))) {
            let l = line.trim();
            if (l.length > 0) {
                const [left, right] = l.split('=');
                if (left && right) {
                    configObj[left.trim()] = right.trim();
                }
            }
        } 
    }
}

const config = new Config(configObj);

module.exports = {
    settings,
    config,
};