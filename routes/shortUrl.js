const router = require("express").Router();
const axios = require("axios");
const ShortUrl = require("../models/ShortUrl");

router.post("/", async(req, res) => {
    try{
        const getProduct = async (idproduct) =>{
            await axios.get("https://tiki.vn/api/v2/products/"+ idproduct)
            .then(function (res) {
                let product = res.data;
                const newUrl = {
                    full: full[0]+".html",
                    idproduct: idproduct,
                    name : product.name,
                    image : product.thumbnail_url,
                    price : product.price
                }
                ShortUrl.create(newUrl)
              })     
        } 
        let full = req.body.fullurl.split('.html')
        console.log(full);
        let temp = full[0].slice(-10, ).split('p');
        let idproduct =  temp[1];
        console.log(idproduct);
        await getProduct(idproduct);
        res.redirect("/")
    }catch{
        console.log("Lỗi tạo url");
    }
})

router.get('/:shortUrl', async(req, res) => {
    // console.log("okemm");
    try {
        console.log(req.params.shortUrl);
        const shortUrl = await ShortUrl.findOne({short: req.params.shortUrl} )
        if(shortUrl == null) return res.sendStatus(404);
        shortUrl.click++;
        await shortUrl.save()
        res.redirect(shortUrl.full)
    }
    catch{
        console.log("lỗi dẫn link");
    }
})
router.get("/", async (req, res) => {
    try{
        const shortUrls = await ShortUrl.find()
        res.status(200).json(shortUrls);
    }catch{
        console.log("không lấy được danh sách");
    }
});

module.exports = router;