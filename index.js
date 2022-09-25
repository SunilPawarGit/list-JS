#!/usr/bin/env node

const fs = require("fs");
const util = require("util");
const kuler = require("kuler");
const path = require("path");
//Method #2
const lstat = util.promisify(fs.lstat);
//Method #3
// const {lstat}=fs.promises;
const targetDir = process.argv[2] || process.cwd();

// console.log(process.argv);

fs.readdir(targetDir, async (err, filenames) => {
  //either
  //err === an error obj , which means somethink went wrong
  // or
  // err === null , which means everything is ok
  if (err) {
    //error handling code here
    console.log(err);
    return;
  }

  //New Good Aproach
  const statPromises = filenames.map((filename) => {
    return lstat(path.join(targetDir, filename));
  });
  const allStats = await Promise.all(statPromises);

  for (let stat of allStats) {
    const index = allStats.indexOf(stat);
    if (stat.isFile()) {
      console.log(filenames[index]);
    } else {
      console.log(kuler(filenames[index], "#F00"));
    }
  }

  //Bad Aproach
  // for(let filename of filenames){
  //     try{
  //         const stats = await lstat(filename);
  //         console.log(filename,stats.isFile());
  //     }catch(err){
  //         console.log(err);
  //     }
  // }
});

//Method #1

// const lstat=(filename)=>{
//     return new Promise((resolve,reject)=>{
//         fs.lstat(filename,(err,stats)=>{
//             if(err){
//                 reject(err);
//             }

//             resolve(stats)
//         });
//     });
// };
