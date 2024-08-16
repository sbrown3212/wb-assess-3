import axios from "axios";

console.log('Hello World');

document.querySelector('#get-random-fossil').addEventListener('click', (e) => {
    axios.get('/random-fossil.json').then((response) => {
        // Deconstruct response data
        const { img, name } = response.data;

        // // Create img tag string
        // const imgTag = `<img src="${img}">`

        document.querySelector('#random-fossil-image').innerHTML = `<img src="${img}">`;
        document.querySelector('#random-fossil-name').innerText = name;
    })
})
