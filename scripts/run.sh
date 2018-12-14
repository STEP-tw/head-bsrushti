#! /bin/bash

node ./head.js -n5 sampleFiles/file1
node ./head.js -n 5 sampleFiles/file1
node ./head.js -5 sampleFiles/file1
node ./head.js sampleFiles/file1 sampleFiles/file2
node ./head.js -n 5 sampleFiles/file1 sampleFiles/file2
node ./head.js -n5 sampleFiles/file1 sampleFiles/file2
node ./head.js -5 sampleFiles/file1 sampleFiles/file2
node ./head.js -c5 sampleFiles/file1
node ./head.js -c 5 sampleFiles/file1
node ./head.js -c5 sampleFiles/file1 sampleFiles/file2
node ./head.js -c 5 sampleFiles/file1 sampleFiles/file2

node ./tail.js -n5 sampleFiles/file1
node ./tail.js -n 5 sampleFiles/file1
node ./tail.js -5 sampleFiles/file1
node ./tail.js sampleFiles/file1 sampleFiles/file2
node ./tail.js -n 5 sampleFiles/file1 sampleFiles/file2
node ./tail.js -n5 sampleFiles/file1 sampleFiles/file2
node ./tail.js -5 sampleFiles/file1 sampleFiles/file2
node ./tail.js -c5 sampleFiles/file1
node ./tail.js -c 5 sampleFiles/file1
node ./tail.js -c5 sampleFiles/file1 sampleFiles/file2
node ./tail.js -c 5 sampleFiles/file1 sampleFiles/file2
