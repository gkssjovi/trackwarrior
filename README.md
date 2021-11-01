## Description

This extension create a link between [taskwarrior](https://github.com/GothenburgBitFactory/taskwarrior) and  [timewarrior](https://github.com/GothenburgBitFactory/timewarrior) that allows you to keep track of time spend on tasks. 
The time will be displayed in a new column in taskwarrior.

## Installation

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

# this allow only one task to be active
max_active_tasks=1 
# when you delete the task, the time tracking will be also be deleted from timewarrior 
erase_time_on_delete=false 
# those are tags in taskwarrior.When you add one of them the time tracking will be deleted from timewarrior
clear_time_tags=cleartime,ctime,deletetime,dtime
```
Or write those commands into your terminal
```sh
task config uda.trackwarrior.type string
task config uda.trackwarrior.label Total active time
task config uda.trackwarrior.values ''

task config max_active_tasks 1
task config erase_time_on_delete false
task config clear_time_tags cleartime,ctime,deletetime,dtime
```

To display the new column on the next report modify the `~/.taskrc` file
```sh
report.next.labels=ID,St,Active,Age,Time,...,Description,Urg
report.next.columns=id,status.short,start.age,entry.age,trackwarrior,...,description,urgency
```
## Examples

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

