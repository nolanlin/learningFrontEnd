function promiseCreator() {
  return new Promise(resolve => {
      console.log('promise 1', new Date().getTime());
      setTimeout(resolve, 1000);
  });
}

function promiseCreator2() {
  return new Promise(resolve => {
      console.log('promise 2', new Date().getTime());
      setTimeout(resolve, 2000);
  });
}

const promiseCreatorList = [
  promiseCreator,
  promiseCreator2,
];

// 用reduce的方式
console.log('start', new Date().getTime());
const promistChain = promiseCreatorList.reduce((memo, current) => {
    return memo.then(current);
}, Promise.resolve())
promistChain.then(() => {
    console.log('end', new Date().getTime());
});

// 用for of async await方式实现逐个执行
async function main(){
    console.log('for of async start', new Date().getTime());
    async function forOfLoop(){
        for(const promiseInstance of promiseCreatorList){
            await promiseInstance();
        }
    }
    await forOfLoop();
    console.log('for of async end', new Date().getTime());
}

main(); 