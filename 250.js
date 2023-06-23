const axios = require('axios');
const productoviyUrl = 'https://online.moysklad.ru/api/remap/1.2/entity/product';
const credentials = '51ec16e1fb32a7a1f254ab4219207ee2f509fe94';
const postConfig = {
    headers: {
        'Authorization': 'Bearer ' + credentials,
        'Content-Type': 'application/json'
    }
};
const getConfig = {
    headers: {
        'Authorization': 'Bearer ' + credentials
    }
};

async function getelement(offset, limit, additional_fields) {
    // params: offset | limit | additional_fields
    try{
        const response = await axios.get(`https://api.al-style.kz/api/elements?access-token=Wrjc68_ToNswpeioPYkIO751XftIwdS-&limit=${limit}&offset=${offset}&additional_fields=${additional_fields}`);
    return response.data[0]
    }catch (error){
        console.log(error);
    }
}
//  массив со всеми категориями продукта
async function getCategory(prodcats){
    try{
        const responseAllCats = await axios.get("https://api.al-style.kz/api/categories?access-token=Wrjc68_ToNswpeioPYkIO751XftIwdS-")
        const elementset = await axios.get(`https://api.al-style.kz/api/categories?access-token=Wrjc68_ToNswpeioPYkIO751XftIwdS-&id=${prodcats.category}`)
        let catsArray = []
        function findParentCategory(targetObj, array) {
            for (const obj of array) {
                if (obj.left < targetObj.left && obj.right > targetObj.right && obj.level === targetObj.level - 1) {
                    return obj;
                }
            }
            return null;
        }
        if(elementset.data[0].level == 2){
            const level1cats = findParentCategory(elementset.data[0],responseAllCats.data)
            catsArray.push(level1cats)
        }else if(elementset.data[0].level == 3){
            const level1cats = findParentCategory(elementset.data[0],responseAllCats.data)


            const level2Parent = findParentCategory(level1cats, responseAllCats.data);
            catsArray.push(level2Parent, level1cats)
        }else if(elementset.data[0].level == 4){
            const level1cats = findParentCategory(elementset.data[0],responseAllCats.data)
            const level2Parent = findParentCategory(level1cats, responseAllCats.data);
            const level3Parent = findParentCategory(level2Parent, responseAllCats.data);
            catsArray.push(level3Parent, level2Parent, level1cats,)
        }else if(elementset.data[0].level == 5){
            const level1cats = findParentCategory(elementset.data[0],responseAllCats.data)
            const level2Parent = findParentCategory(level1cats, responseAllCats.data);
            const level3Parent = findParentCategory(level2Parent, responseAllCats.data);
            const level4Parent = findParentCategory(level3Parent, responseAllCats.data);
            catsArray.push(level4Parent,level3Parent, level2Parent, level1cats,)
        }


        catsArray.push(elementset.data[0])
        return catsArray
    }catch (error){
        console.error(error)
    }
}
// Создание категорий продукта в моем складе
async function checkCreateFolder(catsArray){
    for (let key in catsArray){
        const istherethisfolder = await axios.get(`https://online.moysklad.ru/api/remap/1.2/entity/productfolder?filter=code~${catsArray[key].id}`, getConfig)
        if (istherethisfolder.data.meta.size != true){
            if(catsArray[key].level == 1){
                const dataLevel1 = {
                    "name": catsArray[key].name,
                    "code": String(catsArray[key].id),
                    "productFolder": {
                        "meta": {
                            "href": 'https://online.moysklad.ru/api/remap/1.2/entity/productfolder/b7d65e05-0c2e-11ee-0a80-13ea0021cda6',
                            "metadataHref": 'https://online.moysklad.ru/api/remap/1.2/entity/productfolder/metadata',
                            "type": 'productfolder',
                            "mediaType": 'application/json'
                        }
                    }
                }
                const createFresponse = await axios.post(`https://online.moysklad.ru/api/remap/1.2/entity/productfolder`, dataLevel1, postConfig)
            }else if(catsArray[key].level == 2){
                const istherethisfolder1 = await axios.get(`https://online.moysklad.ru/api/remap/1.2/entity/productfolder?filter=code~${catsArray[0].id}`, getConfig)
                const dataLevel2 = {
                    "name": catsArray[key].name,
                    "code": String(catsArray[key].id),
                    "productFolder": {"meta":istherethisfolder1.data.rows[0].meta}
                }
                const createFresponse = await axios.post(`https://online.moysklad.ru/api/remap/1.2/entity/productfolder`, dataLevel2, postConfig)
            }else if(catsArray[key].level == 3){
                const istherethisfolder2 = await axios.get(`https://online.moysklad.ru/api/remap/1.2/entity/productfolder?filter=code~${catsArray[1].id}`, getConfig)
                const dataLevel3 = {
                    "name": catsArray[key].name,
                    "code": String(catsArray[key].id),
                    "productFolder": {"meta":istherethisfolder2.data.rows[0].meta}
                }
                const createFresponse = await axios.post(`https://online.moysklad.ru/api/remap/1.2/entity/productfolder`, dataLevel3, postConfig)
            }else if (catsArray[key].level == 4){
                const istherethisfolder2 = await axios.get(`https://online.moysklad.ru/api/remap/1.2/entity/productfolder?filter=code~${catsArray[2].id}`, getConfig)
                const dataLevel4 = {
                    "name": catsArray[key].name,
                    "code": String(catsArray[key].id),
                    "productFolder": {"meta":istherethisfolder2.data.rows[0].meta}
                }
                const createFresponse = await axios.post(`https://online.moysklad.ru/api/remap/1.2/entity/productfolder`, dataLevel4, postConfig)
            }else if (catsArray[key].level == 5){
                const istherethisfolder2 = await axios.get(`https://online.moysklad.ru/api/remap/1.2/entity/productfolder?filter=code~${catsArray[3].id}`, getConfig)
                const dataLevel5 = {
                    "name": catsArray[key].name,
                    "code": String(catsArray[key].id),
                    "productFolder": {"meta":istherethisfolder2.data.rows[0].meta}
                }
                const createFresponse = await axios.post(`https://online.moysklad.ru/api/remap/1.2/entity/productfolder`, dataLevel5, postConfig)
            }
        }else {
    }
    }
    const catsArrayLength = Object.keys(catsArray).length;
    for (let i = 1; i <= catsArrayLength; i++) {
        if (i === catsArrayLength) {
            return catsArray[i - 1];
        }
    }
}




