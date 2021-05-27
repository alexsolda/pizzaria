const q = (el) => document.querySelector(el);
const qs = (el) => document.querySelectorAll(el);
let valorAtual = 1;
let cart = [];
let keyModal = 1;

pizzaJson.map((pizza, index) => {

    let pizzaItem = q('.models .pizza-item').cloneNode(true);
    //Preencher as informações das pizzas
    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector('.pizza-item--img img').src = pizza.img;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = pizza.name
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = pizza.description;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${pizza.price.toFixed(2)}`;

    //ABRIR MODAL DE SELEÇÃO
    pizzaItem.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();
        valorAtual = 1;
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        keyModal = key;

        q('.pizzaWindowArea').style.opacity = 0;
        q('.pizzaWindowArea').style.display = 'flex';
        setTimeout(() => {
            q('.pizzaWindowArea').style.opacity = 1;
        }, 150)

        q('.pizzaBig img').src = pizzaJson[key].img;
        q('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        q('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        q('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;

        q('.pizzaInfo--size.selected').classList.remove('selected');


        qs('.pizzaInfo--size').forEach((size, sizeIndex) => {

            if (sizeIndex == 2) size.classList.add('selected');
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        })

        q('.pizzaInfo--qt').innerHTML = valorAtual;


        //FORMAS DE FECHAR O MODAL
        q('.pizzaInfo--cancelButton').addEventListener('click', closeModal);
        q('.pizzaInfo--cancelMobileButton').addEventListener('click', closeModal);
        q('.pizzaInfo--cancelButton').addEventListener('click', closeModal);


    })

    q('.pizza-area').append(pizzaItem);
});


function closeModal() {

    q('.pizzaWindowArea').style.opacity = 0;
    setTimeout(() => { q('.pizzaWindowArea').style.display = 'none' }, 500)
}

//SELEÇÃO DE QUANTIDADE
q('.pizzaInfo--qtmenos').addEventListener('click', () => {
    if (valorAtual > 1) {
        --valorAtual;
    }
    q('.pizzaInfo--qt').innerHTML = valorAtual;
    q('.pizzaInfo--actualPrice').innerHTML = `R$ ${(pizzaJson[keyModal].price * valorAtual).toFixed(2)}`;

})

q('.pizzaInfo--qtmais').addEventListener('click', () => {
    valorAtual++;
    q('.pizzaInfo--qt').innerHTML = valorAtual;
    q('.pizzaInfo--actualPrice').innerHTML = `R$ ${(pizzaJson[keyModal].price * valorAtual).toFixed(2)}`;
})

qs('.pizzaInfo--size').forEach((size, indexSize) => {
    size.addEventListener('click', (e) => {
        q('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
});

q('.pizzaInfo--addButton').addEventListener('click', () => {
    let size = parseInt(q('.pizzaInfo--size.selected').getAttribute('data-key'));

    let identifier = pizzaJson[keyModal].id + '@' + size;

    let key = cart.findIndex(item => item.identifier == identifier)
    if (key > -1) {
        cart[key].qt += valorAtual;
    } else {
        cart.push({
            identifier,
            id: pizzaJson[keyModal].id,
            size,
            qt: valorAtual
        });
    }
    updateCart();
    closeModal();
})


q('.menu-openner').addEventListener('click', () => {
    if(cart.length > 0) {
        q('aside').style.left = '0';
    }
});

q('.menu-closer').addEventListener('click', () => {
        q('aside').style.left = '100vw';
});

function updateCart() {
    q('.menu-openner span').innerHTML = cart.length;
    if (cart.length > 0) {
        q('aside').classList.add('show');
        q('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for (let i in cart) {
            let pizzaItem = pizzaJson.find(item => item.id == cart[i].id);
            subtotal += pizzaItem.price * cart[i].qt.toFixed(2);


            let cartItem = q('.models .cart--item').cloneNode(true);

            let pizzaSizeName;
            switch (cart[i].size) {
                case 0:
                    pizzaSizeName = 'P'
                    break;
                case 1:
                    pizzaSizeName = 'M'
                    break;
                case 2:
                    pizzaSizeName = 'G'
                    break;
            }
            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                if(cart[i].qt > 1) {
                    cart[i].qt--;
                }else {
                    cart.splice(i, 1);
                }
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                cart[i].qt++;
                updateCart();
            });
            


            q('.cart').append(cartItem);


        }

        desconto = (subtotal * 0.1).toFixed(2);
        total = (subtotal - desconto).toFixed(2);

        q('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        q('.desconto span:last-child').innerHTML = `R$ ${desconto}`;
        q('.total span:last-child').innerHTML = `R$ ${total}`;

    } else {
        q('aside').classList.remove('show');
        q('aside').style.left = '100vw';

    }
}



