const express = require('express');
const mongoose = require('mongoose');
const product = require('./models/productmodel');
const app = express();
const port = 8000;
// connect to db
mongoose.connect('mongodb://localhost:27017/mydb', { useNewUrlParser: true }).then(
    (() => console.log('hello mongo'))
).catch((err) => console.log(err));
//routes
app.get('/', (req, res) => {
    res.send('hello node api');
})
// create a middleware to send the data as JSon format
app.use(express.json());
//insert data to db
app.post('/product', async (req, res) => {

    try {
        const insertproducts = await product.create(req.body);
        res.status(200).json(insertproducts)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
});
//fetch all data from database
app.get('/products', async (req, res) => {
    try {
        const allproduct = await product.find({});
        res.status(200).json(allproduct)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})
//fetch product by id
app.get('/product/:id', async (req, res) => {
    try {
        const { id } = req.params; //uses object destructuring to extract the id property from the req.params object.
        const productById = await product.findById(id);
        res.status(200).json(productById)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }

})
//update the data
app.put('/product/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateproduct = await product.findByIdAndUpdate(id, req.body);
        if (!updateproduct) {
            return res.status(404).json({ message: `cannot find the product ${id}` });
        } else {
            const updatedProduct = await product.findById(id);
            res.status(200).json(updatedProduct);
        }

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})
//remove the data from database
app.delete('/product/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const productDelete = await product.findByIdAndDelete(id, req.body);
        if (productDelete) {
            res.status(200).json({ message: 'successfully deleted' })
        }

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})



app.listen(port, () => {
    console.log('yeee');

})