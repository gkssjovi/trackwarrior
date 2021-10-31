#!/usr/bin/env python3

import time
import os
from watchdog.observers import Observer
from watchdog.events import PatternMatchingEventHandler
import shutil

timewarrior_abs_dest = os.path.expanduser('~/.timewarrior/extensions')
timewarrior_src = './timewarrior/extensions'
timewarrior_abs_src = os.path.abspath(timewarrior_src)

taskwarrior_abs_dest = os.path.expanduser('~/.task/hooks')
taskwarrior_src = './taskwarrior/hooks'
taskwarrior_abs_src = os.path.abspath(taskwarrior_src)

if __name__ == '__main__':
    patterns = ['*']
    ignore_patterns = None
    ignore_directories = False
    case_sensitive = True
    timewarrior_event_handler = PatternMatchingEventHandler(patterns, ignore_patterns, ignore_directories, case_sensitive)
    taskwarrior_event_handler = PatternMatchingEventHandler(patterns, ignore_patterns, ignore_directories, case_sensitive)

    def watch_timewarrior(event):
        src_path = event.src_path
        is_directory = event.is_directory
        event_type = event.event_type

        if src_path == timewarrior_abs_src:
            return None

        src_path_rel = os.path.relpath(src_path, timewarrior_src)
        dest = os.path.join(timewarrior_abs_dest, src_path_rel)

        try:
            if event_type == 'deleted':
                if os.path.exists(dest) and not is_directory:
                    os.remove(dest)
                    print(f'{event_type}: {dest}')
            else:
                shutil.copyfile(src_path, dest)
                print(f'{event_type}: {dest}')
        except OSError as e:
            print(str(e))

    timewarrior_event_handler.on_created = watch_timewarrior
    timewarrior_event_handler.on_deleted = watch_timewarrior
    timewarrior_event_handler.on_modified = watch_timewarrior
    timewarrior_event_handler.on_moved = watch_timewarrior

    go_recursively = True
    timewarrior_observer = Observer()
    timewarrior_observer.schedule(timewarrior_event_handler, timewarrior_src, recursive=go_recursively)
    timewarrior_observer.start()

    def watch_taskwarrior(event):
        src_path = event.src_path
        is_directory = event.is_directory
        event_type = event.event_type

        if src_path == taskwarrior_abs_src:
            return None

        src_path_rel = os.path.relpath(src_path, taskwarrior_src)
        dest = os.path.join(taskwarrior_abs_dest, src_path_rel)

        try:
            if event_type == 'deleted':
                if os.path.exists(dest) and not is_directory:
                    os.remove(dest)
                    print(f'{event_type}: {dest}')
            else:
                shutil.copyfile(src_path, dest)
                print(f'{event_type}: {dest}')
        except OSError as e:
            print(str(e))

    taskwarrior_event_handler.on_created = watch_taskwarrior
    taskwarrior_event_handler.on_deleted = watch_taskwarrior
    taskwarrior_event_handler.on_modified = watch_taskwarrior
    taskwarrior_event_handler.on_moved = watch_taskwarrior

    go_recursively = True
    taskwarrior_observer = Observer()
    taskwarrior_observer.schedule(taskwarrior_event_handler, taskwarrior_src, recursive=go_recursively)
    taskwarrior_observer.start()

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        timewarrior_observer.stop()
        timewarrior_observer.join()

        taskwarrior_observer.stop()
        taskwarrior_observer.join()
