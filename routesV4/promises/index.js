let p = new Promise((resolve,reject) =>{
 let a = 1 + 1
 if (a == 2) {
     resolve('success')
 }else{
     reject('failed')
 }
 })

 p.then((message) =>{
   console.log(' this is in the then ' + message)
 }).catch((message)=>{
     console.log(' this is in the catch  ' + message)
 })

// const p1 = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         console.log('The first promise has resolved');

//         resolve(10);
//     }, 1 * 1000);

// });
// const p2 = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         console.log('The second promise has resolved');
//         resolve(20);
//     }, 2 * 1000);
// });
// const p3 = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         console.log('The third promise has resolved');
//         resolve(30);
//     }, 3 * 1000);
// });

// Promise.all([p1, p2, p3])
//     .then(results => {
//         const total = results.reduce((p, c) => p + c);

//         console.log(`Results: ${results}`);
//         console.log(`Total: ${total}`);
//     });

// const p1 = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         console.log('The first promise has resolved');
//         resolve(10);
//     }, 1 * 1000);

// });
// const p2 = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         console.log('The second promise has rejected');
            // reject('Failed');
//     }, 2 * 1000);
// });
// const p3 = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         console.log('The third promise has resolved');
//         resolve(30);
//     }, 3 * 1000);
// });


// Promise.all([p1, p2, p3])
//     .then(console.log) // never execute
//     .catch(console.log);

