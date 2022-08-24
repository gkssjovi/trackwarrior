## Description

This extension create a link between [taskwarrior](https://github.com/GothenburgBitFactory/taskwarrior) and  [timewarrior](https://github.com/GothenburgBitFactory/timewarrior) that allows you to keep track of time spend on tasks. 
The time will be displayed in a new column in taskwarrior.

## Docker

```sh
git clone https://github.com/gkssjovi/trackwarrior.git
cd trackwarrior

sudo ln -s "$PWD/trackwarrior-docker" /usr/local/bin/trackwarrior
```

### Use tasksh as main frontend
```sh
sudo rm /usr/local/bin/trackwarrior
sudo ln -s "$PWD/trackwarrior-docker-tasksh" /usr/local/bin/trackwarrior
```

### Use taskwarrior-tui as main frontend
```sh
sudo rm /usr/local/bin/trackwarrior
sudo ln -s "$PWD/trackwarrior-docker-tui" /usr/local/bin/trackwarrior
```

## Local Installation

```sh
git clone https://github.com/gkssjovi/trackwarrior.git
cd trackwarrior

cp -r ./taskwarrior/hooks/. ~/.task/hooks
cp -r ./timewarrior/extensions/. ~/.timewarrior/extensions

cd ~/.task/hooks
chmod +x on-modify.trackwarrior on-add.trackwarrior

cd ~/.timewarrior/extensions
chmod +x trackwarrior-duration.js trackwarrior-ids.js
```

## Configuration

Copy those lines into your `~/.taskrc` file
```sh
uda.trackwarrior.type=string
uda.trackwarrior.label=Total active time
uda.trackwarrior.values=

uda.trackwarrior_rate.type=string
uda.trackwarrior_rate.label=Rate
uda.trackwarrior_rate.values=

uda.trackwarrior_total_amount.type=string
uda.trackwarrior_total_amount.label=Total amount
uda.trackwarrior_total_amount.values=

# this allow only one task to be active
max_active_tasks=1 
# when you delete the task, the time tracking will be also be deleted from timewarrior 
erase_time_on_delete=false 
# those are tags in taskwarrior.When you add one of them the time tracking will be deleted from timewarrior
clear_time_tags=cleartime,ctime,deletetime,dtime
create_time_when_add_task=false
rate_per_hour=10
rate_per_hour_decimals=2
rate_per_hour_project=Inbox:0,Other:10
rate_format_with_spaces=10
currency_format=de-DE,EUR
```

To display the new column on the next report modify the `~/.taskrc` file
```sh
report.next.labels=ID,St,Active,Age,Time,Rate,Total,...,Description,Urg
report.next.columns=id,status.short,start.age,entry.age,trackwarrior,trackwarrior_rate,trackwarrior_total_amount,...,description,urgency
```

## Usage
If you installed the docker version, just run `trackwarrior` to open the configured fronted (default: fish shell).

## Integrate with starship
1) Locally install taskwarrior
2) Install [starship](https://starship.rs/guide/#%F0%9F%9A%80-installation)
3) Set the correct rights for your local taskwarrior to read the data from the container
```sh
# trackwarrior needs to be used at least once
sudo chown "$(id -u):$(id -g)" ~/.trackwarrior-docker/.task/pending.data
```

4) Add the following to your starship.toml

```toml
[custom.current_task]
command = """TASKRC=~/.trackwarrior-docker/.taskrc TASKDATA=~/.trackwarrior-docker/.task unbuffer task starship-project | head -5 | tail -1 | sed "s/No matches./[No active task]/" | xargs"""
when = true
shell = "bash"
```

## Usage Examples

If you use a tasksh as a frontend, you can use the same commands as shown here,
but without typing task in the beginning.

If you use taskwarrior-tui as a frontend, check the [taskwarrior-tui documentation](https://kdheepak.com/taskwarrior-tui/) instead.

![Example](./assets/example.gif)

Create a new task 

`task add 'This is task 1' project:Example` \
`task next`
```sh
 ID St Age   Project Description    Urg
  1 P  10s   Example This is task 1    1

```
Start the new created task 

`task 1 start` \
`task next`
```sh
 ID St Active Age   Time    Project Description    Urg
  1 P    4s   18s   0:00:00 Example This is task 1    5
```

Stop the new created task

`task 1 stop` \
`task next` \
View the time tracking in taskwarrior
```sh
 ID St Age   Time    Project Description    Urg
  1 P  46s   0:00:15 Example This is task 1    1
```
View the time tracking in timewarrior 

`timew summary Example`

```sh
Wk  Date       Day Tags                                   Start      End    Time   Total
W43 2021-10-31 Sun Example, This is task 1, |20d4fa9c| 22:49:41 22:49:49 0:00:08
                   Example, This is task 1, |20d4fa9c| 22:50:04 22:50:11 0:00:07 0:00:15

                                                                                 0:00:15
```

Delete the time tracking 

`task 1 mod +cleartime`
or
`task 1 mod +ctime`
or
`task 1 mod +deletetime`
or
`task 1 mod +dtime`

