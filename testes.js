const teste = require("./dist/lib/util/filesystem");

(async function(){    
    try {
       await teste.recursiveDeleteDirectory("/home/oroneki/Downloads/teste/src/");        
    } catch (error) {
        console.log("error: %o", error);
    };    
}());



// (async function(){
//     await teste.awaitableRmDir("/home/oroneki/Downloads/teste/src/tes/uaha/uha/uh/auh");
// }())

// (function(){
//     teste.awaitableRmDir("/home/oroneki/Downloads/teste/src/tes/uaha/uha/uh/auh")
//     .then(r => console.log(r))
//     .catch(e => console.log(e));
// }())