async function encodeImages(images) {
    const encodedImages = [];
    for (let i = 0; i < images.length; i++) {
        const response = await fetch(images[i]);
        const buffer = await response.arrayBuffer();
        const base64Image = Buffer.from(buffer).toString('base64');
        const filename = String(images[i]).split('/').pop().split('.')[0];
        encodedImages.push({filename, content: base64Image});
    }
    return encodedImages;
}

async function createproduct(data){
    const istherethisfolder = await axios.get(`https://online.moysklad.ru/api/remap/1.2/entity/productfolder?filter=code~${data.category}`, getConfig)
    let moyProduct = {}
    moyProduct.code = String(data.article)
    moyProduct.article = data.article_pn
    moyProduct.name = data.name
    moyProduct.images = await encodeImages(data.images);
    moyProduct.productFolder = {
        "meta": istherethisfolder.data.rows[0].meta
    }
    try {
    const resMoySklad = await axios.post("https://online.moysklad.ru/api/remap/1.2/entity/product", moyProduct, postConfig)
    // загрузка цены
    const upprice = await getprice(data)
    // загрузка остатков
    const upquanttity = await getQuantity(data)
    }catch (error){
        if (error.code === 'ERR_BAD_REQUEST') {
            return 1
    }}
}

async function getprice(data){
    const priceUrl = `https://online.moysklad.ru/api/remap/1.2/entity/product?filter=code=${data.article}`;
    const priceData = {
        minPrice: {value: data.price1 * 100},
        buyPrice: {value: data.price1 * 100},
        salePrices: [{
            value: data.price2 * 100,
            priceType: {
                meta: {
                    href: "https://online.moysklad.ru/api/remap/1.2/context/companysettings/pricetype/64243998-e40b-11ed-0a80-02cb0008f74d",
                    type: "pricetype",
                    mediaType: "application/json"
                }
            }
        }]
    }
    const productupdateprice = await axios.get(priceUrl,getConfig)
    const url2 = productupdateprice.data.rows[0].meta.href
    const updatePrice = await axios.put(url2, priceData, postConfig)
}
async function getQuantity(data, nextOffset){
    const priceUrl = `https://online.moysklad.ru/api/remap/1.2/entity/product?filter=code=${data.article}`;
    if (typeof data.quantity === 'string') {
        data.quantity = parseInt(data.quantity.replace(/\D/g, ''), 10);
    }
    const productupdateprice = await axios.get(priceUrl,getConfig)
    const url2 = productupdateprice.data.rows[0].meta.href
    if (data.quantity !== 0) {
        const quantityData = {
            "name": String(data.article) + String(data.category),
            organization: {
                meta: {
                    href: 'https://online.moysklad.ru/api/remap/1.2/entity/organization/6421ab78-e40b-11ed-0a80-02cb0008f744',
                    metadataHref: 'https://online.moysklad.ru/api/remap/1.2/entity/organization/metadata',
                    type: 'organization',
                    mediaType: 'application/json'
                },
            },
            store: {
                meta: {
                    href: 'https://online.moysklad.ru/api/remap/1.2/entity/store/bd58918b-f960-11ed-0a80-0b6000103170',
                    metadataHref: 'https://online.moysklad.ru/api/remap/1.2/entity/store/metadata',
                    type: 'store',
                    mediaType: 'application/json',
                    uuidHref: 'https://online.moysklad.ru/app/#warehouse/edit?id=bd58918b-f960-11ed-0a80-0b6000103170'
                },
            },
            positions: [
                {
                    quantity: data.quantity,
                    price: data.price1 * 100,
                    assortment: {
                        meta: {
                            href: `${url2}`,
                            metadataHref: "https://online.moysklad.ru/api/remap/1.2/entity/product/metadata",
                            type: "product",
                            mediaType: "application/json"
                        }
                    }
                }
            ]
        };
        try{
            const enterUrl = `https://online.moysklad.ru/api/remap/1.2/entity/enter`;
            const UpdateQuantity = await axios.post(enterUrl, quantityData, postConfig)
        }catch(error){
            if (error.code === 'ERR_BAD_REQUEST') {
                console.log("er bad req", nextOffset);
                await main(nextOffset)
            }
        }
    }
}

