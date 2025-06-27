#!/usr/bin/env bash
# Simple deploy script for GitHub Pages
npm run build && npx gh-pages -d dist
