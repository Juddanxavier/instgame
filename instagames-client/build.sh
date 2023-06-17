#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e


# building the Next.js application
npx next build

# creating the build/cache/images folder and give it
# the read/write permissions
mkdir -p .next/cache/images
sudo chmod -R 666 .next/cache/images
