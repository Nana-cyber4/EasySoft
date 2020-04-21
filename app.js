const express = require('express');

const app = express();
const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017';

// Database settings
const client = new MongoClient(url, { useUnifiedTopology: true, useNewUrlParser: true });

let mainDb;
let todoColl;

// this function connects the the mongodb
const establishConn = async () => {
    await client.connect();
    mainDb = client.db('employeedb');
    todoColl = mainDb.collection('todo');
    
} 
establishConn();

const inputOneTodo = async (data) => {
    try {
        const result = await todoColl.insertOne(data);
        return result;

    } catch (error) {
        console.log(error);
    }
}

const requestAll = async () => {
    try {
        const result = await todoColl.find({}).toArray();
        return result;
    } catch (error) {
        console.log(error)
}
}

const employees = [
        {
            name: "Frema Abena Adjei",
            ID: "EMP001",
            position: "HR Manager",
            image: "/images/Frema.jpg"
        },
        {
            name: "Peter Addai-Poku",
            ID: "EMP002",
            position: "IT Manager",
            image: "/images/kay.jpg"
        },
        {
            name: "Judith Eagleson",
            ID: "EMP003",
            position: "Production Manager",
            image: "/images/judith.jpg"
        },
        {
            name: "Don Kasa",
            ID: "EMP004",
            position: "Consultant",
            image: "/images/Domnick.jpg"
        }
]


app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false}));



app.get('/', (req, res)=>{
    res.render('home', {
        title:'Home'
    })
});

app.get('/employeeList',  (req, res)=>{
    res.render('employee', {
        title:'Employees',
        employees
    })
});


app.get('/todoList', async (req, res)=>{
    const todolist = await requestAll();
     res.render('todo', {
    todolist
     })
 });
 
 app.post('/insert',async function(req, res) {
    let item = {
        id:req.body.id,
        name: req.body.name,
        todo: req.body.todo
    };
let posted = await inputOneTodo(item);

   res.redirect('/todoList')
});

// Start application on port 4800
const port = 4800;
app.listen(port, ()=> {
    console.log(`Server has started on port ${port}`);
});