async function checkQuantityAndPrice(data, offset) {
    try {
        if (typeof data.quantity === 'string') {
            data.quantity = parseInt(data.quantity.replace(/\D/g, ''), 10);
        }
        const responseQuantity = await axios.get(`https://online.moysklad.ru/api/remap/1.2/entity/assortment?filter=code=${data.article}`, getConfig)
            if(responseQuantity.data.rows[0].quantity !== data.quantity){
                const id_enter = String(data.article) + String(data.category)
                const da = await axios.get(`https://online.moysklad.ru/api/remap/1.2/entity/enter?filter=name=${parseInt(id_enter)}`, getConfig)
                if (da.config.data == undefined) {
                    console.log("quantity == ",data.quantity);
                    getQuantity(data, offset)
                }
                else{
                    const resss = await axios.get(`https://online.moysklad.ru/api/remap/1.2/entity/enter/${da.data.rows[0].id}/positions`, getConfig)
                    const quantitychange = {
                        quantity: data.quantity
                    }
                    const changeQouantity = await axios.put(`https://online.moysklad.ru/api/remap/1.2/entity/enter/${da.data.rows[0].id}/positions/${resss.data.rows[0].id}`, quantitychange, postConfig)
                }
            }
            if (responseQuantity.data.rows[0].minPrice.value !== (data.price1 * 100)){
                const changePrice = getprice(data)
            }
            if (responseQuantity.data.rows[0].salePrices[0].value !== (data.price2 * 100)){
                const changePrice = getprice(data)
            }
    } catch (error) {
        console.error('Произошла ошибка в функции checkQuantityAndPrice:', error);
        await checkQuantityAndPrice(data)
    }
  }

const MAX_OFFSET = 10077;  // Максимальное значение offset

async function main(offset) {
  try {
    const product = await getelement(offset, 1, "images");
    const productCatsInfo = await getCategory(product);
    const createFolder = await checkCreateFolder(productCatsInfo);
    const createProduct = await createproduct(product);
    checkQuantityAndPrice(product, offset);
    const nextOffset = offset + 1;
    console.log(offset);
    if (nextOffset < MAX_OFFSET) {
      await main(nextOffset);
    }
  } catch (error) {
    console.error('Произошла ошибка:', error);
    await main(offset)
  }
}
main(2310);
