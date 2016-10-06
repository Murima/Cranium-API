var test = require('./login');

test.eLogin("87469", "anaminyiamanda").then((data)=> {
  console.log(data);
});

test.aLogin("87469", "anaminyiamanda").then((data)=> {
  console.log(data);
})
