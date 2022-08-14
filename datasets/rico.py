#!/usr/bin/env python3

"""
Normalizing the RICO dataset
"""
import argparse
import glob
import os
import json


def process_files(source_dir, output_dir):
    for app_path in glob.glob(os.path.join(source_dir, '*')):
        app_name = os.path.basename(app_path).replace('.', '__')

        for trace_path in glob.glob(os.path.join(app_path, '*')):
            print(f'{trace_path}')
            screenshots_path = os.path.join(trace_path, 'screenshots')
            if not os.path.exists(screenshots_path):
                continue

            for screenshot_path in glob.glob(os.path.join(screenshots_path, '*')):
                output_filename = os.path.basename(screenshot_path)
                output_path = os.path.join(
                    output_dir, f'{app_name}__{output_filename}')
                os.rename(screenshot_path, output_path)
                print(f'Moved {output_filename} to {output_path}')


def generate_index(screenshots_dir, output_index):
    index = {
        'screenshots': os.listdir(screenshots_dir)
    }
    with open(output_index, 'w') as f:
        json.dump(index, f)

    return output_index


def main():
    parser = argparse.ArgumentParser(description='Pre-processing RICO dataset')
    subparsers = parser.add_subparsers(dest='command')

    # Flatten
    parser_flatten = subparsers.add_parser('flatten')
    parser_flatten.add_argument('--input', dest='input_dir', type=str)
    parser_flatten.add_argument('--output', dest='output_dir', type=str)

    # Index
    parser_index = subparsers.add_parser('index')
    parser_index.add_argument('--screenshots-dir', type=str)
    parser_index.add_argument('--output-index', type=str)

    args = parser.parse_args()

    print(args.command)
    if args.command == 'flatten':
        if args.input_dir and args.output_dir:
            process_files(args.input_dir, args.output_dir)
    elif args.command == 'index':
        if args.screenshots_dir and args.output_index:
            generate_index(args.screenshots_dir, args.output_index)

        # if args.input_dir and args.output_dir:
        #     process_files(args.input_dir, args.output_dir)


if __name__ == '__main__':
    main()
