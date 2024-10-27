// for (i = 1; i <= 2; i++) {
const main = async () => {
    let promise = await fetch("https://pokeapi.co/api/v2/pokemon/?limit=500&offset=500").then(res => res.json());
    console.log(promise);
    

    console.log('_---------------------------_');
    
    let secProm = await  fetch(promise.next).then(res => res.json());
    console.log(secProm);
    
    console.log('_---------------------------_');
    
    let trdProm = await  fetch(secProm.next).then(res => res.json());
    console.log(trdProm);
    
}
    
// }
main()


