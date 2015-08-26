---
author: "Steven Enten"
date: 2015-07-15
title: losh
description: One script to rule them all...
github: enten/losh
topics:
  - project
tags:
  - shell
  - bash
aliases:
  - "/page/losh/"
---

## Purpose

Used one script to rule the others. The losh script wraps the usage of the others. Technically, losh looks for `CMDUSAGE` and `CMDDESC` variables into the others scripts. That variables allow losh to print the usage of every scripts.

## Installation

```bash
# Change directory into your awesome project
$ cd ~/code/awesome-project

# Create directory to store your scripts
$ mkdir scripts

# Change directory into the new scripts directory
$ cd scripts

# Install losh
$ curl https://enten.github.io/losh/install-losh | sh
Install losh (from http://enten.github.io/losh/losh)
Install update-losh (from http://enten.github.io/losh/install-losh)

# Test losh
$ ./losh
NAME:
    losh - Lord of the shell scripts (one script to rull them all)

VERSION:
    0.0.1

USAGE:
    losh [command] [arg...]

COMMANDS:
    losh update-losh
                Update losh
    losh [?|h|help]
                Print this help message

```

## Test

```bash
# Change directory into the scripts directory
$ cd ~/awesome-project/scripts

$ echo '#!/bin/bash
CMDUSAGE="<username>"
CMDDESC="Print custom welcome message"
echo "Hello $1"' > hello

$ chmod +x hello

$ ./losh
NAME:
    losh - Lord of the shell scripts (one script to rull them all)

VERSION:
    0.0.1

USAGE:
    losh [command] [arg...]

COMMANDS:
    losh hello <username>
                Print custom welcome message
    losh update-losh
                Update losh
    losh [?|h|help]
                Print this help message

$ ./losh hello world
Hello world
```
