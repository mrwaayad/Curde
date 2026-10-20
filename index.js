 let title = document.getElementById('title');
let price = document.getElementById('price');
let taxes = document.getElementById('taxes');
let ads = document.getElementById('ads');
let discount = document.getElementById('discount');
let total = document.getElementById('total');
let count = document.getElementById('count');
let category = document.getElementById('category');
let submit = document.getElementById('submit');
let mood = 'create';
let tmp;

// ---------- حساب الإجمالي ----------
function getTotal() {
    if (price.value != '') {
        let result = (+price.value + +taxes.value + +ads.value) - +discount.value;
        total.innerHTML = '' + result;
        total.style.background = '#040';
    } else {
        total.innerHTML = '';
        total.style.background = '#ff11008f';
    }
}

// ---------- تحميل البيانات ----------
let dataPro;
if (localStorage.getItem('product') != null) {
    dataPro = JSON.parse(localStorage.getItem('product'));
} else {
    dataPro = [];
}

// ---------- إنشاء / تعديل ----------
submit.onclick = function () {
    let newPro = {
        title: title.value.toLowerCase(),
        price: price.value,
        taxes: taxes.value,
        ads: ads.value,
        discount: discount.value,
        total: total.innerHTML,
        count: +count.value || 1,
        category: category.value.toLowerCase(),
    };

    if (title.value != '' && price.value != '' && category.value != '' && newPro.count < 100) {
        if (mood === 'create') {
            for (let i = 0; i < newPro.count; i++) {
                dataPro.push({ ...newPro });
            }
        } else {
            dataPro[tmp] = newPro;
            mood = 'create';
            submit.innerHTML = 'create';
            count.style.display = 'block';
        }
        localStorage.setItem('product', JSON.stringify(dataPro));
        clearData();
        showData();
    }
};

// ---------- تفريغ الحقول ----------
function clearData() {
    title.value = '';
    price.value = '';
    taxes.value = '';
    ads.value = '';
    discount.value = '';
    total.innerHTML = '';
    count.value = '';
    category.value = '';
}

// ---------- بناء صف في الجدول ----------
function buildRow(i) {
    return `
    <tr>
        <td>${i + 1}</td>
        <td>${dataPro[i].title}</td>
        <td>${dataPro[i].price}</td>
        <td>${dataPro[i].taxes}</td>
        <td>${dataPro[i].ads}</td>
        <td>${dataPro[i].discount}</td>
        <td>${dataPro[i].total}</td>
        <td>${dataPro[i].category}</td>
        <td><button onclick="updateData(${i})">update</button></td>
        <td><button onclick="deleteData(${i})">delete</button></td>
    </tr>`;
}

// ---------- عرض البيانات ----------
function showData() {
    getTotal();
    let table = '';
    for (let i = 0; i < dataPro.length; i++) {
        table += buildRow(i);
    }
    document.getElementById('tbody').innerHTML = table;

    let btnDelete = document.getElementById('deleteAll');
    if (dataPro.length > 0) {
        btnDelete.innerHTML = `<button onclick="deleteAll()">delete All (${dataPro.length})</button>`;
    } else {
        btnDelete.innerHTML = '';
    }
}

showData();

// ---------- حذف ----------
function deleteData(i) {
    dataPro.splice(i, 1);
    localStorage.setItem('product', JSON.stringify(dataPro));
    showData();
}

function deleteAll() {
    dataPro = [];
    localStorage.removeItem('product');
    showData();
}

// ---------- تعديل ----------
function updateData(i) {
    if (dataPro[i] === undefined) {
        console.log('Product not found:', i);
        return;
    }
    title.value = dataPro[i].title;
    price.value = dataPro[i].price;
    taxes.value = dataPro[i].taxes;
    ads.value = dataPro[i].ads;
    discount.value = dataPro[i].discount;
    getTotal();
    count.style.display = 'none';
    category.value = dataPro[i].category;
    submit.innerHTML = 'Update';
    mood = 'update';
    tmp = i;
    scroll({
        top: 0,
        behavior: 'smooth'
    });
}

// ---------- البحث ----------
let searchMood = 'title';

function getSearchMood(id) {
    let search = document.getElementById('search');
    if (id == 'searchTitle') {
        searchMood = 'title';
    } else {
        searchMood = 'category';
    }
    search.placeholder = 'Search By ' + searchMood;
    search.focus();
    search.value = '';
    showData();
}

function searchData(value) {
    let table = '';
    value = value.toLowerCase();

    for (let i = 0; i < dataPro.length; i++) {
        if (dataPro[i][searchMood].toLowerCase().includes(value)) {
            table += buildRow(i);
        }
    }
    document.getElementById('tbody').innerHTML = table;
}
